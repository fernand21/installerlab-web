-- InstallerLab one-time entitlement claims
--
-- Apply this after the existing account_entitlements table is present.  The
-- RPC is SECURITY INVOKER on purpose: only the Supabase Edge Function's
-- service role can execute it, so the transaction still runs with RLS
-- bypassed without exposing a SECURITY DEFINER endpoint through the Data API.

create table if not exists public.entitlement_claims (
  id uuid primary key default gen_random_uuid(),
  claim_id text not null unique
    check (claim_id ~ '^[A-Za-z0-9._:-]{8,120}$'),
  token_hash text not null unique
    check (token_hash ~ '^[0-9a-f]{64}$'),
  tier text not null check (tier in ('supporter', 'pro')),
  max_apps integer not null check (
    (tier = 'supporter' and max_apps = 5) or
    (tier = 'pro' and max_apps = 10)
  ),
  license_id text,
  source text,
  note text,
  issued_at timestamptz not null default timezone('utc', now()),
  expires_at timestamptz,
  redeemed_at timestamptz,
  redeemed_by uuid references auth.users(id),
  revoked boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  check (expires_at is null or expires_at >= issued_at)
);

create index if not exists entitlement_claims_redeemed_by_idx
  on public.entitlement_claims (redeemed_by);

alter table public.entitlement_claims enable row level security;
revoke all on table public.entitlement_claims from anon, authenticated;

-- This function is intentionally callable only by the service role used by
-- the Edge Function.  SELECT ... FOR UPDATE plus both updates are in the
-- same PostgreSQL function transaction, so a one-time claim can have only
-- one winner when two requests arrive concurrently.
create or replace function public.redeem_entitlement_claim(
  p_user_id uuid,
  p_claim_id text,
  p_token_hash text,
  p_tier text,
  p_max_apps integer,
  p_issued_at bigint,
  p_expires_at bigint default null
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_claim public.entitlement_claims%rowtype;
  v_current public.account_entitlements%rowtype;
  v_current_rank integer := 0;
  v_claim_rank integer;
  v_new_tier text;
  v_new_max_apps integer;
begin
  if p_user_id is null
     or p_claim_id is null
     or p_claim_id !~ '^[A-Za-z0-9._:-]{8,120}$'
     or p_token_hash is null
     or p_token_hash !~ '^[0-9a-f]{64}$'
     or p_tier not in ('supporter', 'pro')
     or p_max_apps not in (5, 10)
     or p_issued_at is null
     or p_issued_at < 0
  then
    return jsonb_build_object('success', false, 'reason', 'invalid');
  end if;

  select * into v_claim
  from public.entitlement_claims
  where claim_id = p_claim_id
  for update;

  if not found or v_claim.token_hash <> p_token_hash then
    return jsonb_build_object('success', false, 'reason', 'invalid');
  end if;

  if v_claim.revoked then
    return jsonb_build_object('success', false, 'reason', 'revoked');
  end if;

  if v_claim.redeemed_at is not null then
    return jsonb_build_object('success', false, 'reason', 'redeemed');
  end if;

  -- The signed payload uses integer Unix seconds.  Comparing at second
  -- precision avoids false negatives from timestamptz microseconds.
  if extract(epoch from v_claim.issued_at)::bigint <> p_issued_at
     or (v_claim.expires_at is null and p_expires_at is not null)
     or (v_claim.expires_at is not null and p_expires_at is null)
     or (v_claim.expires_at is not null
         and extract(epoch from v_claim.expires_at)::bigint <> p_expires_at)
     or v_claim.tier <> p_tier
     or v_claim.max_apps <> p_max_apps
  then
    return jsonb_build_object('success', false, 'reason', 'invalid');
  end if;

  if v_claim.issued_at > timezone('utc', now()) + interval '5 minutes' then
    return jsonb_build_object('success', false, 'reason', 'invalid');
  end if;

  if v_claim.expires_at is not null
     and v_claim.expires_at <= timezone('utc', now())
  then
    return jsonb_build_object('success', false, 'reason', 'expired');
  end if;

  v_claim_rank := case when v_claim.tier = 'pro' then 2 else 1 end;

  select * into v_current
  from public.account_entitlements
  where user_id = p_user_id
  for update;

  if not found then
    insert into public.account_entitlements (
      user_id, tier, max_apps, supporter, pro, verified_at
    ) values (
      p_user_id, v_claim.tier, v_claim.max_apps, v_claim.tier = 'supporter',
      v_claim.tier = 'pro', timezone('utc', now())
    );
    v_new_tier := v_claim.tier;
    v_new_max_apps := v_claim.max_apps;
  else
    v_current_rank := case
      when coalesce(v_current.pro, false) or v_current.tier = 'pro' then 2
      when coalesce(v_current.supporter, false) or v_current.tier = 'supporter' then 1
      else 0
    end;
    if v_current.tier = 'pro' then v_current_rank := 2; end if;
    if v_current.tier = 'supporter' and v_current_rank < 1 then v_current_rank := 1; end if;

    if v_current_rank >= v_claim_rank then
      v_new_tier := case when v_current_rank = 2 then 'pro'
                         when v_current_rank = 1 then 'supporter'
                         else 'free' end;
      v_new_max_apps := greatest(coalesce(v_current.max_apps, 1), v_claim.max_apps);
    else
      v_new_tier := v_claim.tier;
      v_new_max_apps := greatest(coalesce(v_current.max_apps, 1), v_claim.max_apps);
    end if;

    update public.account_entitlements
    set tier = v_new_tier,
        max_apps = v_new_max_apps,
        supporter = (v_new_tier in ('supporter', 'pro')),
        pro = (v_new_tier = 'pro'),
        verified_at = timezone('utc', now()),
        updated_at = timezone('utc', now())
    where user_id = p_user_id;
  end if;

  update public.entitlement_claims
  set redeemed_at = timezone('utc', now()), redeemed_by = p_user_id
  where id = v_claim.id;

  return jsonb_build_object(
    'success', true,
    'tier', v_new_tier,
    'max_apps', v_new_max_apps
  );
end;
$$;

revoke all on function public.redeem_entitlement_claim(
  uuid, text, text, text, integer, bigint, bigint
) from public, anon, authenticated;
grant execute on function public.redeem_entitlement_claim(
  uuid, text, text, text, integer, bigint, bigint
) to service_role;

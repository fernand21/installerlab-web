-- InstallerLab Analytics — Google Drive archive foundation
-- Applied to production on 2026-09-13.
-- Secrets are stored in Supabase Vault; no Google refresh token is exposed through public tables.

alter table public.account_drive_connections
  add column if not exists refresh_secret_id uuid,
  add column if not exists token_scope text,
  add column if not exists root_folder_name text not null default 'InstallerLab';

alter table public.account_analytics_projects
  add column if not exists drive_folder_id text;

create or replace function public.drive_store_refresh_secret(p_user_id uuid, p_refresh_token text)
returns uuid
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  sid uuid;
  secret_name text := 'installerlab_drive_refresh_' || p_user_id::text;
begin
  if p_user_id is null or nullif(trim(coalesce(p_refresh_token,'')),'') is null then
    return null;
  end if;

  select refresh_secret_id into sid
    from public.account_drive_connections
   where user_id = p_user_id;

  if sid is not null then
    perform vault.update_secret(sid, p_refresh_token, secret_name, 'InstallerLab Google Drive OAuth refresh token');
  else
    select vault.create_secret(p_refresh_token, secret_name, 'InstallerLab Google Drive OAuth refresh token') into sid;
  end if;

  insert into public.account_drive_connections(user_id, connected, provider, refresh_secret_id, updated_at)
  values(p_user_id, false, 'google', sid, now())
  on conflict (user_id) do update set
    refresh_secret_id = excluded.refresh_secret_id,
    updated_at = now();

  return sid;
end;
$$;

create or replace function public.drive_get_refresh_secret(p_user_id uuid)
returns text
language sql
security definer
set search_path = public, vault
as $$
  select v.decrypted_secret
    from public.account_drive_connections d
    join vault.decrypted_secrets v on v.id = d.refresh_secret_id
   where d.user_id = p_user_id
   limit 1
$$;

create or replace function public.drive_clear_refresh_secret(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, vault
as $$
declare sid uuid;
begin
  select refresh_secret_id into sid from public.account_drive_connections where user_id = p_user_id;
  update public.account_drive_connections
     set refresh_secret_id = null, connected = false, updated_at = now()
   where user_id = p_user_id;
  if sid is not null then
    delete from vault.secrets where id = sid;
  end if;
end;
$$;

revoke all on function public.drive_store_refresh_secret(uuid,text) from public, anon, authenticated;
revoke all on function public.drive_get_refresh_secret(uuid) from public, anon, authenticated;
revoke all on function public.drive_clear_refresh_secret(uuid) from public, anon, authenticated;
grant execute on function public.drive_store_refresh_secret(uuid,text) to service_role;
grant execute on function public.drive_get_refresh_secret(uuid) to service_role;
grant execute on function public.drive_clear_refresh_secret(uuid) to service_role;

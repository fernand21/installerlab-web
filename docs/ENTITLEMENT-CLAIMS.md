# InstallerLab entitlement claims

InstallerLab benefits are one-time, signed claims. Authentication is handled by the account session; the claim itself never grants access in browser JavaScript.

## Signed payload

The issuer creates a compact JSON object with these fields:

```json
{
  "v": 1,
  "claim_id": "IL-CLM-20260914-0001",
  "tier": "pro",
  "max_apps": 10,
  "license_id": "optional-administrative-id",
  "issued_at": 1789344000,
  "expires_at": null,
  "nonce": "unique-random-value"
}
```

`tier` must be `supporter` or `pro`. The supported limits are 5 and 10 Analytics applications respectively. `issued_at` and `expires_at` are integer Unix timestamps in UTC; `expires_at` may be `null`. `license_id` and `nonce` are administrative/anti-replay fields and are not shown to the user.

The issuer serializes the JSON as UTF-8, base64url-encodes those bytes without padding, and signs the exact encoded payload segment with **Ed25519**. The final token is:

```text
base64url(payload-json).base64url(ed25519-signature)
```

The QR points to:

```text
https://installerlab.website/account/?claim=TOKEN
```

The web client removes the query parameter after capturing it in tab-scoped session storage. It never sends the claim to Analytics.

## Database record

Store only the lower-case SHA-256 hex digest of the complete token in `public.entitlement_claims.token_hash`; do not store the signed token itself. Insert the same `claim_id`, tier, limit, and Unix timestamps (`to_timestamp(issued_at)` / `to_timestamp(expires_at)`). The table is RLS-enabled and has no browser read/write policy.

The `nonce` is covered by the signature, but it does not need a separate database column. It makes each issued payload distinct even when the other fields match.

## Public-key secret

Configure the Supabase Edge Function secret:

```text
INSTALLERLAB_CLAIM_PUBLIC_KEY=<32-byte Ed25519 public key, base64url without padding>
```

Keep the Ed25519 private key in the external issuer/administrative tool only. Never commit it, place it in HTML/JavaScript, or put it in a QR generator shipped to users.

## Redemption and administration

The `redeem-entitlement` Edge Function requires a valid Supabase Auth session. It verifies the signature, checks the payload against the database row, hashes the token, and calls the atomic `redeem_entitlement_claim` RPC. The RPC locks the claim row and updates the existing `account_entitlements` row in one transaction, so concurrent redemption has one winner. Existing higher tiers and limits are never downgraded.

To revoke a claim, an administrator sets `revoked = true` using a trusted server-side process. To expire it, set `expires_at` to a past timestamp. Do not expose either administrative operation to the browser.

## Deployment checklist

1. Apply `supabase/entitlements.sql` after confirming `account_entitlements` exists.
2. Set `INSTALLERLAB_CLAIM_PUBLIC_KEY` as a Supabase secret.
3. Deploy `supabase/functions/redeem-entitlement/index.ts` with JWT verification enabled.
4. Generate a test claim and verify free → Supporter, free → PRO, upgrade preservation, reuse rejection, revocation, expiry, signature tampering, and concurrent redemption.

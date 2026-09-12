# InstallerLab supporter registry

This folder backs the public supporter-certificate experience on GitHub Pages.

## Certificate policy

- Any verified contribution of **US$1 or more** receives one permanent InstallerLab Supporter ID and certificate.
- The certificate **does not expire**.
- A supporter keeps the same ID for later contributions; do not create duplicate IDs for repeat support.
- Contribution amounts are never shown on the certificate or public supporter entry.
- Public recognition is opt-in only.
- For a private supporter, store only `Private Supporter` (or an approved alias) in this public repository. Never put an email address, payment reference, legal name requested to remain private, Machine Code, receipt, or banking information in `data.json`.
- The certificate is project recognition and is not a tax receipt.

## ID format

Use sequential IDs and never reuse an issued number:

`INST-YYYY-00001`

Example: `INST-2026-00001`.

## Adding a supporter

Update `data.json` after verifying the contribution. Example public entry:

```json
{
  "id": "INST-2026-00001",
  "name": "Developer Alias",
  "level": "Official Supporter",
  "issued": "September 2026",
  "public": true
}
```

Private example:

```json
{
  "id": "INST-2026-00002",
  "name": "Private Supporter",
  "level": "Official Supporter",
  "issued": "September 2026",
  "public": false
}
```

Update the top-level `raised` value only with the aggregate campaign total. Do not publish per-person contribution amounts.

## PRO activation

The supporter certificate and PRO activation are separate. The current site policy states that contributions of US$10 or more may request one-machine PRO activation after manual verification. A smaller contribution still receives the permanent supporter certificate.

## Payment automation

The front end supports a future payment-provider success redirect to:

`/donate/?thanks=1`

That route displays the supporter thank-you animation. Secure payment confirmation and automatic registry writes require a server-side webhook or trusted automation; GitHub Pages alone must not be used to trust client-side payment claims.

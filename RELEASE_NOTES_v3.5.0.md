# InstallerLab v3.5.0 — Analytics, Tracking & Dashboard Update

InstallerLab v3.5.0 focuses on the new Analytics experience and the infrastructure required to turn installer events into useful deployment insight.

This release builds on the v3 packaging architecture and adds a much more complete web analytics layer connected to Supabase, with TrackID-based project separation, live data views, demo mode, richer visualizations, filters and reporting-oriented views.

## Highlights

- **Supabase-backed InstallerLab Analytics** — the Analytics website can read live project data through the public `analytics_summary` RPC without exposing raw database tables.
- **TrackID-based analytics** — each project can be queried independently using its own TrackID.
- **Full dashboard navigation** — Overview, Install activity, User base, Environment, Requirements, Install errors, Uninstalls, Launch & usage, Custom properties, Versions, Reports and Settings.
- **Live-data filters** — Period, Version, Package and Platform filters can be populated from the data returned by the backend.
- **Richer visualizations** — improved KPI cards, bar charts, doughnut-style health views, trend graphics and refined data tables.
- **Demo mode** — optional fictional data lets users explore the dashboard without affecting the backend.
- **Independent workspace scrolling** — the analytics data panel scrolls independently on desktop while filters remain accessible.
- **Cleaner connected state** — redundant connection banners are removed once the backend is connected.
- **Faster application connection flow** — connecting a TrackID no longer requires a complete page reload; cached summaries and abortable requests reduce unnecessary work.
- **Safer public configuration** — the static website uses only the Supabase publishable key. No `service_role` or database secret is embedded in the site.

## Analytics backend

The repository now contains the Supabase schema for InstallerLab Analytics.

The `analytics_events` table supports the current event model, including:

- `install_started`
- `install_succeeded`
- `install_failed`
- `uninstall_completed`
- `launch`
- `custom`

Event data can include application version, package type, architecture, Windows version, language, result, duration, error code, installation stage and custom JSON properties.

The public website does not receive direct table access. Instead, the backend exposes controlled RPC functions for event ingestion and analytics summaries.

## Connected dashboard data

The Analytics dashboard is now prepared to consume live data across the main views instead of limiting the backend connection to Overview.

Where the backend provides the information, v3.5 can surface:

- installation totals and outcomes;
- active installations and launches;
- versions and package types;
- Windows and architecture distributions;
- recent events;
- install failures, error codes and stages;
- uninstalls and uninstall reasons;
- requirements and prerequisite failures;
- environment details;
- optional custom properties;
- version adoption and upgrade information;
- tracking configuration status.

The dashboard does not invent live values. Missing backend fields remain empty until the corresponding information is actually returned by Supabase.

## Dashboard redesign

The Analytics page received a substantial visual refresh:

- unified SVG icon system;
- improved sidebar and active navigation state;
- modern KPI cards;
- improved tables and distribution bars;
- lightweight charts without adding a heavy chart dependency;
- better empty states;
- responsive layout;
- dedicated scroll behavior for the analytics workspace.

## Demo mode

Demo mode remains available as an explicit opt-in preview.

Demo values are clearly marked as fictional and are never written to the Analytics backend. This makes it possible to understand the dashboard before a project begins sending real events.

## Reports

Reporting is now centralized under the **Reports** section of Analytics instead of relying on a large global report button. This keeps the main dashboard cleaner and gives reports a dedicated place to grow into filtered support, QA, release and environment reports.

## Performance and reliability

The live analytics connection was refined to avoid unnecessary full-page reloads and repeated requests.

The current flow includes:

- in-place TrackID connection using browser history state;
- cached summary data for view changes;
- request cancellation when a newer analytics request starts;
- reuse of the already-loaded summary across dashboard sections.

## Privacy and security

InstallerLab Analytics is designed around project-level deployment telemetry rather than personal identity.

The Analytics website does not require a user name, email address, HWID, Machine Code or license key to display installer statistics.

The public static site uses a Supabase publishable key only, while raw event rows remain protected behind the backend schema and RPC layer.

## Compatibility

InstallerLab v3.5 remains part of the v3 product line. Existing v3 packaging concepts such as FSS projects, Application projects, Office Add-ins, QGIS Plugins, MSI, Bundle, Portable output, CLI workflows, SBOM and signing remain part of the same architecture.

## Release status

These notes document the v3.5 development update. Binary assets should only be attached to the GitHub release after the corresponding v3.5 InstallerLab build has been compiled and tested.

# InstallerLab v3.1.0 — CLI Fixes & Bundle Improvements

InstallerLab v3.1.0 is a focused maintenance release for the v3 line.

This release concentrates on two areas reported during real packaging tests: the command-line workflow and the Bundle path.

## Highlights

- **CLI corrections** — improves the reliability of headless build execution and result reporting.
- **Bundle improvements** — refines the Bundle build workflow and its integration with the MSI path.
- **Better build completion behavior** — CLI build success should reflect completion of the requested build artifact instead of returning success before the final output is ready.
- **Safer automation behavior** — intended to make InstallerLab more predictable for scripts, CI and external tools that call the CLI.

## CLI

InstallerLab v3 introduced headless commands such as:

```text
InstallerLab --cli analyze project.fss
InstallerLab --cli build project.fss --target msi
InstallerLab --cli build project.fss --target bundle
InstallerLab --cli sbom project.fss
```

v3.1 focuses on correcting the build path so external callers can rely on the exit result only after the requested build has finished and the expected artifact has been produced.

This is especially important for workflows that launch InstallerLab from another application, PowerShell, CI or automated release tooling.

## Bundle

The Bundle backend continues to use the MSI result as the main package and wraps it with the WiX Burn bootstrapper path.

v3.1 includes improvements around this Bundle workflow, with the goal of making Bundle generation more reliable and better aligned with the MSI build lifecycle.

## Scope

This is an incremental v3 update rather than a new major-version redesign. The existing v3 project model, FSS format, specialized Office/QGIS project support, MSI architecture, SBOM, signing and other v3 capabilities remain part of the same product line.

## Upgrade

Users of InstallerLab v3.0.0 can move to v3.1.0 as the next maintenance release.

As always, test generated installers on a clean Windows environment before production distribution.

# InstallerLab v2.0.0 — MSI, Bundle & Cleaner Build Pipeline

InstallerLab v2.0.0 is a major update focused on producing more Windows package formats from the same lightweight FSS project while keeping the build process clean and reproducible.

## Highlights

- **WiX Burn Bundle support** — build a single Bundle EXE that can chain prerequisite packages and the main MSI.
- **Improved MSI backend** — full application payload packaging, x64 installation support, embedded cabinet media and improved `{app}` mapping.
- **FSS remains the project** — the complete installer definition stays in one small, portable text file instead of large project caches.
- **ISS → FSS importer** — import supported Inno Setup script sections into InstallerLab's FSS format.
- **FSS analyzer** — validate project structure and identify errors, warnings and compatibility issues before packaging.
- **Prerequisite chain support** — local EXE/MSI prerequisites can be ordered before the main package in Bundle builds.
- **Directory permissions support** — `[Dirs]` rules such as `Permissions: users-modify` are exported to the MSI backend.
- **ZERO-TRASH build policy** — MSI, Bundle, Portable and B4J Portable staging is created under `%TEMP%\InstallerLab` and removed when the build finishes, including failed builds.
- **Portable-aware backend resolution** — InstallerLab can locate its packaging backend correctly when running from the B4J Portable distribution.
- **B4J Portable improvements** — reusable launcher cache, safer output publishing and cleaner temporary staging.

## Official downloads

For v2.0.0 the primary public downloads are intended to be:

### Recommended — Setup EXE

**InstallerLab-Setup.exe**

Use this build for a normal Windows installation. It is the recommended edition for users who want InstallerLab to prepare the required packaging toolchain during setup.

### Bundle EXE

**InstallerLab-Bundle.exe**

A WiX Burn bootstrapper edition of InstallerLab that packages the main MSI into a single executable and supports prerequisite chaining.

> Release binaries and SHA-256 hashes will be added to the GitHub Release when the final v2.0.0 files are uploaded.

## WiX requirement for MSI and Bundle creation

InstallerLab itself can run without WiX, but **creating MSI or Bundle packages requires WiX Toolset** and the extensions used by InstallerLab.

Required components:

- WiX Toolset CLI
- `WixToolset.BootstrapperApplications.wixext`
- `WixToolset.Util.wixext`

The normal Setup EXE is the recommended distribution because it can prepare these requirements during installation. Portable or MSI-based deployments should ensure the WiX toolchain is available before using MSI or Bundle build features.

## The FSS advantage

InstallerLab keeps the installer project definition in one lightweight `.fss` file. Build staging is temporary and disposable; the FSS is the durable project definition that can be backed up, versioned in Git, copied between machines and reopened later without carrying large build caches.

Conceptually:

```text
FSS       = permanent project definition
OutputDir = final requested artifact
TEMP      = build staging only, removed after build
```

## Documentation

Main documentation:
https://fernand21.github.io/installerlab-web/docs/

B4J Portable guide:
https://fernand21.github.io/installerlab-web/b4j/

Downloads:
https://fernand21.github.io/installerlab-web/download/

Support / activation:
https://fernand21.github.io/installerlab-web/donate/

## Notes

InstallerLab is an independent project. Product and company names mentioned in the documentation belong to their respective owners.

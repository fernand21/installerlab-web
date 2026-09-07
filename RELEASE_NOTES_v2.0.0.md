# InstallerLab v2.0.0 — MSI, Bundle & Cleaner Build Pipeline

InstallerLab v2.0.0 is a major update focused on producing more Windows package formats from the same lightweight FSS project while keeping the build process clean and reproducible.

## Highlights

- **WiX Burn Bundle support** — build a single Bundle EXE that can chain prerequisite packages and the main MSI.
- **Improved MSI backend** — full application payload packaging, x64 installation support, embedded cabinet media, improved `{app}` mapping and directory permissions.
- **FSS remains the project** — the complete installer definition stays in one small, portable text file instead of large project caches.
- **ISS → FSS importer** — import supported Inno Setup script sections into InstallerLab's FSS format.
- **FSS Analyzer** — validate project structure and identify errors, warnings and compatibility issues before packaging.
- **Prerequisite chain support** — local EXE/MSI prerequisites can be ordered before the main package in Bundle builds.
- **ZERO-TRASH build policy** — MSI, Bundle, Portable and B4J Portable staging is created under `%TEMP%\InstallerLab` and removed after successful and failed builds.
- **Portable-aware backend resolution** — InstallerLab can locate its packaging backend correctly when running from the B4J Portable distribution.
- **B4J Portable improvements** — safer output publishing and cleaner temporary staging.
- **Bundle branding** — the Burn bootstrapper uses InstallerLab-specific branding through WixStandardBootstrapperApplication.

## Official downloads

### Recommended — Setup EXE

**InstallerLab-Setup.exe**  
Size: `416823296` bytes  
SHA-256: `86c96a8a3255a2ed8622a9a100deb5a2e09c75a1be6977c8fa01e06675f26a22`

https://github.com/fernand21/installerlab-web/releases/download/v2.0.0/InstallerLab-Setup.exe

Use this build for a normal Windows installation. It is the recommended edition for users who want InstallerLab to prepare the packaging toolchain during setup.

### Bundle EXE

**InstallerLab_Bundle.exe**  
Size: `311692493` bytes  
SHA-256: `9093b2d7c2caaad0a5f4f1e3e80f4ad684e961aad9576aabccff6c823f958472`

https://github.com/fernand21/installerlab-web/releases/download/v2.0.0/InstallerLab_Bundle.exe

A WiX Burn bootstrapper edition of InstallerLab that packages the main MSI in a single executable and demonstrates the new Bundle workflow introduced in v2.

### Portable EXE

**InstallerLab_Portable.exe**  
Size: `316122624` bytes  
SHA-256: `49fda95dbd145b5901fdd2dc0ff1ede4e7c67876677b5494d0b1d6c845e7d86c`

https://github.com/fernand21/installerlab-web/releases/download/v2.0.0/InstallerLab_Portable.exe

Runs InstallerLab without a traditional installation.

### MSI — Windows Installer

**InstallerLab-Setup.msi**  
Size: `308671204` bytes  
SHA-256: `e856c5bde4553180193266a2b7eabd6023d27f12dbf026b2d8321363609632b6`

https://github.com/fernand21/installerlab-web/releases/download/v2.0.0/InstallerLab-Setup.msi

Useful for Windows Installer, `msiexec` and managed deployment scenarios.

## WiX requirement for MSI and Bundle creation

InstallerLab itself can run without WiX, but **creating MSI or Bundle packages requires WiX Toolset** and the extensions used by InstallerLab.

```powershell
dotnet tool install --global wix
wix extension add WixToolset.BootstrapperApplications.wixext --global
wix extension add WixToolset.Util.wixext --global
```

The normal Setup EXE is the recommended distribution because it can prepare these requirements during installation. Portable, MSI or Bundle-based deployments should ensure the WiX toolchain is available before using MSI or Bundle build features.

## Bundle vs. pure MSI

A pure MSI is the Windows Installer package for the main product. It does not automatically chain InstallerLab's `[Prerequisites]` flow.

Use **Bundle** when the project needs prerequisite EXE/MSI packages to run before the main MSI. InstallerLab generates the main MSI and WiX Burn builds the final bootstrapper EXE around the complete chain.

## The FSS advantage

InstallerLab keeps the installer project definition in one lightweight `.fss` file. Build staging is temporary and disposable; the FSS is the durable project definition that can be backed up, versioned in Git, copied between machines and reopened later without carrying large build caches.

```text
FSS       = permanent project definition
OutputDir = final requested artifact
TEMP      = build staging only, removed after build
```

## Documentation

Main documentation:  
https://fernand21.github.io/installerlab-web/docs/

Downloads:  
https://fernand21.github.io/installerlab-web/download/

Version history:  
https://fernand21.github.io/installerlab-web/changelog/

B4J Portable guide:  
https://fernand21.github.io/installerlab-web/b4j/

Support / activation:  
https://fernand21.github.io/installerlab-web/donate/

## Notes

InstallerLab is an independent project. Product and company names mentioned in the documentation belong to their respective owners.

# InstallerLab v3 — Windows Deployment Builder

InstallerLab is a **visual Windows deployment and installer builder** that keeps an editable **FSS** project as the source of truth.

Version 3 supports normal **Application** projects plus specialized **Microsoft Office VBA Add-ins** and **QGIS Python Plugins**, with project-aware build targets, CLI automation, SBOM generation, digital signing and Windows Services support.

Website: https://fernand21.github.io/installerlab-web/

Download: https://fernand21.github.io/installerlab-web/download/

Documentation: https://fernand21.github.io/installerlab-web/docs/

Tool comparison: https://fernand21.github.io/installerlab-web/comparison/

Releases: https://github.com/fernand21/installerlab-web/releases

## InstallerLab v3 highlights

- Visual Setup EXE authoring for Application projects
- MSI generation through the WiX backend
- WiX Burn Bundle with ordered EXE/MSI prerequisites and the main MSI in one bootstrapper EXE
- Portable packaging and dedicated B4J Portable workflow
- **OfficeAddin** projects for Excel, Word and PowerPoint VBA add-ins (`.xlam`, `.xla`, `.dotm`, `.dot`, `.ppam`, `.ppa`)
- **QgisPlugin** projects imported from folder or ZIP with stable PluginId and profile-aware deployment
- **Smart Build Targets**: Application keeps EXE/Portable/B4J Portable/MSI/Bundle; Office Add-in and QGIS Plugin use MSI/Bundle
- Headless CLI for project analysis, build and SBOM workflows
- CycloneDX and SPDX SBOM output
- Authenticode signing workflow using SignTool with verification
- Windows Services rules for compatible Application installer targets
- Generic automatic installer-language resolver with exact-culture, base-language, configured fallback and English fallback
- Editable, lightweight FSS project format as the durable project definition
- FSS Analyzer for errors, warnings and compatibility checks before packaging
- ISS → FSS importer for supported Inno Setup script sections
- ZERO-TRASH build staging under `%TEMP%\InstallerLab`, cleaned after successful and failed builds
- Installer themes, branding, registry, shortcuts, file associations, Open With and context-menu integration
- Direct official downloads with SHA-256 hashes and live GitHub Release counters

## Build-target matrix

| Project type | Setup EXE | Portable | B4J Portable | MSI | Bundle |
|---|:---:|:---:|:---:|:---:|:---:|
| Application | ✅ | ✅ | ✅ | ✅ | ✅ |
| Office Add-in | — | — | — | ✅ | ✅ |
| QGIS Plugin | — | — | — | ✅ | ✅ |

## InstallerLab v3.0.0

Version 3 expands InstallerLab from a general Windows packaging workspace into a project-aware deployment tool. Office Add-ins and QGIS Plugins are explicit project types rather than being forced through a generic MainExecutable model, while normal Application projects retain all existing build families.

Official v3.0.0 release:
https://github.com/fernand21/installerlab-web/releases/tag/v3.0.0

Release notes:
https://github.com/fernand21/installerlab-web/blob/main/RELEASE_NOTES_v3.0.0.md

SHA-256 checksums:
https://github.com/fernand21/installerlab-web/blob/main/SHA256SUMS_v3.0.0.txt

## Search-focused guides

- Windows deployment builder: https://fernand21.github.io/installerlab-web/windows-installer-builder/
- WiX Burn Bundle / bootstrapper builder: https://fernand21.github.io/installerlab-web/bundle-builder/
- MSI builder: https://fernand21.github.io/installerlab-web/msi-builder/
- Inno Setup ISS → FSS importer: https://fernand21.github.io/installerlab-web/inno-setup-importer/
- FSS Analyzer / installer project validator: https://fernand21.github.io/installerlab-web/fss-analyzer/
- Portable app builder: https://fernand21.github.io/installerlab-web/portable-app-builder/
- B4J installer / portable builder: https://fernand21.github.io/installerlab-web/b4j-installer/
- Inno Setup / Windows installer alternative: https://fernand21.github.io/installerlab-web/inno-setup-alternative/
- InstallerLab vs Inno Setup / WiX / Advanced Installer / NSIS / InstallShield: https://fernand21.github.io/installerlab-web/comparison/

InstallerLab is an independent project. Third-party product and project names referenced in documentation and comparisons belong to their respective owners.

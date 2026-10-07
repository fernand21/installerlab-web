# InstallerLab v4 — Windows Deployment + Web-to-EXE

InstallerLab is a **visual Windows deployment builder** that keeps an editable **FSS** project as the source of truth.

Version 4 adds a first-class **WebToExe** project type: start from a remote URL or local HTML application, prepare a Windows WebView2 desktop app, and create supported deployment outputs from the same project.

Website: https://installerlab.website/

Documentation: https://installerlab.website/docs/

Web-to-EXE guide: https://installerlab.website/web-to-exe/

Comparison: https://installerlab.website/comparison/

Releases: https://github.com/fernand21/installerlab-web/releases

## InstallerLab v4 highlights

- **WebToExe** ProjectType
- URL → Windows WebView2 application
- Local HTML / `index.html` → Windows application
- Web theme, toolbar, external-link and PWA controls
- Hide/disable web elements by ID, class or CSS selector
- Web-to-EXE single-file output
- WebToExe Setup EXE, MSI and Bundle targets
- WebView2 Evergreen prerequisite preparation for EXE/Bundle
- Project-aware build matrix across Application, OfficeAddin, QgisPlugin and WebToExe
- Multi-document/project sessions in the Monaco workspace
- Direct `.fss` startup handling from Windows
- Existing v3 capabilities retained: MSI, Bundle, Portable, B4J Portable, Office Add-ins, QGIS Plugins, CLI, SBOM, signing, Services and Analytics

## Build-target matrix

| Project type | Setup EXE | Portable | B4J Portable | MSI | Bundle | Web-to-EXE |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Application | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Office Add-in | — | — | — | ✅ | ✅ | — |
| QGIS Plugin | — | — | — | ✅ | ✅ | — |
| WebToExe | ✅ | — | — | ✅ | ✅ | ✅ |

## Web-to-EXE differentiation

InstallerLab v4 combines two stages in one project model:

```text
URL / local HTML
        ↓
Windows WebView2 application
        ↓
Web-to-EXE / Setup EXE / MSI / Bundle
```

The public comparison page documents this distinction against Inno Setup, WiX Toolset, Advanced Installer, NSIS and InstallShield using official sources reviewed in October 2026.

InstallerLab is an independent project. Third-party product and project names referenced in documentation and comparisons belong to their respective owners.

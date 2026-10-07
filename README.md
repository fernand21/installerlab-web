# InstallerLab v4 — Windows Deployment + Web-to-EXE

InstallerLab is a **visual Windows deployment builder** that keeps an editable **FSS** project as the source of truth.

Version 4.0.0 adds a first-class **WebToExe** project type: start from a remote URL or local HTML application, prepare a self-contained Windows WebView2 desktop app, and create supported deployment outputs from the same project.

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
- Self-contained WebView2 runtime with no separate WebView2 installation
- Project-aware build matrix across Application, OfficeAddin, QgisPlugin and WebToExe
- Multi-document/project sessions in the Monaco workspace
- Direct `.fss` startup handling from Windows
- Existing v3 capabilities retained: MSI, Bundle, Portable, B4J Portable, Office Add-ins, QGIS Plugins, CLI, SBOM, signing, Services and Analytics

## Online and offline modes

- **Online:** use a live URL. The desktop app follows server-side updates.
- **Offline/local:** package HTML, CSS, JavaScript, images and other local assets with the application. It can run without Internet when the app itself does not use remote APIs or resources.
- **Self-contained runtime:** WebView2 is included with the generated application; it does not need to be installed separately.
- **Web customization:** hide or disable elements by DOM ID, CSS class or CSS selector without editing the original website source.
- **Price:** Community remains free. Under the current site policy, PRO can be requested with an optional contribution of US$10 or more for one machine after verification.

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

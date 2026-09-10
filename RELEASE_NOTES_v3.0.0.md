# InstallerLab v3.0.0 — Specialized Installers, Smart Build Targets & Release Tooling

**One project. Multiple deployment formats. Specialized installers.**

InstallerLab v3.0.0 is the next major release after v2.0.0. It expands InstallerLab from a general Windows installer builder into a deployment workspace that can understand different project types and expose only the build formats that make sense for each one.

The lightweight `.fss` file remains the project definition and source of truth.

## Highlights

- **Microsoft Office Add-in projects** — import and package VBA add-ins for Excel, Word and PowerPoint.
- **QGIS Python Plugin projects** — import plugin folders or ZIP packages and build profile-aware installers.
- **Smart build-target matrix** — InstallerLab automatically enables the correct build formats according to the active FSS project type.
- **MSI + Bundle architecture for specialized projects** — Office and QGIS use the MSI backend, while Bundle wraps the same MSI instead of duplicating lifecycle logic.
- **Automatic installer-language resolution** — exact Windows UI culture, base language, configured fallback, then English.
- **Command-line interface** — analyze, build and generate SBOM output without opening the GUI.
- **SBOM generation** — CycloneDX and SPDX support integrated into the artifact pipeline.
- **Digital signing workflow** — Authenticode signing with SignTool and verification of the final artifact.
- **Windows Services support** — service declarations are represented in the common FSS model for supported installer targets.
- **FSS Analyzer and ISS → FSS migration** — validate InstallerLab projects and migrate supported Inno Setup configuration.
- **ZERO-TRASH build workflow** — temporary build state stays outside the permanent project and is cleaned after build operations.

## What changed since InstallerLab v2.0.0

### Specialized Microsoft Office Add-ins

InstallerLab now understands Office add-ins as a dedicated project type instead of forcing them through the normal application model.

Supported VBA add-in formats include:

- Excel: `.xlam`, `.xla`
- Word: `.dotm`, `.dot`
- PowerPoint: `.ppam`, `.ppa`

The FSS model can describe the Office host, add-in file, activation behavior and scope. Compatible legacy Office fields are normalized into the canonical project model when loaded.

Office Add-in projects use MSI and Bundle targets; irrelevant EXE and Portable targets are disabled automatically.

### Specialized QGIS Python Plugins

InstallerLab v3 adds a dedicated `QgisPlugin` project type. A plugin can be imported from a plugin folder or ZIP package. InstallerLab performs static inspection of `metadata.txt` and `__init__.py` without executing Python or launching QGIS.

The project model includes `PluginId`, source/source type, profile, activation mode, QGIS major version, minimum/maximum QGIS versions, icon and metadata.

Plugin identity is based on the stable `PluginId`, not the outer ZIP filename, so versioned source packages can continue to represent the same installed plugin.

QGIS projects are profile-aware, per-user deployments and do not require a fake `MainExecutable` or generic application `[Files]` payload.

### Smart build targets

InstallerLab now derives build availability from the canonical project type.

| Project type | EXE | Portable | B4J Portable | MSI | Bundle |
|---|:---:|:---:|:---:|:---:|:---:|
| Application | ✅ | ✅ | ✅ | ✅ | ✅ |
| Office Add-in | — | — | — | ✅ | ✅ |
| QGIS Plugin | — | — | — | ✅ | ✅ |

The same capability decision is reflected in the Ribbon, main menu and build-handler guards. Opening an FSS directly therefore produces the same project-aware behavior as creating it through an importer or wizard.

### MSI and Bundle specialization

The MSI backend recognizes specialized Office and QGIS payloads rather than treating every project as a conventional desktop application.

For Office and QGIS, Bundle reuses the MSI path:

```text
FSS
 ↓
BundleBuildEngine
 ↓
MsiBuildEngine
 ↓
private MSI under %TEMP%\InstallerLab
 ↓
WiX Burn
 ↓
final Bundle EXE
```

Bundle consumes the MSI result and effective package identity instead of reimplementing Office registration or QGIS plugin lifecycle behavior.

### Bundle improvements

The WiX Burn backend includes embedded main MSI support, prerequisite chaining, WixStandardBootstrapperApplication, BootstrapperApplications integration, Util support when required, project branding/icon/logo/theme handling, localization resources and private temporary MSI generation.

### Automatic installer language resolution

InstallerLab's installer-language resolver is generic rather than limited to hard-coded English/Spanish detection.

When automatic language selection is enabled, resolution follows:

```text
1. Exact Windows UI culture   (example: pt-BR)
2. Base language              (example: pt)
3. InstallerLanguage fallback
4. English fallback
```

Additional languages can be added through translation resources without redesigning the resolver. Unsupported cultures fall back safely.

### FSS Analyzer and Inno Setup migration

InstallerLab includes a dedicated FSS Analyzer for detecting project errors, warnings and incompatible configuration before packaging. Supported Inno Setup `.iss` project information can be translated into InstallerLab's FSS model, where the resulting `.fss` remains the durable editable project definition.

### Command-line interface

InstallerLab now includes a headless CLI path for automation and CI-oriented workflows.

```text
InstallerLab --cli analyze project.fss
InstallerLab --cli build project.fss --target msi
InstallerLab --cli build project.fss --target bundle
InstallerLab --cli sbom project.fss
```

The packaged launcher forwards CLI arguments to the application process and propagates the child exit code.

### SBOM and digital signing

InstallerLab can generate Software Bills of Materials in **CycloneDX** and **SPDX** formats. The artifact pipeline can reuse existing inventory/SHA-256 data where available.

Authenticode signing through Windows SignTool is also integrated, including certificate-file or certificate-store workflows, optional timestamping and verification of the final signed artifact.

### Windows Services

Windows service declarations are represented in the shared FSS model. Supported application installer targets can consume service rules, while Portable targets reject service-installation semantics.

### ZERO-TRASH build model

```text
FSS       = permanent project definition
OutputDir = final requested artifact
TEMP      = transient build workspace
```

Controlled MSI, Bundle and related staging is created in temporary InstallerLab workspaces and cleaned after successful or failed builds whenever safe to do so.

## Requirements for MSI and Bundle creation

InstallerLab itself can run without WiX. Creating MSI or Bundle packages requires the toolchain used by InstallerLab:

```text
WiX Toolset 7.x
WixToolset.BootstrapperApplications.wixext
WixToolset.Util.wixext
```

A compatible .NET SDK / `dotnet` environment must also be available. BootstrapperApplications is required for Bundle generation; Util is used when Bundle prerequisite detection requires it.

## Official downloads

### Recommended — Setup EXE

**InstallerLab-Setup.exe**  
Size: `512908288` bytes  
SHA-256: `f199cd08c652ebe690e6cae9ac7642cd3de922e7adf314ae60158a49f28d4e39`

https://github.com/fernand21/installerlab-web/releases/download/v3.0.0/InstallerLab-Setup.exe

### MSI — Windows Installer

**InstallerLab-Setup.msi**  
Size: `405930734` bytes  
SHA-256: `707995d5976c28bb64aa49579163b496642f24f91569444976d1481df09ea8a7`

https://github.com/fernand21/installerlab-web/releases/download/v3.0.0/InstallerLab-Setup.msi

### Bundle EXE

**InstallerLab_Bundle.exe**  
Size: `408917715` bytes  
SHA-256: `0822753130aa2c6079db67a77f56f449209b12ed5853ddea8815b753bbed4fc8`

https://github.com/fernand21/installerlab-web/releases/download/v3.0.0/InstallerLab_Bundle.exe

### Portable EXE

**InstallerLab_Portable.exe**  
Size: `413324800` bytes  
SHA-256: `1c4377deeed4991e5ccff222db56be5aad73f0086af4a069d5ceb0ac72c4a676`

https://github.com/fernand21/installerlab-web/releases/download/v3.0.0/InstallerLab_Portable.exe

These SHA-256 values come from the exact v3.0.0 assets currently uploaded to the GitHub release.

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

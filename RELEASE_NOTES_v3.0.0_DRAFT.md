# InstallerLab v3.0.0 — Specialized Installers, Smart Build Targets & Release Tooling

> **DRAFT — not for publication yet.**  
> Final release assets, exact file sizes and SHA-256 hashes are still pending.

**One project. Multiple deployment formats. Specialized installers.**

InstallerLab v3.0.0 is the next major release after v2.0.0. It expands InstallerLab from a general Windows installer builder into a deployment workspace that can understand different project types and expose only the build formats that make sense for each one.

The lightweight `.fss` file remains the project definition and source of truth.

## Highlights

- **Microsoft Office Add-in projects** — import and package VBA add-ins for Excel, Word and PowerPoint.
- **QGIS Python Plugin projects** — import plugin folders or ZIP packages and build profile-aware installers.
- **Smart build-target matrix** — InstallerLab automatically enables the correct build formats according to the active FSS project type.
- **MSI + Bundle architecture for specialized projects** — Office and QGIS use the validated MSI backend, while Bundle wraps the same MSI instead of duplicating lifecycle logic.
- **Automatic installer-language resolution** — exact Windows UI culture, base language, configured fallback, then English.
- **Command-line interface** — analyze, build and generate SBOM output without opening the GUI.
- **SBOM generation** — CycloneDX and SPDX support integrated into the artifact pipeline.
- **Digital signing workflow** — Authenticode signing with SignTool and verification of the final artifact.
- **Windows Services support** — service declarations are represented in the common FSS model for supported installer targets.
- **FSS Analyzer and ISS → FSS migration** — validate InstallerLab projects and migrate supported Inno Setup configuration.
- **ZERO-TRASH build workflow** — temporary build state is kept outside the permanent project and cleaned after build operations.

## What changed since InstallerLab v2.0.0

### Specialized Microsoft Office Add-ins

InstallerLab now understands Office add-ins as a dedicated project type instead of forcing them through the normal application-installation model.

Supported VBA add-in formats include:

- Excel: `.xlam`, `.xla`
- Word: `.dotm`, `.dot`
- PowerPoint: `.ppam`, `.ppa`

The FSS model can describe the Office host, add-in file, activation behavior and scope. Legacy Office add-in fields can be normalized into the canonical model when older compatible FSS files are loaded.

Office Add-in projects use the specialized MSI lifecycle and can also be wrapped in a Bundle.

### Specialized QGIS Python Plugins

InstallerLab v3 adds a dedicated `QgisPlugin` project type.

A QGIS Python plugin can be imported from either:

- a plugin folder; or
- a ZIP package.

InstallerLab performs static inspection of plugin metadata without executing Python or launching QGIS. The project model includes information such as:

- `PluginId`
- plugin source and source type
- target QGIS profile
- activation mode
- QGIS major version
- minimum and maximum QGIS versions
- icon and plugin metadata

The stable plugin identity is based on `PluginId`, not on the external ZIP filename. This means versioned files such as:

```text
Auditor_Red_Electrica_2.5.7.zip
Auditor_Red_Electrica_2.5.8.zip
Auditor_Red_Electrica_3.0.0.zip
```

can continue to represent the same installed plugin identity.

QGIS projects are profile-aware, per-user deployments and do not require a fake `MainExecutable` or generic application `[Files]` payload.

### Smart build targets

InstallerLab now derives build availability from the canonical project type.

| Project type | EXE | Portable | B4J Portable | MSI | Bundle |
|---|:---:|:---:|:---:|:---:|:---:|
| Application | ✅ | ✅ | ✅ | ✅ | ✅ |
| Office Add-in | — | — | — | ✅ | ✅ |
| QGIS Plugin | — | — | — | ✅ | ✅ |

The same capability decision is reflected in the Ribbon, the main menu and build-handler guards.

Opening an FSS directly therefore produces the same project-aware behavior as creating it through an importer or wizard.

### MSI and Bundle specialization

The MSI backend now recognizes specialized project payloads rather than treating every project as a conventional desktop application.

For Office and QGIS, Bundle remains a wrapper around the already validated MSI path:

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

The WiX Burn backend includes support for:

- embedded main MSI;
- prerequisite chaining;
- WixStandardBootstrapperApplication;
- BootstrapperApplications extension;
- Util extension when required by prerequisite detection;
- project branding, icon, logo and theme handling;
- localized Bundle resources;
- temporary internal MSI generation outside the final OutputDir.

### Automatic installer language resolution

InstallerLab's installer-language resolver is designed to detect Windows UI culture generically instead of hard-coding only English and Spanish.

When automatic language selection is enabled, the resolver uses this order:

```text
1. Exact Windows UI culture   (example: pt-BR)
2. Base language              (example: pt)
3. InstallerLanguage fallback
4. English fallback
```

This allows more installer languages to be added through translation resources without changing the central resolver.

If the detected language has no matching translation, InstallerLab falls back safely instead of failing the build or showing incomplete localization.

### FSS Analyzer

InstallerLab includes a dedicated FSS Analyzer for detecting project errors, warnings and incompatible configuration before packaging.

The same project model can also be analyzed from the CLI, helping keep GUI and automated builds aligned.

### Inno Setup migration

InstallerLab can import supported Inno Setup `.iss` project information and translate it into the InstallerLab FSS model.

The resulting `.fss` file remains editable and becomes the durable InstallerLab project definition.

### Command-line interface

InstallerLab now includes a headless CLI path for automation and CI-oriented workflows.

Examples:

```text
InstallerLab --cli analyze project.fss
InstallerLab --cli build project.fss --target msi
InstallerLab --cli build project.fss --target bundle
InstallerLab --cli sbom project.fss
```

The packaged launcher forwards CLI arguments to the application process and propagates the child exit code.

### SBOM generation

InstallerLab can generate Software Bills of Materials in:

- CycloneDX
- SPDX

The artifact pipeline can reuse an existing package inventory and SHA-256 values where available instead of performing unnecessary duplicate scans.

### Digital signing

The release pipeline includes Authenticode signing through Windows SignTool.

Supported configuration includes certificate-file or certificate-store workflows, optional timestamping and verification of the final signed artifact before the operation is reported as successful.

A dedicated **Build & Sign** interface exposes SBOM and signing configuration without requiring normal users to edit the FSS manually.

### Windows Services

Windows service declarations are now represented in the shared FSS project model.

Supported application installer targets can consume service rules, while Portable targets reject projects that depend on service-installation semantics.

### ZERO-TRASH build model

InstallerLab continues the v2 cleanup work and treats build staging as disposable state:

```text
FSS       = permanent project definition
OutputDir = final requested artifact
TEMP      = transient build workspace
```

MSI, Bundle and other controlled staging are created under temporary InstallerLab workspaces and removed after completed or failed builds whenever safe to do so.

### Existing application workflows remain available

Normal `ProjectType=Application` projects continue to support:

- Setup EXE
- Portable
- B4J Portable
- MSI
- Bundle

The new specialized project types do not remove those existing application workflows.

## Requirements for MSI and Bundle creation

InstallerLab itself can run without WiX, but creating MSI or Bundle packages requires the WiX toolchain used by InstallerLab.

The expected environment includes:

```text
WiX Toolset 7.x
WixToolset.BootstrapperApplications.wixext
WixToolset.Util.wixext
```

The BootstrapperApplications extension is required for Bundle generation. The Util extension is used when Bundle prerequisite detection needs it.

A compatible .NET SDK / `dotnet` environment must also be available for installing or updating the WiX global tool.

## Release assets

**Pending — do not publish hashes yet.**

The final file names, exact sizes and SHA-256 values will be calculated from the exact v3.0.0 artifacts selected for publication.

| Final asset | Size | SHA-256 |
|---|---:|---|
| Setup EXE | Pending | Pending |
| MSI | Pending | Pending |
| Bundle EXE | Pending | Pending |
| Portable | Pending | Pending |

No hash from v2.0.0 or from a test build will be reused.

## Final release checklist

Before publishing v3.0.0:

- confirm application version metadata is `3.0.0`;
- build the final release artifacts;
- use only the exact files that will be uploaded;
- calculate byte size and SHA-256 from those final files;
- verify Setup EXE, MSI, Bundle and Portable naming;
- perform the final Office and QGIS regression checks;
- update this draft with final asset information;
- generate `SHA256SUMS_v3.0.0.txt` from the exact release files;
- publish only after the hashes have been verified.

## Notes

InstallerLab is an independent project. Product and company names mentioned in the documentation belong to their respective owners.

# Documentación de InstallerLab v3

La documentación pública se sirve desde `docs/index.html`. InstallerLab v3 conserva la estética y la base documental existente, y añade una capa específica para las funciones de la versión 3.

Recursos principales:

- `assets/docs-v2.css` / `assets/docs-v2.js`: base visual y contenido heredado de la documentación.
- `assets/docs-v2-release.js`: funciones introducidas en v2 que siguen vigentes, como Bundle/Burn, FSS Analyzer, ISS → FSS y ZERO-TRASH.
- `assets/docs-v3-release.css` / `assets/docs-v3-release.js`: contenido y estilos de InstallerLab v3.
- `comparison/index.html` + `assets/comparison-v3.*`: comparativa independiente de herramientas.

El archivo `.fss` continúa siendo la definición ligera y permanente del proyecto. El staging de compilación sigue siendo temporal.

## Capacidades documentadas en v3

- ProjectType `Application`
- ProjectType `OfficeAddin`
- ProjectType `QgisPlugin`
- Smart Build Targets según el tipo de proyecto
- Setup EXE
- MSI mediante WiX 7.x
- Bundle / WiX Burn
- Portable
- B4J Portable
- Office Add-ins VBA para Excel, Word y PowerPoint
- QGIS Python Plugins desde carpeta o ZIP
- CLI headless (`analyze`, `build`, `sbom`)
- SBOM CycloneDX y SPDX
- Firma Authenticode mediante SignTool
- Windows Services para proyectos Application compatibles
- Resolución automática genérica de idioma
- FSS Analyzer
- Importador ISS → FSS
- Política ZERO-TRASH bajo `%TEMP%\InstallerLab`
- Idiomas, temas y branding
- Archivos, carpetas, accesos directos, registro e integración con Windows

## Matriz de build

| ProjectType | EXE | Portable | B4J Portable | MSI | Bundle |
|---|:---:|:---:|:---:|:---:|:---:|
| Application | ✅ | ✅ | ✅ | ✅ | ✅ |
| OfficeAddin | — | — | — | ✅ | ✅ |
| QgisPlugin | — | — | — | ✅ | ✅ |

## Bundle y WiX

InstallerLab puede ejecutarse sin WiX. Para crear MSI o Bundle, InstallerLab v3 está preparado para WiX 7.x.

Bundle usa `WixToolset.BootstrapperApplications.wixext` y utiliza `WixToolset.Util.wixext` cuando la detección de prerrequisitos lo necesita. Office y QGIS no duplican su lógica dentro de Burn: Bundle reutiliza el MSI especializado.

## Comparativa de herramientas

La comparativa dejó de estar enterrada como una sección de `/docs/`. Ahora tiene una URL propia:

`https://fernand21.github.io/installerlab-web/comparison/`

Allí se compara InstallerLab v3 con Inno Setup, WiX Toolset, Advanced Installer, NSIS e InstallShield, usando fuentes oficiales y evitando convertir una capacidad no localizada en una afirmación absoluta de que otro producto no puede realizarla.

## Publicación

El sitio se publica con GitHub Pages desde el repositorio `fernand21/installerlab-web`. No requiere un generador de documentación externo.

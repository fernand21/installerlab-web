# Documentación de InstallerLab v3.5

La documentación pública se sirve desde `docs/index.html`. InstallerLab v3.5 conserva la base documental de las versiones anteriores y añade una capa específica para arquitectura de paquete, Tracking & Statistics, TrackID e InstallerLab Analytics.

Recursos principales:

- `assets/docs-v2.css` / `assets/docs-v2.js`: base visual y contenido heredado de la documentación.
- `assets/docs-v2-release.js`: funciones introducidas en v2 que siguen vigentes, como Bundle/Burn, FSS Analyzer, ISS → FSS y ZERO-TRASH.
- `assets/docs-v3-release.css` / `assets/docs-v3-release.js`: Office Add-ins, QGIS Plugins, CLI, SBOM, signing, Services y Smart Build Targets de InstallerLab v3.
- `assets/docs-v3.5.css`: capa visual de documentación para v3.5.
- `assets/docs-v35.js`: documentación dinámica de arquitectura, Tracking & Statistics, TrackID y Analytics.
- `assets/docs-v35-runtime.css`: refinamientos visuales de los diagramas y componentes de v3.5.
- `comparison/index.html` + `assets/comparison-v3.*`: comparativa independiente de herramientas.

El archivo `.fss` continúa siendo la definición ligera y permanente del proyecto. El staging de compilación sigue siendo temporal.

## Capacidades documentadas en v3.5

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
- Arquitectura principal del paquete: `x64`, `x86` o `arm64`
- Tracking & Statistics dentro del Project Explorer
- Sección FSS `[Analytics]`
- TrackID con formato `IL-TRK-` + 24 caracteres hexadecimales
- Selección de eventos Install, Uninstall, Errors y Environment
- InstallerLab Analytics web por TrackID
- Modo Live y modo Demo claramente separados
- Navegación Analytics: Overview, Install activity, User base, Environment, Requirements, Install errors, Uninstalls, Launch & usage, Custom properties, Versions, Reports y Settings
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

## Arquitectura del paquete

`[Setup]` puede guardar:

```ini
Architecture=x64
```

Los valores canónicos son `x64`, `x86` y `arm64`. Los FSS antiguos que no incluyen esta clave usan `x64` como valor predeterminado explícito.

La arquitectura principal del paquete no debe confundirse con el campo `Architecture` de una regla de `[Prerequisites]`; son conceptos independientes.

## Tracking & Statistics

La configuración de Analytics pertenece al proyecto y puede persistirse así:

```ini
[Analytics]
Enabled=True
TrackID=IL-TRK-F909451351AE563D39B64184
TrackInstall=True
TrackUninstall=True
TrackErrors=True
TrackEnvironment=True
```

El TrackID se genera aleatoriamente con `SecureRandom`. Regenerar un TrackID existente requiere confirmación porque rompe la continuidad de la historia futura asociada al identificador anterior.

El panel de escritorio edita y persiste esta configuración y la pasa al pipeline de empaquetado. El panel no implementa por sí mismo la conexión HTTP ni consulta directamente el backend de Supabase; el editor, el runtime de instalación y la web Analytics son piezas separadas.

El FSS Analyzer valida la configuración: Analytics habilitado sin TrackID es un error y un TrackID fuera del patrón esperado se marca para revisión.

## InstallerLab Analytics

`https://installerlab.website/analytics/` es el dashboard web de telemetría. Una aplicación se conecta por TrackID y la vista puede mostrar los datos que el backend expone para ese proyecto.

La navegación actual incluye:

- Overview
- Install activity
- User base
- Environment
- Requirements
- Install errors
- Uninstalls
- Launch & usage
- Custom properties
- Versions
- Reports
- Settings

La interfaz Live no inventa valores: si un dato todavía no está disponible desde el backend, se mantiene vacío o como `—`. El modo Demo es opcional y está identificado como datos ficticios.

El backend de Analytics admite eventos como `install_started`, `install_succeeded`, `install_failed`, `uninstall_completed`, `launch` y `custom`. El esquema puede almacenar versión, tipo de paquete, arquitectura, versión de Windows, idioma, resultado, duración, código de error, etapa y un objeto JSON de propiedades opcionales.

La web pública consume funciones RPC controladas; las filas crudas de eventos no necesitan estar expuestas directamente al navegador para construir el resumen.

## Bundle y WiX

InstallerLab puede ejecutarse sin WiX. Para crear MSI o Bundle, InstallerLab v3.5 está preparado para WiX 7.x.

Bundle usa `WixToolset.BootstrapperApplications.wixext` y utiliza `WixToolset.Util.wixext` cuando la detección de prerrequisitos lo necesita. Office y QGIS no duplican su lógica dentro de Burn: Bundle reutiliza el MSI especializado.

## Comparativa de herramientas

La comparativa tiene una URL propia:

`https://installerlab.website/comparison/`

Allí se compara InstallerLab con Inno Setup, WiX Toolset, Advanced Installer, NSIS e InstallShield, usando fuentes oficiales y evitando convertir una capacidad no localizada en una afirmación absoluta de que otro producto no puede realizarla.

## Publicación

El sitio se publica con GitHub Pages desde el repositorio `fernand21/installerlab-web` y usa el dominio `installerlab.website`. No requiere un generador de documentación externo.

# Documentación de InstallerLab v2

La documentación pública se sirve desde `docs/index.html` y utiliza los recursos globales del sitio junto con:

- `assets/docs-v2.css`: diseño específico de la documentación.
- `assets/docs-v2.js`: contenido base, navegación, búsqueda y versión ES/EN.
- `assets/docs-v2-release.js`: ampliaciones de InstallerLab v2 para Bundle/Burn, FSS Analyzer, importador ISS → FSS, requisitos de WiX y ZERO-TRASH.

La documentación explica primero el flujo visual de InstallerLab y después expone el archivo `.fss` como referencia editable. El FSS sigue siendo la definición ligera y permanente del proyecto; el staging de compilación es temporal.

## Capacidades documentadas

- Setup EXE
- MSI mediante WiX
- Bundle / WiX Burn con cadena de prerequisitos
- Portable
- B4J Portable
- FSS Analyzer
- Importador ISS → FSS
- Política ZERO-TRASH bajo `%TEMP%\InstallerLab`
- Idiomas y temas
- Archivos y carpetas
- Accesos directos
- Registro e integración con Windows
- Reglas de instalación y desinstalación

## Bundle y WiX

InstallerLab puede ejecutarse sin WiX, pero la creación de MSI y Bundle requiere el CLI de WiX. Bundle usa además `WixToolset.BootstrapperApplications.wixext` y `WixToolset.Util.wixext`.

La documentación pública incluye los comandos necesarios y explica la diferencia entre un MSI puro y un Bundle que puede encadenar prerequisitos antes del MSI principal.

## Imágenes

Las capturas de pantalla pueden añadirse progresivamente en `docs/assets/` y enlazarse desde los scripts de documentación. Conviene usar nombres descriptivos y estables, por ejemplo `app-information.png`, `files-folders.png`, `languages.png`, `bundle.png`, `b4j-portable.png` y `windows-integration.png`.

## Publicación

El sitio se publica con GitHub Pages desde el repositorio `fernand21/installerlab-web`. No requiere un generador de documentación externo.

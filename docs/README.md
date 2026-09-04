# Documentación de InstallerLab

La documentación pública se sirve desde `docs/index.html` y utiliza los recursos globales del sitio junto con:

- `assets/docs-v2.css`: diseño específico de la documentación.
- `assets/docs-v2.js`: contenido, navegación, búsqueda y versión ES/EN.

La documentación está pensada para explicar primero el flujo visual de InstallerLab y después exponer el archivo `.fss` como referencia editable. El objetivo es mantener sincronizados los ejemplos con las capacidades reales del proyecto: Setup EXE, Portable, B4J Portable, MSI, idiomas, temas, archivos, accesos directos, registro, integración con Windows y reglas de instalación/desinstalación.

## Imágenes

Las capturas de pantalla pueden añadirse progresivamente en `docs/assets/` y enlazarse desde `assets/docs-v2.js`. Conviene usar nombres descriptivos y estables, por ejemplo `app-information.png`, `files-folders.png`, `languages.png`, `b4j-portable.png` y `windows-integration.png`.

## Publicación

El sitio se publica con GitHub Pages desde el repositorio `fernand21/installerlab-web`. No requiere un generador de documentación externo.

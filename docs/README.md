# Documentación de InstallerLab v4.0

InstallerLab v4 mantiene toda la arquitectura de deployment de v3.5 y añade **WebToExe** como un ProjectType de primera clase. La documentación pública ahora cubre el flujo completo **URL o HTML local → aplicación Windows WebView2 → Web-to-EXE / Setup EXE / MSI / Bundle**.

La guía dedicada se publica en:

- `https://installerlab.website/web-to-exe/`
- `docs/index.html#webtoexe-v4`
- `comparison/index.html#webtoexe-difference`

## Novedad principal de v4

`ProjectType=WebToExe` permite definir una aplicación web directamente en el FSS. InstallerLab prepara el host WebView2 y reutiliza su pipeline de deployment para generar los targets válidos del proyecto.

Capacidades documentadas:

- URL remota como origen de la aplicación.
- Carpeta HTML local con `index.html` para proyectos PRO.
- Tema web System / Light / Dark.
- Toolbar de navegación opcional.
- Apertura de enlaces externos en el navegador del sistema.
- Bloqueo del flujo de instalación PWA dentro del host.
- Ocultar elementos por ID, clase CSS o selector CSS.
- Desactivar elementos por ID, clase CSS o selector CSS.
- Web-to-EXE de archivo único.
- Setup EXE para la aplicación WebView2.
- MSI.
- WiX Burn Bundle.
- Preparación del Microsoft WebView2 Evergreen Bootstrapper en EXE/Bundle.
- Smart Build Targets específicos para WebToExe.
- ProjectSession para documentos/proyectos Monaco.
- Apertura de archivos `.fss` enviados por Windows sin duplicar una sesión ya abierta.

## Matriz v4

| ProjectType | Setup EXE | Portable | B4J Portable | MSI | Bundle | Web-to-EXE |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Application | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| OfficeAddin | — | — | — | ✅ | ✅ | — |
| QgisPlugin | — | — | — | ✅ | ✅ | — |
| WebToExe | ✅ | — | — | ✅ | ✅ | ✅ |

## Diferenciación Web-to-EXE

La comparación pública se actualizó con fuentes oficiales revisadas el 7 de octubre de 2026.

La afirmación se formula de manera verificable: **dentro de Inno Setup, WiX, Advanced Installer, NSIS e InstallShield, no se identificó otro flujo documentado que integre en un mismo ProjectType la creación de la app desde URL/HTML y la generación posterior de EXE/MSI/Bundle.**

Advanced Installer documenta un escenario similar, pero su guía de agosto de 2026 usa Nativefier para crear primero los binarios Windows y Advanced Installer después para empaquetarlos. Esto se refleja como flujo parcial/externo, no como incapacidad absoluta.

---

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

El TrackID se genera aleatoriamente con `SecureRandom`. Identifica el flujo estadístico de una aplicación dentro de InstallerLab Analytics. Regenerarlo inicia una nueva continuidad estadística.

Las cuatro categorías disponibles actualmente son:

- **Install**: actividad y resultado del proceso de instalación.
- **Uninstall**: eventos de desinstalación disponibles para el proyecto.
- **Errors**: código, etapa, versión y paquete cuando esos datos son enviados.
- **Environment**: información técnica disponible como Windows, arquitectura e idioma.

El esquema de eventos también puede almacenar versión de aplicación, tipo de paquete, resultado y duración. Analytics no debe inventar valores para campos que no hayan sido enviados.

El panel de escritorio edita `[Analytics]` y pasa esa configuración al pipeline de empaquetado. El editor, el runtime de instalación, el servicio Cloud y el dashboard web son componentes separados.

El FSS Analyzer valida la configuración: Analytics habilitado sin TrackID es un error y un TrackID fuera del patrón esperado se marca para revisión.

## Por qué Analytics requiere una cuenta

InstallerLab Desktop continúa siendo gratuito y sus funciones locales no dependen del registro web.

La cuenta se requiere para **InstallerLab Analytics** porque permite:

- asociar cada TrackID con un propietario autenticado;
- impedir que otra persona reclame el mismo TrackID;
- proteger el acceso al dashboard;
- aplicar el número de aplicaciones permitido por nivel;
- conservar la relación entre cuenta y aplicaciones en sesiones futuras;
- vincular de forma segura beneficios Supporter o PRO.

El servicio web de Analytics se activa para un proyecto cuando su TrackID queda registrado en una cuenta InstallerLab autenticada.

## Alcance de cada nivel

| Nivel | Aplicaciones Analytics | Dashboard | Historial | Categorías de Tracking |
|---|---:|---|---|---|
| Sin cuenta | 0 | No disponible | No disponible | No conectado a Cloud |
| Free registrado | 1 | Completo | Hasta 24 meses | Install, Uninstall, Errors, Environment |
| Supporter | 5 | Completo | Hasta 24 meses | Install, Uninstall, Errors, Environment |
| PRO | 10 | Completo | Hasta 24 meses | Install, Uninstall, Errors, Environment |

El nivel gratuito no recibe una versión recortada del dashboard. La diferencia principal entre los niveles es la cantidad de aplicaciones Analytics que pueden vincularse a la cuenta.

## Historial y retención

Cada TrackID conserva una **ventana móvil de hasta 24 meses**.

La retención se calcula usando la fecha de cada evento (`event_at`), no la fecha en que se creó el TrackID. Por eso dos proyectos pueden empezar en días, meses o años distintos y seguir exactamente la misma política.

Al avanzar el calendario, los eventos que quedan fuera de la ventana de 24 meses pueden eliminarse automáticamente. Esto permite mantener comparaciones recientes sin hacer crecer el almacenamiento de forma indefinida.

Ejemplo conceptual:

```text
Sep 2024 ───────────────── Sep 2026
        últimos 24 meses

Oct 2026 entra → Sep 2024 sale de la ventana
```

## InstallerLab Analytics

`https://installerlab.website/analytics/` es el dashboard web de telemetría. Una aplicación se conecta mediante su TrackID registrado en la cuenta.

Analytics puede presentar, cuando existen datos reales para el proyecto:

- actividad de instalación;
- instalaciones correctas y fallidas;
- desinstalaciones;
- versiones;
- tipo de paquete;
- arquitectura;
- versión de Windows;
- idioma;
- duración;
- errores por código y etapa;
- eventos recientes e informes derivados de esos campos.

Los filtros de período, versión, paquete y plataforma trabajan con datos reales. Si un dato no está disponible, la interfaz debe mantenerse vacía o mostrar `—` en lugar de simular valores.

El modo Demo es opcional y debe permanecer claramente separado del modo Live.

## Privacidad

TrackID pertenece a Analytics y no sustituye HWID, Machine Code ni claves de licencia.

Las estadísticas de instalación no necesitan nombre, correo, HWID, Machine Code ni clave de licencia. La cuenta protege el acceso al dashboard; el TrackID identifica el proyecto estadístico.

## Bundle y WiX

InstallerLab puede ejecutarse sin WiX. Para crear MSI o Bundle, InstallerLab v3.5 está preparado para WiX 7.x.

Bundle usa `WixToolset.BootstrapperApplications.wixext` y utiliza `WixToolset.Util.wixext` cuando la detección de prerrequisitos lo necesita. Office y QGIS no duplican su lógica dentro de Burn: Bundle reutiliza el MSI especializado.

## Comparativa de herramientas

La comparativa tiene una URL propia:

`https://installerlab.website/comparison/`

Allí se compara InstallerLab con Inno Setup, WiX Toolset, Advanced Installer, NSIS e InstallShield, usando fuentes oficiales y evitando convertir una capacidad no localizada en una afirmación absoluta de que otro producto no puede realizarla.

## Publicación

El sitio se publica con GitHub Pages desde el repositorio `fernand21/installerlab-web` y usa el dominio `installerlab.website`. No requiere un generador de documentación externo.

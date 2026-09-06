<!-- title: FSS Tutorial: Files, Registry, Shortcuts, Prerequisites and Run Actions -->
<!-- category: general -->

# FSS tutorial for InstallerLab projects

FSS is the editable project/script layer behind InstallerLab. The visual panels write and maintain many common rules for you, while FSS remains available when you need to inspect or customize the project directly.

The main sections include:

```ini
[Setup]
[Dirs]
[Files]
[Registry]
[Icons]
[Prerequisites]
[Run]
[InstallDelete]
[UninstallDelete]
```

## `[Setup]`: application information and install scope

The **Application information** panel covers project-level settings such as the installer icon, installation scope and destination path.

InstallerLab supports familiar constants such as:

| Constant | Purpose |
|---|---|
| `{app}` | Installed application directory |
| `{autopf}` | Program Files location selected for the install |
| `{localappdata}` | Current user's Local AppData |
| `{userdocs}` | Current user's Documents folder |

The UI also lets you choose between **Current user** and **All users (administrator)**. All-users installation requires elevation.

## `[Dirs]` and `[Files]`: files and folders

The **Files and folders** panel lets you add files or complete folders visually. You can set the source, `DestDir` and flags, then add or update the rule.

A common destination is:

```ini
DestDir: "{app}"
```

For a folder tree you may see flags such as recursive subdirectory creation depending on the rule you choose.

> [!TIP]
> Start by adding the application payload visually. Inspect FSS afterward when you want to understand the generated rule or make an advanced adjustment.

## `[Registry]`: custom application registry values

Use `[Registry]` for registry values that belong specifically to your application.

> [!IMPORTANT]
> Do **not** manually duplicate registry keys for Open With or Windows-integration options configured through **Menus & Integrations**. InstallerLab creates the required Windows integration keys automatically from that panel.

That distinction keeps the project much clearer:

```text
Application-specific registry data → [Registry]
Open With / generated shell integration → Windows Integration panel
```

## `[Icons]`: shortcuts

Start Menu and Desktop shortcuts can be enabled from **Installer & Cleanup**. InstallerLab writes the managed shortcut configuration into the project.

The panel also lets you control related installer behavior such as:

- create a Start Menu shortcut;
- create a Desktop shortcut;
- launch the application after installation;
- grant users modify permissions in `{app}` when needed.

## `[Prerequisites]`: visual dependency detection

The **Requirements and actions** panel can define dependencies without making you hand-write every rule.

For each dependency the UI can capture items such as:

- Name and Version
- Architecture
- Installer / source
- Parameters
- Detection type
- Detection data
- What to do if missing
- What to do if installation fails
- Success codes
- Reboot codes

The visible detection types include concepts such as:

```text
FileExists
RegistryValue
ExecutableExists
CommandExitCode
```

A dependency can therefore be checked first and installed only when it is missing.

```text
Check dependency
      ↓
Present? ── yes ──→ continue
   │
   no
   ↓
Install dependency
      ↓
Validate success/reboot code
      ↓
Continue or abort according to the rule
```

## `[Run]`: actions after installation

The same **Requirements and actions** area also manages `[Run]` actions. Use these for commands that must execute at the configured stage after files have been installed.

## `[InstallDelete]` and `[UninstallDelete]`: cleanup

The **Installer & Cleanup** panel can generate cleanup rules visually.

Examples include:

- remove residual files before installing or updating (`[InstallDelete]`);
- remove selected residual files during uninstall (`[UninstallDelete]`).

```text
{app}\bin\monaco
```

can be entered as an application-specific cleanup path when that is exactly what you intend to remove.

> [!WARNING]
> Keep cleanup paths narrow and application-specific. Broad deletion rules deserve extra testing.

## The intended workflow

```text
Visual panel
    ↓
Configure the feature
    ↓
Save changes
    ↓
InstallerLab updates FSS
    ↓
Inspect/edit FSS only when you need deeper control
    ↓
Build EXE / MSI / other supported output
```

This is the central idea behind InstallerLab: **visual when you want speed, FSS when you want control**.

**Documentation:** https://fernand21.github.io/installerlab-web/docs/  
**InstallerLab:** https://fernand21.github.io/installerlab-web/

---

*Official InstallerLab community tutorial.*
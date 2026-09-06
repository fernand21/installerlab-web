<!-- title: FSS Tutorial: Files, Registry, Shortcuts, Prerequisites and Run Actions -->
<!-- category: general -->

# FSS tutorial for InstallerLab projects

FSS is the editable project/script layer behind InstallerLab. The visual designer is convenient for common work, while FSS gives you a direct way to inspect and control installer rules.

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

## `[Setup]`

Use this section for project-level installer settings such as application identity and setup behavior.

## `[Dirs]` and `[Files]`

`[Dirs]` describes directories the installation needs. `[Files]` controls what is copied into the installed application.

> [!TIP]
> Keep payload rules predictable. A clean payload layout makes upgrade and uninstall troubleshooting much easier.

## `[Registry]`

Use registry rules only when the application needs them. InstallerLab can also use registry data as part of Windows integration workflows.

## `[Icons]`

Shortcut definitions belong here. InstallerLab distinguishes managed shortcut rules from manual rules so advanced FSS edits can be preserved.

## `[Prerequisites]`

Prerequisites let the installer check whether a dependency is present and decide what should happen when it is missing. Detection concepts include file checks, registry checks, executable checks and command exit codes.

## `[Run]`

Use `[Run]` for commands that need to execute as part of installation or after the application has been installed.

<details>
<summary><strong>Useful InstallerLab constants</strong></summary>

| Constant | Purpose |
|---|---|
| `{app}` | Installed application directory |
| `{autopf}` | Program Files location selected for the install |
| `{localappdata}` | Current user's Local AppData |
| `{userdocs}` | Current user's Documents folder |

</details>

## Cleanup sections

`[InstallDelete]` and `[UninstallDelete]` are useful when the installer needs explicit cleanup rules.

> [!WARNING]
> Cleanup rules deserve extra testing. Prefer a narrow application-specific path over a broad delete rule.

```text
Visual editor → generate/modify rules → inspect FSS → build → test
                      ↑                     │
                      └──── advanced edits ─┘
```

**Documentation:** https://fernand21.github.io/installerlab-web/docs/  
**InstallerLab:** https://fernand21.github.io/installerlab-web/

---

*Official InstallerLab community tutorial.*
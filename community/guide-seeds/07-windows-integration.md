<!-- title: Windows Integration Tutorial: Shortcuts, File Associations and Context Menus with InstallerLab -->
<!-- category: general -->

# Windows integration with InstallerLab

A Windows installer often needs to do more than copy files. InstallerLab can keep common Windows integration rules in the same project as the application payload, including **shortcuts, registry entries, file associations, Open With integration and context-menu commands**.

## Shortcuts

Shortcut rules belong in the `[Icons]` section of FSS. Use the visual editor for common shortcuts, then inspect the generated FSS when you need more control.

```ini
[Icons]
; Shortcut rules for the installed application.
```

> [!TIP]
> Create only the shortcuts users actually need. A Start Menu shortcut is usually enough for many desktop applications; add a Desktop shortcut only when it improves the workflow.

## File associations

A file association connects a file extension with your installed application. A complete association normally needs a file type identity, the executable used to open it and the correct command-line parameter for the selected file.

```text
User double-clicks a document
          ↓
Windows resolves the association
          ↓
{app}\YourApp.exe "selected-file"
```

## Open With

Open With integration can make your application available without forcing it to become the default handler for every compatible file.

## Context menus

InstallerLab can create shell commands and context-menu entries, including parameterized actions and cascading submenu scenarios.

<details>
<summary><strong>Context-menu design checklist</strong></summary>

- Use a short action name.
- Pass the selected path with the correct quoting.
- Point commands to the installed executable under `{app}`.
- Avoid adding too many top-level shell commands.
- Test files and folders separately when both are supported.
- Verify uninstall removes only the integration created by your application.

</details>

## Registry rules

Windows shell integration is backed by registry configuration. InstallerLab lets registry and integration rules live with the rest of the installer project instead of requiring a separate post-install script.

> [!IMPORTANT]
> Test shell integration on a clean Windows account and after uninstall. Registry mistakes can leave stale menu entries or broken file associations even when the application files were removed correctly.

## Why keeping integration in the installer project helps

| Approach | Benefit |
|---|---|
| Visual integration editor | Faster setup for common Windows behaviors |
| Editable FSS | Inspect and customize the generated rules |
| Same project | Payload and Windows integration change together |
| Uninstall rules | Easier to test cleanup as part of the package |

**InstallerLab features:** https://fernand21.github.io/installerlab-web/features/  
**Documentation:** https://fernand21.github.io/installerlab-web/docs/  
**InstallerLab:** https://fernand21.github.io/installerlab-web/

---

*Official InstallerLab community tutorial.*
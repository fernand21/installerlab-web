<!-- title: How to Build a Windows EXE Installer with InstallerLab — Step by Step -->
<!-- category: general -->

# Build a Windows EXE installer with InstallerLab

InstallerLab is a **visual Windows installer builder** that also keeps the project editable through **FSS**. The normal workflow is to configure the project from the panels, save the changes and build the Setup EXE from the same project source.

## 1. Create or open a project

Use **New**, **Open**, **Save** and **Save as** from the ribbon to manage the InstallerLab project.

The Project Explorer keeps the most common packaging areas together:

```text
Application information
Files and folders
Menus & Integrations
Registry
Shortcuts
Installer & Cleanup
Themes
Languages
Requirements & Actions
Script / Automation
```

## 2. Configure Application information

The **Application information** panel is where you define core installer behavior such as the installer icon, installation scope and destination path.

The installation scope can be selected visually:

- **Current user**
- **All users (administrator)**

For the install path you can use InstallerLab constants such as:

```text
{autopf}\{AppName}
{localappdata}\{AppName}
{userdocs}\{AppName}
```

> [!NOTE]
> All-users installation requires UAC elevation. The editor lets you choose the scope; Windows still enforces the required permissions at install time.

## 3. Add files and folders

Open **Files and folders** and use **Add files...** or **Add folder...**.

The panel exposes the important FSS values directly:

- Source
- `DestDir`
- Flags

A typical application payload targets:

```ini
DestDir: "{app}"
```

For complete folder trees, InstallerLab can generate the appropriate recursive file rule instead of requiring you to type every file manually.

## 4. Configure shortcuts and installer behavior

In **Installer & Cleanup** you can enable common options such as:

- Create a Start Menu shortcut
- Create a Desktop shortcut
- Launch the application after installation
- Grant users modify permissions in `{app}` when your application needs that behavior

The same panel can also maintain `[InstallDelete]` and `[UninstallDelete]` cleanup paths.

## 5. Configure Windows integration only when needed

**Menus & Integrations** handles features such as Open With and context menus.

For Open With, the normal setup is straightforward: enable registration, enter the compatible extension list and optionally provide a ProgID, description or document icon.

> [!IMPORTANT]
> InstallerLab creates the registry entries required by the Windows Integration panel automatically. You do not need to hand-write the Open With registry keys in `[Registry]`.

Your application only needs to read the file path or other parameter that Windows passes when the user invokes that integration.

## 6. Choose installer languages

The **Languages** panel lets you select the languages included in the generated installer, choose the default language and optionally show a language selector when setup starts.

InstallerLab's own interface language is independent from the languages included in the installer you build.

## 7. Add prerequisites and post-install actions

The **Requirements and actions** panel lets you describe dependencies visually, including installer source, architecture, parameters, detection type, detection data, success codes and reboot codes.

Common detection concepts include:

```text
FileExists
RegistryValue
ExecutableExists
CommandExitCode
```

Post-install behavior can also be represented through `[Run]` actions.

## 8. Select a visual theme

Open **Themes** to choose the installer presentation. Themes can include branding artwork, background configuration and additional PRO designs when those features are available in the license being used.

The theme affects the installer experience; it does not change the underlying application payload.

## 9. Save and build the Setup EXE

Once the project is configured, press **Save changes** in the relevant panels and then use **Installer EXE** from the ribbon.

```text
Visual configuration
        ↓
FSS project updated
        ↓
Installer EXE
        ↓
Test install / launch / uninstall
```

<details>
<summary><strong>Recommended test checklist</strong></summary>

- Confirm the main executable and installer icon.
- Verify Current user vs All users scope.
- Check the installation path.
- Verify files and folder payload.
- Test shortcuts.
- Test Open With / context-menu arguments if used.
- Test prerequisites.
- Verify installer languages.
- Install on a clean Windows machine.
- Test launch, reinstall, upgrade and uninstall.

</details>

> [!NOTE]
> An unsigned installer can trigger Windows SmartScreen reputation warnings while a publisher builds reputation. A warning by itself does not establish that the installer is malicious.

## Why this workflow is useful

| Workflow | Benefit |
|---|---|
| Visual editor | Faster setup for common installer tasks |
| FSS source | Direct control when advanced rules are needed |
| Same project | Setup EXE and MSI without two independent definitions |
| Windows integration | Open With, context menus and related registration from the project |
| Themes and languages | Customize the installer experience |

**InstallerLab:** https://fernand21.github.io/installerlab-web/  
**Downloads:** https://fernand21.github.io/installerlab-web/download/  
**Documentation:** https://fernand21.github.io/installerlab-web/docs/

---

*Official InstallerLab community guide.*
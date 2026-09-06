<!-- title: How to Build a Windows EXE Installer with InstallerLab — Step by Step -->
<!-- category: general -->

# Build a Windows EXE installer with InstallerLab

InstallerLab is a **visual Windows installer builder** that also keeps the project editable through **FSS**. A single project can be used to build a traditional Setup EXE and, when needed, an MSI package without re-authoring the application from scratch.

> [!TIP]
> Start with one small application first. Add the payload, application metadata and one shortcut, then build and test before adding registry or shell integration.

## 1. Create the project

Create a new InstallerLab project and define the application name, version, publisher, executable and install location.

A typical desktop application installs under `{app}`. InstallerLab also supports constants such as `{autopf}`, `{localappdata}` and `{userdocs}` for known Windows locations.

## 2. Add the application payload

Use the visual file/folder editor or edit the FSS project directly. InstallerLab keeps packaging rules in readable sections such as:

```ini
[Files]
; Application payload rules live here.
```

## 3. Add Windows integration

InstallerLab can configure shortcuts, registry entries, file associations, **Open With** integration and context-menu commands. Add only the integrations your application actually needs.

```ini
[Icons]
; Start Menu / Desktop shortcut rules live here.
```

## 4. Add prerequisites and actions

Dependencies can be described in `[Prerequisites]`, while commands that need to run during or after installation can be placed in `[Run]`.

<details>
<summary><strong>Quick build checklist</strong></summary>

- Confirm the main executable and icon.
- Verify the install scope.
- Check shortcuts and registry entries.
- Test prerequisite detection.
- Build the Setup EXE.
- Install on a clean Windows test machine.
- Test uninstall and reinstall.

</details>

## 5. Build and test

Run the InstallerLab build and test the generated Setup EXE on a clean Windows machine.

> [!NOTE]
> An unsigned installer can trigger Windows SmartScreen reputation warnings while a publisher builds reputation. A warning by itself does not mean the installer is malicious.

## Why this workflow is useful

| Workflow | Benefit |
|---|---|
| Visual editor | Faster setup for common installer tasks |
| FSS source | Direct control when advanced rules are needed |
| Same project | Setup EXE and MSI without two independent definitions |
| Windows integration | Registry, shortcuts, associations and context menus |
| Themes and languages | Customize the installer experience |

**InstallerLab:** https://fernand21.github.io/installerlab-web/  
**Downloads:** https://fernand21.github.io/installerlab-web/download/  
**Documentation:** https://fernand21.github.io/installerlab-web/docs/

---

*Official InstallerLab community guide.*
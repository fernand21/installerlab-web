<!-- title: How to Create an MSI Installer from the Same InstallerLab Project -->
<!-- category: general -->

# Create an MSI installer without re-authoring the project

One of InstallerLab's useful workflows is that **Setup EXE and MSI can come from the same project**. You do not need to maintain a separate hand-written WiX project just to produce an MSI for the same application.

## Basic workflow

1. Build and validate the InstallerLab project normally.
2. Keep files, shortcuts, registry rules and actions in the same FSS project.
3. Select the MSI build output.
4. InstallerLab translates the project into its MSI build pipeline.
5. Test the resulting MSI on a clean Windows machine.

```text
InstallerLab project / FSS
          │
          ├── Setup EXE
          └── MSI
```

> [!TIP]
> Treat the FSS project as the source of truth. When files or integration rules change, update them once and rebuild the output format you need.

## What stays in the project

The same project can describe application files, registry values, shortcuts, shell integration, prerequisites, run actions, cleanup rules, installer languages and visual configuration.

<details>
<summary><strong>When is MSI especially useful?</strong></summary>

MSI is commonly requested in managed Windows environments because deployment tools and administrators often work directly with Windows Installer packages. A traditional Setup EXE is still useful when you want a different bootstrap or distribution flow.

</details>

## Recommended test cycle

| Test | What to verify |
|---|---|
| Fresh install | Files, shortcuts and registry state |
| Reinstall | Expected Windows Installer behavior |
| Uninstall | Cleanup and application removal |
| Upgrade | Version and identity behavior |
| Scope test | Correct admin/non-admin behavior |

> [!IMPORTANT]
> Always test the actual MSI you plan to distribute. Packaging technology does not replace application-level testing.

**MSI builder:** https://fernand21.github.io/installerlab-web/msi-builder/  
**InstallerLab:** https://fernand21.github.io/installerlab-web/  
**Documentation:** https://fernand21.github.io/installerlab-web/docs/

---

*Official InstallerLab community guide.*
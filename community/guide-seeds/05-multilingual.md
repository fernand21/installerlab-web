<!-- title: Multilingual Windows Installers: 20 InstallerLab UI Languages vs 36 Installer Languages -->
<!-- category: general -->

# InstallerLab UI languages and installer languages are independent

InstallerLab separates the language of the **builder application** from the languages available in the **installers you create**.

| Layer | Language support |
|---|---|
| InstallerLab application interface | 20 selectable languages |
| Generated Windows installers | Up to 36 installer languages |
| Unsupported InstallerLab UI locale | English fallback |

That means a developer can work in one InstallerLab interface language and still build an installer for a completely different audience.

## How the Languages panel works

Open **Languages** in the Project Explorer. The installer-language panel is designed as a simple selection workflow:

1. Search for a language if the list is long.
2. Tick the installer languages you want to include.
3. Use **All** when you want the full set.
4. Use **EN + ES** as a quick English/Spanish selection.
5. Choose the **default installer language** from the drop-down.
6. Enable **Show language selector when the installer starts** when you want the user to choose at launch.
7. Save changes.

```text
InstallerLab UI language: Spanish
              │
              └── Installer project languages:
                  English
                  Español
                  Français
                  Deutsch
                  Italiano
                  ... up to 36
```

> [!IMPORTANT]
> The language selected for the InstallerLab application itself does **not** limit the languages of the generated installer.

## Example

A developer can use InstallerLab in Spanish and build an installer whose default language is English while also including French, German, Japanese and other supported installer languages.

```text
Developer UI: Spanish
        ↓
Languages panel
        ↓
Default: English
Included: English + Spanish + French + German + Japanese
        ↓
Generated installer
```

## When should the startup selector be enabled?

Enable the startup selector when one installer is intended for users in several regions and you want the user to choose the language before continuing.

If the installer is distributed to a single-language audience, selecting the required language and setting it as default can keep the startup flow simpler.

> [!TIP]
> Think of the 20 UI languages as a **developer-experience feature** and the 36 installer languages as a **distribution feature** for the people installing your application.

<details>
<summary><strong>Multilingual installer test checklist</strong></summary>

1. Verify the intended default installer language.
2. Confirm every selected installer language appears in the selector.
3. Test long translated strings for clipping.
4. Test right-to-left languages where applicable.
5. Verify project-specific license/readme content if you include it.
6. Test the language-selection screen on a clean Windows machine.

</details>

**InstallerLab features:** https://fernand21.github.io/installerlab-web/features/  
**Main site:** https://fernand21.github.io/installerlab-web/

---

*Official InstallerLab community guide.*
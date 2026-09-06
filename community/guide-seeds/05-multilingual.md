<!-- title: Multilingual Windows Installers: 20 InstallerLab UI Languages vs 36 Installer Languages -->
<!-- category: general -->

# InstallerLab UI languages and installer languages are independent

InstallerLab separates the language of the **builder application** from the languages available in the **installers you create**.

| Layer | Language support |
|---|---|
| InstallerLab application interface | 20 selectable languages |
| Generated Windows installers | Up to 36 installer languages |
| Unsupported InstallerLab UI locale | English fallback |

That means a developer can work in one InstallerLab interface language and still build an installer for a different audience.

## Example

```text
Developer uses InstallerLab in Spanish
              ↓
Project builds an installer with:
English + French + German + Japanese + ...
```

The generated installer's language selection does **not** need to match the language used in InstallerLab itself.

> [!TIP]
> Think of the 20 UI languages as a developer-experience feature, and the 36 installer languages as a distribution feature for the people installing your application.

## Why the separation matters

- Teams can use the builder in their preferred supported language.
- One project can target users in many countries.
- Unsupported application-interface locales can fall back to English.
- Expanding installer-language coverage does not require every new language to become an InstallerLab UI language first.

<details>
<summary><strong>Localization test checklist</strong></summary>

1. Verify welcome and navigation text.
2. Check long translated strings for clipping.
3. Test right-to-left languages where applicable.
4. Verify license/readme content if your project includes it.
5. Test default language and language-selection behavior on a clean machine.

</details>

**InstallerLab features:** https://fernand21.github.io/installerlab-web/features/  
**Main site:** https://fernand21.github.io/installerlab-web/

---

*Official InstallerLab community guide.*
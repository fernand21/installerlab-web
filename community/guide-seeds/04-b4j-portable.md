<!-- title: How to Package a B4J App as a Portable Windows Application with InstallerLab -->
<!-- category: general -->

# B4J Portable packaging with InstallerLab

InstallerLab has a dedicated **B4J Portable** workflow. It is separate from the generic Portable builder and is designed around the official B4J toolchain.

## What InstallerLab checks

The workflow detects a B4J installation and a complete JDK, including components such as:

- `B4JBuilder.exe`
- `B4JPackager11.jar`
- `java`
- `jlink`
- `jdeps`

If automatic detection is not enough, the B4J and JDK folders can be selected manually.

## Project metadata

InstallerLab reads the `.b4j` project and packaging properties such as:

```text
ExeName
IconFile
IncludedModules
Version
```

It can also keep project-specific portable configuration in `InstallerLab.confbuilder`.

> [!NOTE]
> InstallerLab does not replace B4J's compiler. The B4J Portable workflow uses the official B4J build/package components and then prepares the distribution layer around that result.

## Typical build flow

```text
B4J project
   │
   ├─ B4JBuilder.exe       → compile
   ├─ B4JPackager11.jar    → official packaged app/runtime
   └─ InstallerLab         → portable distribution / launcher configuration
```

## Included modules

For applications that need Java modules explicitly, the B4J project can define `#PackagerProperty: IncludedModules = ...`. InstallerLab reads this configuration as part of the B4J Portable workflow.

<details>
<summary><strong>Troubleshooting checklist</strong></summary>

- Confirm the selected file is a valid `.b4j` project.
- Confirm `B4JBuilder.exe` and `B4JPackager11.jar` exist in the selected B4J folder.
- Use a full JDK containing `java`, `jlink` and `jdeps`.
- Choose an output folder outside the B4J project directory.
- Verify the icon path if `IconFile` is configured.
- Review the build output when packaging fails.

</details>

> [!TIP]
> If a portable build behaves differently from the IDE, compare Java modules and runtime configuration first.

**B4J + InstallerLab:** https://fernand21.github.io/installerlab-web/b4j/  
**B4J installer page:** https://fernand21.github.io/installerlab-web/b4j-installer/  
**Download InstallerLab:** https://fernand21.github.io/installerlab-web/download/

---

*Official InstallerLab community guide.*
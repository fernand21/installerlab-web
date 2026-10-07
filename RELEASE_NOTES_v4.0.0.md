# InstallerLab v4.0.0 — Web-to-EXE & Workspace Update

InstallerLab v4.0.0 expands the project model beyond traditional Windows deployment by introducing a dedicated **Web-to-EXE** workflow while refining the editor, project sessions and build-target orchestration.

This release keeps the v3 packaging architecture — FSS projects, Application projects, Office Add-ins, QGIS Plugins, MSI, Bundle, CLI, SBOM, signing, Windows Services and Analytics — and adds a new path for turning web applications into Windows desktop applications and deployable packages.

## Highlights

- **New WebToExe project type** for web applications.
- **URL-to-Windows app workflow** using InstallerLab's WebView2-based runtime.
- **Local HTML application support** for projects with a local web folder containing index.html.
- **Dedicated Web-to-EXE output** that packages the prepared WebView2 application as a single-file executable through InstallerLab's portable engine.
- **Web application installer targets** for Setup EXE, MSI and Bundle.
- **Automatic WebView2 prerequisite preparation for EXE and Bundle builds** using Microsoft's Evergreen Bootstrapper.
- **Web UI controls** for toolbar visibility, external-link behavior, PWA-install blocking and System/Light/Dark web themes.
- **Element customization rules** to hide or disable web elements by ID, CSS class or CSS selector.
- **Project-aware build target matrix** extended to WebToExe alongside Application, OfficeAddin and QgisPlugin.
- **Improved multi-document/project workspace** through project sessions tied to Monaco documents.
- **Direct .fss startup handling** when an InstallerLab project is opened from Windows.
- **Expanded editor actions** including Undo, Redo, Select All, Toggle Comment, Copy, Cut, Paste, Format Document and Format Selection.
- **Unified artifact post-processing** through the existing signing/SBOM pipeline after supported builds.

## Web-to-EXE

Version 4 introduces ProjectType=WebToExe as an explicit project type.

A Web-to-EXE project can point to a remote web URL or use a local web application folder. The project can also configure:

- web theme: System, Light or Dark;
- optional navigation toolbar;
- opening external links in the system browser;
- blocking the website's own PWA installation flow;
- hidden element IDs;
- hidden CSS classes;
- hidden CSS selectors;
- disabled element IDs;
- disabled CSS classes;
- disabled CSS selectors.

InstallerLab stages the WebView2 runtime host and applies the project configuration before creating the requested output.

## Web application build targets

| WebToExe target | Available |
|---|:---:|
| Web-to-EXE single-file output | ✅ |
| Setup EXE | ✅ |
| MSI | ✅ |
| Bundle | ✅ |
| Classic Portable target | — |
| B4J Portable target | — |

For EXE and Bundle installer builds, InstallerLab can stage the official Microsoft WebView2 Evergreen Bootstrapper so the generated package can handle the WebView2 prerequisite when needed.

A standalone MSI cannot safely chain an EXE prerequisite, so InstallerLab reports that EXE or Bundle is the preferred target when automatic WebView2 installation is required.

## Community and PRO behavior

InstallerLab v4 preserves the existing Community/PRO model.

For Web-to-EXE projects:

- **URL-to-single-file Web-to-EXE conversion is available without the advanced Web-to-EXE restrictions.**
- **Local HTML projects, element customization and Web-to-EXE Setup EXE/MSI/Bundle installer targets require InstallerLab PRO.**

Existing licensing rules for other InstallerLab features remain unchanged.

## Workspace and editor improvements

The editor now uses project sessions associated with Monaco documents. This makes the workspace more robust when opening and switching project documents and keeps the active FSS project synchronized with its visual panels.

Version 4 also adds startup handling for .fss files passed to InstallerLab by Windows. If the project is already open, InstallerLab selects the existing document instead of opening a duplicate.

The compact Edit menu exposes common Monaco actions such as Undo, Redo, Select All, Toggle Comment, clipboard actions and document/selection formatting.

## Smart build targets

InstallerLab continues to expose build targets according to project type instead of offering invalid combinations.

| Project type | Setup EXE | Portable | B4J Portable | MSI | Bundle | Web-to-EXE |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Application | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Office Add-in | — | — | — | ✅ | ✅ | — |
| QGIS Plugin | — | — | — | ✅ | ✅ | — |
| WebToExe | ✅ | — | — | ✅ | ✅ | ✅ |

## Existing v3 capabilities retained

Version 4 keeps the major capabilities introduced throughout the v3 line, including:

- editable FSS projects;
- Application, Office Add-in and QGIS Plugin project types;
- MSI generation;
- WiX Burn Bundle generation;
- Portable and B4J Portable workflows for compatible projects;
- headless CLI workflows;
- CycloneDX and SPDX SBOM generation;
- Authenticode signing;
- Windows Services support;
- installer themes and branding;
- language configuration;
- FSS Analyzer;
- ISS to FSS import;
- Tracking and Analytics integration.

## Release status

The v4.0.0 GitHub release is being finalized as a **draft** while documentation and comparison pages are updated.

Binary assets have been uploaded separately to the draft release by the maintainer. The release should remain unpublished until the final documentation review is complete.

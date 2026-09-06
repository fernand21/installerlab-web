<!-- title: Windows Integration Tutorial: Shortcuts, File Associations and Context Menus with InstallerLab -->
<!-- category: general -->

# Windows integration with InstallerLab

InstallerLab keeps common Windows integration tasks in a visual panel so you do **not** have to hand-write the Windows registry entries for them.

The most important distinction is simple:

> [!IMPORTANT]
> For **Open With**, file-type metadata and context-menu integration created from the InstallerLab Windows Integration panel, InstallerLab generates the required registry keys automatically. Do not duplicate those generated keys manually in `[Registry]`.

## Open With is intentionally simple

In **Menus & Integrations → Windows Integration**, enable **Register the application in the Windows Open With list** and enter the extensions your application supports.

For example:

```text
.xlam, .xlsm, .xltm, .xlsb, .dotm, .docm, .ppam, .pptm
```

That extension list is the main configuration. InstallerLab uses it to register the installed application for those compatible file types.

You can also provide:

- a **document ProgID**;
- a friendly **file description**;
- an optional **document icon**.

If no document icon is selected, InstallerLab can use the application icon.

Then press **Save changes**. The Windows registration is generated from the project automatically.

## What you still need to do in your application

The installer can register the application with Windows, but your program must decide what to do with the file Windows sends to it.

When a user chooses your program from **Open With**, Windows launches the installed application and passes the selected file path as a command-line argument.

```text
User right-clicks a file
        ↓
Open with → Your application
        ↓
Windows starts your EXE
        ↓
Your application reads the first command-line argument
        ↓
Your code opens / imports / processes that file
```

> [!TIP]
> InstallerLab handles the **Windows registration**. Your application handles the **argument after launch**. These are two separate jobs.

## Read the file path in the main programming languages

The Windows side is the same regardless of programming language: your installed executable receives the selected path as a command-line argument. Only the way your application reads that argument changes.

<details open>
<summary><strong>B4J</strong></summary>

For a B4J UI application, command-line arguments are available in `AppStart`:

```b4x
Sub AppStart (Form1 As Form, Args() As String)
    If Args.Length > 0 Then
        Dim OpenedFile As String = Args(0)
        Log("File received from Windows: " & OpenedFile)
        ' OpenDocument(OpenedFile)
    End If

    Form1.Show
End Sub
```

During development you can simulate an incoming file path with:

```b4x
#CommandLineArgs: C:\Tests\sample.xlam
```

</details>

<details>
<summary><strong>C# / .NET</strong></summary>

A classic `Main` entry point receives the arguments directly:

```csharp
static void Main(string[] args)
{
    if (args.Length > 0)
    {
        string openedFile = args[0];
        Console.WriteLine($"File received from Windows: {openedFile}");
        // OpenDocument(openedFile);
    }

    // Start your WinForms, WPF or other application here.
}
```

In GUI applications that already have their own startup class, read the process command line at startup and pass the first application argument to your document-opening routine.

</details>

<details>
<summary><strong>VB.NET</strong></summary>

```vbnet
Sub Main(args As String())
    If args.Length > 0 Then
        Dim openedFile As String = args(0)
        Console.WriteLine("File received from Windows: " & openedFile)
        ' OpenDocument(openedFile)
    End If

    ' Start your application here.
End Sub
```

</details>

<details>
<summary><strong>C / C++ on Windows</strong></summary>

For Unicode Windows paths, `wmain` is convenient:

```cpp
#include <windows.h>
#include <iostream>

int wmain(int argc, wchar_t* argv[])
{
    if (argc > 1)
    {
        const wchar_t* openedFile = argv[1];
        std::wcout << L"File received from Windows: " << openedFile << L"\n";
        // OpenDocument(openedFile);
    }

    return 0;
}
```

Remember that `argv[0]` is the executable path, so the selected document is normally `argv[1]`.

</details>

<details>
<summary><strong>Java</strong></summary>

```java
public static void main(String[] args) {
    if (args.length > 0) {
        String openedFile = args[0];
        System.out.println("File received from Windows: " + openedFile);
        // openDocument(openedFile);
    }

    // Start Swing, JavaFX or your application framework here.
}
```

</details>

<details>
<summary><strong>Python</strong></summary>

Python keeps the executable/script name at index `0`, so the first file argument is index `1`:

```python
import sys

if len(sys.argv) > 1:
    opened_file = sys.argv[1]
    print(f"File received from Windows: {opened_file}")
    # open_document(opened_file)

# Start your Tkinter, PySide, PyQt or other UI here.
```

</details>

<details>
<summary><strong>Delphi / Object Pascal</strong></summary>

```pascal
begin
  if ParamCount > 0 then
  begin
    OpenedFile := ParamStr(1);
    // OpenDocument(OpenedFile);
  end;

  Application.Initialize;
  Application.Run;
end;
```

`ParamStr(0)` is the executable path; `ParamStr(1)` is the first argument supplied by Windows.

</details>

### Same idea, different syntax

| Language | First file argument |
|---|---|
| B4J | `Args(0)` |
| C# | `args[0]` |
| VB.NET | `args(0)` |
| C / C++ | `argv[1]` |
| Java | `args[0]` |
| Python | `sys.argv[1]` |
| Delphi | `ParamStr(1)` |

> [!NOTE]
> The exact startup method can vary by framework. For example, WPF, WinForms, JavaFX, PySide or Delphi VCL may have framework-specific startup hooks. The key concept does not change: read the file path passed on the process command line and route it to your application's open/import routine.

## Do I need to edit `[Registry]` for Open With?

**No, not for the integration generated by this panel.**

The `[Registry]` section remains useful for registry values that belong specifically to your own application, but it is not necessary to manually reproduce the Open With keys that InstallerLab already creates.

```text
InstallerLab Windows Integration panel
                ↓
Extensions + ProgID + description + icon
                ↓
Generated Windows registry integration
                ↓
Windows launches your app with the selected file
                ↓
Your application reads the first argument
```

## Context menus

The same idea applies to context-menu integration: configure the command/action in InstallerLab and let the installer create the Windows-side registration. Your application only needs to understand the argument or parameters it receives when that command is invoked.

<details>
<summary><strong>Context-menu checklist</strong></summary>

- Use a short action name.
- Pass the selected path to the application.
- Quote paths correctly because Windows paths can contain spaces.
- Point the action to the installed executable under `{app}`.
- Test files and folders separately if both are supported.
- Verify uninstall removes the integration created by the application.

</details>

## Shortcuts are also project-driven

Start Menu and Desktop shortcuts can be configured visually in **Installer & Cleanup**. InstallerLab writes the managed shortcut rules into the project; advanced/manual FSS rules can still be kept when needed.

## Quick rule of thumb

| Task | Where to configure it |
|---|---|
| Compatible Open With extensions | Windows Integration panel |
| ProgID / description / document icon | Windows Integration panel |
| Windows registry keys for that integration | **Generated automatically by InstallerLab** |
| What happens after Windows launches the app | Your application code |
| Application-specific custom registry values | `[Registry]` / Registry panel |
| Start Menu / Desktop shortcuts | Installer & Cleanup / shortcut rules |

**InstallerLab features:** https://fernand21.github.io/installerlab-web/features/  
**Documentation:** https://fernand21.github.io/installerlab-web/docs/  
**InstallerLab:** https://fernand21.github.io/installerlab-web/

---

*Official InstallerLab community tutorial.*
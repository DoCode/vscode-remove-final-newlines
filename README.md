# Remove Final Newlines

A [Visual Studio Code](https://code.visualstudio.com/) extension that removes final newlines on save.

## Usage

### Using Command Palette (CMD/CTRL + Shift + P)

```cmd
CMD + Shift + P -> Remove Final Newlines: Format document and remove final newlines
```

### Format On Save

Respects `files.insertFinalNewline` setting.

Enable or disable by setting `files.removeFinalNewlines` (default: `false`) in Visual Studio Code configuration.

```json
{
  "files.removeFinalNewlines": true
}
```

## Custom Keyboard Shortcut

Use the following shortcut in keybindings.json to execute the default Format Document command and then remove final newlines.
Replace with your preferred key bindings.

```json
{
  "command": "removeFinalNewlines.formatAndRemoveFinalNewlines",
  "key": "alt+f",
  "when": "editorTextFocus && !editorReadonly"
}
```

## License

Licensed under the [MIT License](LICENSE.md).
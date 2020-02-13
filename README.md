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

The setting `files.removeFinalNewlines` can be overridden by language specific settings:

```json
. . .
"files.insertFinalNewline": false,
"files.removeFinalNewlines": true,
"files.trimFinalNewlines": false,
"files.trimTrailingWhitespace": true,
"[markdown]": {
  "files.insertFinalNewline": true,
  "files.removeFinalNewlines": false,
  "files.trimFinalNewlines": true,
  "files.trimTrailingWhitespace": false
},
. . .
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
# Change Log

All notable changes to the "vscode-remove-final-newlines" extension will be documented in this file.

## [v1.2.0] - 2020-02-13

- Support for language scope (file type) configuration
  Now it's possible to override a global config for file types.

  **Example:**

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

## [v1.1.1] - 2019-04-06

- Print only previous action on the status bar

## [v1.1.0] - 2019-04-05

- Add `removeFinalNewlines.formatAndRemoveFinalNewlines` command to format document and remove final newlines

## [v1.0.3] - 2019-04-05

- Respect `files.insertFinalNewline` settings

## [v1.0.2] - 2019-04-05

- Fix deprecated settings key

## [v1.0.1] - 2019-04-05

- Fix banner background

## [v1.0.0] - 2019-04-05

- First public release.
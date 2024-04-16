# Package Runner for VSCode

Package Runner is a VSCode extension that adds a button to the top-right corner of the editor, allowing users to quickly execute scripts defined in `package.json`.

## Features

- **Quick Access**: Adds a button in the top-right corner of the VSCode interface for direct execution of scripts from `package.json`.
- **Smart Detection**: If no `package.json` is present in the current directory, the plugin prompts the user to select a directory containing a `package.json`.
- **Command Selection**: Users can select any script command defined in the `package.json` to execute.

## Installation

You can install the Package Runner from the VSCode Extension Marketplace, or follow these steps to install:

1. Open VSCode.
2. Go to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X` on Mac).
3. Type `Package Runner` into the search bar.
4. Click `Install` on the extension.

## Usage

1. After installation, open VSCode.
2. Click on the Package Runner button located in the top-right corner.
3. If there is no `package.json` in the current directory, you will be prompted to select a directory.
4. Once a directory is selected, the plugin will load the `package.json` from that directory.
5. Choose the script command you wish to run.
6. Click run, and the command will execute in VSCode's terminal.

## Configuration

No additional configuration is required for this plugin.

## Support

If you encounter any issues or have suggestions, please contact us through the following means:

- [GitHub Issues](https://github.com/your-github-repo/issues)

## Contributing

Thank you for considering contributing to the Package Runner! If you have suggestions for improvements or feature requests, please submit them via GitHub Pull Requests or Issues.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

## Acknowledgements

Thank you to all the testers, users, and those who provided feedback!

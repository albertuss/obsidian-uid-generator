# UID Generator

A plugin for Obsidian that generates unique IDs in the frontmatter of notes within specified folders.

## Features
- Automatically adds unique IDs to new notes in configured folders.
- Supports sequential (e.g., `UID1`, `UID2`) or datetime-based IDs (e.g., `UID202501041200`).
- Protects IDs from changes or deletion (optional, with "ID Protection (Beta)" toggle).
- Restores original IDs on startup if protection is enabled.
- Configurable through settings with folder path suggestions.

## Installation
1. Install via Obsidian's Community Plugins (search for "UID Generator").
2. Enable the plugin in Settings > Community Plugins.
3. Configure ID settings via Settings > UID Generator.

## Usage
1. Open Settings > UID Generator.
2. Click "Add ID" to configure a folder, prefix, and ID type.
3. Enable "ID Protection (Beta)" to prevent ID changes (enabled by default).
4. Use `Ctrl+Alt+U` (customizable in Hotkeys) to manually add an ID to the active note.

## Notes
- IDs are only added to new files or via hotkey, not existing files unless manually triggered.
- Disabling ID protection allows changes but shows a warning.

## Contributing
Feel free to fork and submit pull requests on GitHub!
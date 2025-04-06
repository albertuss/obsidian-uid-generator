# UID Generator Plugin for Obsidian

The **UID Generator Plugin** is a powerful tool for Obsidian users who want to automatically assign unique identifiers (UIDs) to their notes. This plugin is particularly useful for managing large vaults, linking notes, or integrating with external systems that require unique IDs. It supports both sequential and datetime-based ID generation, with configurable prefixes and folder-specific rules.

## Features

- **Automatic UID Generation**: Generate unique IDs for notes automatically when they are created.
- **Configurable ID Types**:
  - **Sequential**: Generates IDs like `PREFIX1`, `PREFIX2`, etc.
  - **Datetime**: Generates IDs based on the current timestamp, e.g., `PREFIX20250406123045`.
- **Customizable Prefixes**: Define custom prefixes for your IDs (e.g., `NOTE-`, `TASK--`). Note that `---` is not allowed to prevent YAML formatting issues.
- **Folder-Specific Rules**: Apply UID generation only to notes in specific folders.
- **Frontmatter Integration**: UIDs are stored in the note's frontmatter under a user-defined key (e.g., `id: PREFIX123`).
- **ID Protection**: Optionally protect generated IDs from being modified, ensuring consistency.
- **User-Friendly Interface**:
  - Add and edit UID configurations directly from the settings tab.
  - Select target folders with a dropdown suggester, similar to other Obsidian plugins.
- **Hotkey Support**: Generate UIDs manually with a customizable hotkey (default: `Ctrl+Alt+U`).

## Installation

1. **Via Obsidian Community Plugins** (Recommended):
   - Open Obsidian and go to `Settings > Community Plugins`.
   - Ensure "Safe Mode" is turned off.
   - Click "Browse" and search for "UID Generator".
   - Install the plugin and enable it.

2. **Manual Installation**:
   - Download the latest release from the [Releases](https://github.com/your-username/uid-generator/releases) page.
   - Extract the contents to your Obsidian vault's plugin directory: `<vault>/.obsidian/plugins/uid-generator/`.
   - Enable the plugin in `Settings > Community Plugins`.

## Usage

1. **Configure the Plugin**:
   - Go to `Settings > UID Generator Settings`.
   - Click "Add new ID configuration" to create a new rule.
   - Fill in the following fields:
     - **Parameter Name**: The frontmatter key where the UID will be stored (e.g., `id`).
     - **Target Folder**: The folder where notes will have UIDs generated (select from a dropdown).
     - **ID Prefix**: A custom prefix for your UIDs (e.g., `NOTE-`). Note: `---` is not allowed.
     - **ID Type**: Choose between `Sequential Numbers` or `Date and Time`.
     - **ID Protection**: Enable to prevent changes to generated UIDs.
   - Save the configuration.

2. **Automatic UID Generation**:
   - When a new note is created in the specified target folder, the plugin will automatically add a UID to its frontmatter.
   - Example frontmatter:
     ```yaml
     ---
     id: NOTE-1
     ---
     ```

3. **Manual UID Generation**:
   - Use the command `Generate Unique ID` (default hotkey: `Ctrl+Alt+U`) to manually add a UID to the active note, if it matches a configured rule.

4. **Edit or Delete Configurations**:
   - In the settings tab, click "Edit" next to a configuration to modify it.
   - To delete a configuration, click "Delete" and confirm the action.

## Screenshots

![image](https://github.com/user-attachments/assets/90adcfd9-bb97-4ce6-8837-a0631954ce0c)

![image](https://github.com/user-attachments/assets/85cd6dda-c6cc-4d82-9d9e-e513154b5332)

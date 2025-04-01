"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const obsidian_1 = require("obsidian");
const DEFAULT_SETTINGS = {
    idConfigs: []
};
class UIDGeneratorPlugin extends obsidian_1.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSettings();
            // Восстанавливаем ID при загрузке
            yield this.restoreIdsOnStartup();
            this.addCommand({
                id: 'generate-unique-id',
                name: 'Generate Unique ID',
                hotkeys: [{ modifiers: ["Ctrl", "Alt"], key: "U" }],
                callback: () => this.generateId()
            });
            this.addSettingTab(new UIDSettingTab(this.app, this));
            this.registerTemplate();
            this.registerEventListeners();
        });
    }
    generateId() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const activeFile = this.app.workspace.getActiveFile();
            if (!activeFile)
                return;
            const config = this.settings.idConfigs.find(cfg => activeFile.path.startsWith(cfg.targetFolder));
            if (!config)
                return;
            const frontmatter = (_a = this.app.metadataCache.getFileCache(activeFile)) === null || _a === void 0 ? void 0 : _a.frontmatter;
            if (frontmatter === null || frontmatter === void 0 ? void 0 : frontmatter.id)
                return;
            const newId = config.idType === 'sequential'
                ? yield this.generateSequentialId(config)
                : this.generateDateTimeId(config);
            yield this.app.fileManager.processFrontMatter(activeFile, (fm) => {
                fm['id'] = newId;
                config.idMap[activeFile.path] = newId;
            });
            yield this.saveSettings();
        });
    }
    generateSequentialId(config) {
        return __awaiter(this, void 0, void 0, function* () {
            config.lastSequence++;
            yield this.saveSettings();
            return `${config.idPrefix}${config.lastSequence}`;
        });
    }
    generateDateTimeId(config) {
        const now = new Date();
        const timestamp = now.toISOString().replace(/[-:T.Z]/g, '');
        return `${config.idPrefix}${timestamp}`;
    }
    restoreIdsOnStartup() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            for (const config of this.settings.idConfigs) {
                if (!config.protectId)
                    continue; // Пропускаем, если защита отключена
                const files = this.app.vault.getFiles().filter(file => file.path.startsWith(config.targetFolder));
                for (const file of files) {
                    const originalId = config.idMap[file.path];
                    if (!originalId)
                        continue;
                    const cache = this.app.metadataCache.getFileCache(file);
                    const currentId = (_a = cache === null || cache === void 0 ? void 0 : cache.frontmatter) === null || _a === void 0 ? void 0 : _a.id;
                    if (currentId !== originalId || !currentId) {
                        const content = yield this.app.vault.read(file);
                        const parts = content.split('---');
                        let newContent;
                        if (parts.length >= 3) {
                            newContent = `---
id: ${originalId}
${parts[1].replace(/id: .*/g, '').trim()}
---
${parts.slice(2).join('---')}`;
                        }
                        else {
                            newContent = `---
id: ${originalId}
---
${content}`;
                        }
                        yield this.app.vault.modify(file, newContent);
                        console.log(`ID restored on startup for ${file.path}: ${originalId}`);
                    }
                }
            }
        });
    }
    registerTemplate() {
        this.registerEvent(this.app.vault.on('create', (file) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!(file instanceof obsidian_1.TFile))
                return;
            const config = this.settings.idConfigs.find(cfg => file.path.startsWith(cfg.targetFolder));
            if (!config)
                return;
            const now = Date.now();
            const fileStat = yield this.app.vault.adapter.stat(file.path);
            if (!fileStat || fileStat.ctime < now - 1000)
                return;
            const frontmatter = (_a = this.app.metadataCache.getFileCache(file)) === null || _a === void 0 ? void 0 : _a.frontmatter;
            if (!(frontmatter === null || frontmatter === void 0 ? void 0 : frontmatter.id)) {
                const newId = config.idType === 'sequential'
                    ? yield this.generateSequentialId(config)
                    : this.generateDateTimeId(config);
                yield this.app.fileManager.processFrontMatter(file, (fm) => {
                    fm['id'] = newId;
                    config.idMap[file.path] = newId;
                });
                yield this.saveSettings();
            }
        })));
    }
    registerEventListeners() {
        this.registerEvent(this.app.vault.on('modify', (file) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!(file instanceof obsidian_1.TFile))
                return;
            const config = this.settings.idConfigs.find(cfg => file.path.startsWith(cfg.targetFolder));
            if (!config || !config.protectId)
                return; // Пропускаем, если защита отключена
            const cache = this.app.metadataCache.getFileCache(file);
            const currentId = (_a = cache === null || cache === void 0 ? void 0 : cache.frontmatter) === null || _a === void 0 ? void 0 : _a.id;
            const originalId = config.idMap[file.path];
            if (originalId && (currentId !== originalId || !currentId)) {
                const content = yield this.app.vault.read(file);
                const parts = content.split('---');
                let newContent;
                if (parts.length >= 3) {
                    newContent = `---
id: ${originalId}
${parts[1].replace(/id: .*/g, '').trim()}
---
${parts.slice(2).join('---')}`;
                }
                else {
                    newContent = `---
id: ${originalId}
---
${content}`;
                }
                yield this.app.vault.modify(file, newContent);
                console.log(`ID change or removal prevented for ${file.path}: restored ${originalId}`);
            }
        })));
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
}
exports.default = UIDGeneratorPlugin;
class UIDSettingTab extends obsidian_1.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'UID Generator Settings' });
        new obsidian_1.Setting(containerEl)
            .setName('Add new ID configuration')
            .addButton(button => button
            .setButtonText('Add ID')
            .onClick(() => {
            const modal = new AddIDModal(this.app, this.plugin, () => this.display());
            modal.open();
        }));
        this.plugin.settings.idConfigs.forEach((config, index) => {
            const setting = new obsidian_1.Setting(containerEl)
                .setName(`Folder: ${config.targetFolder}`)
                .setDesc(`Prefix: ${config.idPrefix}, Type: ${config.idType}`);
            setting.addToggle(toggle => toggle
                .setValue(config.protectId)
                .setTooltip('ID Protection (Beta)')
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                if (!value) {
                    new obsidian_1.Notice('Are you sure you want to disable ID protection? Changes to IDs will no longer be prevented.');
                }
                config.protectId = value;
                yield this.plugin.saveSettings();
            })));
            setting.addButton(button => button
                .setButtonText('Delete')
                .setWarning()
                .onClick(() => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.idConfigs.splice(index, 1);
                yield this.plugin.saveSettings();
                this.display();
            })));
        });
    }
}
class AddIDModal extends obsidian_1.Modal {
    constructor(app, plugin, onSave) {
        super(app);
        this.targetFolder = '';
        this.idPrefix = '';
        this.idType = 'sequential';
        this.protectId = true; // По умолчанию защита включена
        this.plugin = plugin;
        this.onSave = onSave;
    }
    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl('h2', { text: 'Add New ID Configuration' });
        new obsidian_1.Setting(contentEl)
            .setName('Target folder')
            .setDesc('Folder where IDs will be generated')
            .addText(text => {
            var _a;
            text
                .setPlaceholder('Enter folder path')
                .onChange(value => this.targetFolder = value);
            const input = text.inputEl;
            input.setAttribute('list', 'folder-suggestions');
            const datalist = document.createElement('datalist');
            datalist.id = 'folder-suggestions';
            const folders = this.app.vault.getAllLoadedFiles()
                .filter(file => file instanceof obsidian_1.TFile)
                .map(file => { var _a; return (_a = file.parent) === null || _a === void 0 ? void 0 : _a.path; })
                .filter((path) => !!path && path !== '')
                .filter((path, index, self) => self.indexOf(path) === index);
            folders.forEach(folder => {
                const option = document.createElement('option');
                option.value = folder;
                datalist.appendChild(option);
            });
            (_a = input.parentElement) === null || _a === void 0 ? void 0 : _a.appendChild(datalist);
        });
        new obsidian_1.Setting(contentEl)
            .setName('ID Prefix')
            .setDesc('Prefix for generated IDs')
            .addText(text => text
            .setPlaceholder('UID')
            .onChange(value => this.idPrefix = value));
        new obsidian_1.Setting(contentEl)
            .setName('ID Type')
            .setDesc('Choose ID generation type')
            .addDropdown(dropdown => dropdown
            .addOption('sequential', 'Sequential Numbers')
            .addOption('datetime', 'Date and Time')
            .setValue(this.idType)
            .onChange(value => this.idType = value));
        new obsidian_1.Setting(contentEl)
            .setName('ID Protection (Beta)')
            .setDesc('Prevent changes to generated IDs')
            .addToggle(toggle => toggle
            .setValue(this.protectId)
            .onChange(value => this.protectId = value));
        new obsidian_1.Setting(contentEl)
            .addButton(button => button
            .setButtonText('Save')
            .onClick(() => __awaiter(this, void 0, void 0, function* () {
            if (!this.targetFolder || !this.idPrefix) {
                new obsidian_1.Notice('Please fill in both folder and prefix');
                return;
            }
            this.plugin.settings.idConfigs.push({
                targetFolder: this.targetFolder,
                idPrefix: this.idPrefix,
                idType: this.idType,
                lastSequence: 0,
                idMap: {},
                protectId: this.protectId
            });
            yield this.plugin.saveSettings();
            this.onSave();
            this.close();
        })))
            .addButton(button => button
            .setButtonText('Cancel')
            .onClick(() => this.close()));
    }
    onClose() {
        this.contentEl.empty();
    }
}

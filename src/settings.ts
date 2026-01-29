import { App, PluginSettingTab, Setting } from "obsidian";
import ClickControlPlugin from "./main";

export interface ClickControlSettings {
	unsupportedExtensions: string;
	requireDoubleClick: boolean;
	interceptUnrecognized: boolean;
}

export const DEFAULT_SETTINGS: ClickControlSettings = {
	unsupportedExtensions: 'exe,dll,bin,zip,7z,rar',
	requireDoubleClick: true,
	interceptUnrecognized: true
}

export class ClickControlSettingTab extends PluginSettingTab {
	plugin: ClickControlPlugin;

	constructor(app: App, plugin: ClickControlPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Click Control Settings' });
		containerEl.createEl('p', { text: 'This plugin intercepts clicks on specified file types to prevent accidental opening.' });

		const descEl = containerEl.createEl('div', { cls: 'setting-item-description' });
		descEl.createEl('p', { text: 'Current Interaction Mapping:' });
		const listEl = descEl.createEl('ul');
		listEl.createEl('li', { text: 'Single Click: Show hint (Block opening)' });
		listEl.createEl('li', { text: 'Shift + Click: Open folder (Show in folder)' });
		listEl.createEl('li', { text: 'Ctrl + Click: Open file (System default app)' });

		new Setting(containerEl)
			.setName('Unsupported Extensions')
			.setDesc('Comma-separated list of file extensions to intercept.')
			.addText(text => text
				.setPlaceholder('exe,dll,bin')
				.setValue(this.plugin.settings.unsupportedExtensions)
				.onChange(async (value) => {
					this.plugin.settings.unsupportedExtensions = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Intercept All Unrecognized Files')
			.setDesc('Automatically apply rules to all file types that Obsidian doesn\'t natively support.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.interceptUnrecognized)
				.onChange(async (value) => {
					this.plugin.settings.interceptUnrecognized = value;
					await this.plugin.saveSettings();
				}));
	}
}

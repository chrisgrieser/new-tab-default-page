// https://marcus.se.net/obsidian-plugin-docs/user-interface/settings#register-a-settings-tab
import { App, PluginSettingTab, Setting } from "obsidian";
import defaultNewTabPage from "./main";

export class DefaultNewTabPageSettingTab extends PluginSettingTab {
	plugin: defaultNewTabPage;

	constructor(app: App, plugin: defaultNewTabPage) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Default New Tab Page")
			.setDesc("Path of the note that will be opened in new tabs. (Images and PDFs also work.)")
			.addText((text) => text
				.setPlaceholder("Meta/Homepage.md")
				.setValue(this.plugin.settings.filePath)
				.onChange(async (value) => {
					this.plugin.settings.filePath = value;
					await this.plugin.saveSettings();
				})
			);
	}
}

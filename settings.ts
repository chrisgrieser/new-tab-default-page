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

		new Setting(containerEl)
			.setName("Mode")
			.setDesc("Select the mode in which the new note will be opened.")
			.addDropdown((dropdown) => { dropdown
				.addOption("obsidian-default", "Obsidian Default") // TODO: figure out how Records work to use `addOptions` instead
				.addOption("live-preview", "Live Preview")
				.addOption("reading-mode", "Reading Mode")
				.addOption("source-mode", "Source Mode")
				.setValue(this.plugin.settings.mode)
				.onChange(async (value) => {
					this.plugin.settings.mode = value;
					await this.plugin.saveSettings();
				});
			});
	}
}

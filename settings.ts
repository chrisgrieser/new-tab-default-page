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
			.setName("New Tab opens…")
			.setDesc("What to open when a new tab is created. (Daily Notes and Quick Switchers require the respective plugin to be enabled.)")
			.addDropdown(dropdown => { dropdown
				.addOption("new-tab-page", "New Tab Page") // TODO: figure out how Records work to use `addOptions` instead
				.addOption("daily-notes", "Daily Note") // except for the new tab page, the values should be equal to the command-id to run
				.addOption("switcher:open", "Quick Switcher (Core Plugin)")
				.addOption("obsidian-another-quick-switcher:search-command_Recommended search", "Another Quick Switcher")
				.setValue(this.plugin.settings.whatToOpen)
				.onChange(async (value) => {
					this.plugin.settings.whatToOpen = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Default New Tab Page")
			.setDesc("Path of the note that will be opened in new tabs. Images and PDFs also work. Only takes effect when the setting above is 'New Tab Page'.")
			.addText(text => text
				.setPlaceholder("Meta/Homepage.md")
				.setValue(this.plugin.settings.filePath)
				.onChange(async (value) => {
					this.plugin.settings.filePath = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Mode")
			.setDesc("Select the mode in which the default new tab page will be opened.")
			.addDropdown(dropdown => { dropdown
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

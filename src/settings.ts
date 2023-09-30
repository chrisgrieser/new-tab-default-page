// DOCS https://marcus.se.net/obsidian-plugin-docs/user-interface/settings#register-a-settings-tab
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
			.setDesc(
				"What to open when a new tab is created. (Except for the new tab page, the respective plugin needs to be enabled.)",
			)
			.addDropdown((dropdown) => {
				dropdown
					// INFO: except for the new tab page, the values should be equal to
					// the command-id to run
					.addOptions({
						"new-tab-page": "New Tab Page",
						"daily-notes": "Daily Note (Core Plugin)",
						"periodic-notes:open-daily-note": "Daily Note (Periodic Notes Plugin)",
						"periodic-notes:open-weekly-note": "Weekly Note (Periodic Notes Plugin)",
						"periodic-notes:open-monthly-note": "Monthly Note (Periodic Notes Plugin)",
						"random-note": "Random Note (Core Plugin)",
						"switcher:open": "Quick Switcher (Core Plugin)",
						"obsidian-another-quick-switcher:search-command_recent-search": "Another Quick Switcher",
						"darlal-switcher-plus:switcher-plus:open": "Quick Switcher++",
					})
					.setValue(this.plugin.settings.whatToOpen)
					.onChange(async (value) => {
						this.plugin.settings.whatToOpen = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Default New Tab Page")
			.setDesc(
				"Path of the note that will be opened in new tabs. Images and PDFs also work. Only takes effect when the setting above is 'New Tab Page'.",
			)
			.addText((text) =>
				text
					.setPlaceholder("Meta/Homepage.md")
					.setValue(this.plugin.settings.filePath)
					.onChange(async (value) => {
						this.plugin.settings.filePath = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Mode")
			.setDesc("Select the mode in which the default new tab page will be opened.")
			.addDropdown((dropdown) => {
				dropdown
					.addOptions({
						"obsidian-default": "Obsidian Default",
						"live-preview": "Live Preview",
						"reading-mode": "Reading Mode",
						"source-mode": "Source Mode",
					})
					.setValue(this.plugin.settings.mode)
					.onChange(async (value) => {
						this.plugin.settings.mode = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(this.containerEl)
			.setName("Compatibility mode")
			.setDesc(
				"Enable compatibility mode for other plugins (e.g. Obsidian Projects) which open new tabs. This introduces minor delays.",
			)
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.compatibilityMode).onChange(async (value) => {
					this.plugin.settings.compatibilityMode = value;
					await this.plugin.saveSettings();
				});
			});
	}
}

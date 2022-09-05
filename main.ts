import { Plugin, TFile } from "obsidian";
import { DefaultNewTabPageSettingTab } from "./settings";

interface DefaultNewTabPageSettings { filePath: string }

const DEFAULT_SETTINGS: Partial<DefaultNewTabPageSettings> = { filePath: "" };

export default class defaultNewTabPage extends Plugin {
	settings: DefaultNewTabPageSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new DefaultNewTabPageSettingTab(this.app, this));

		// this event is triggered every time a new file is opened, even in the
		// same tab. However, the 'window-open' event does not seem to work new
		// tabs, therefore this event is taken, with a check in the callback
		// function that it is indeed a new empty pane that was opened.
		this.registerEvent(
			this.app.workspace.on("file-open", this.openNewTabPage)
		);

		console.log("New Tab Default Page Plugin loaded.");
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		console.log("setting loaded: " + this.settings.filePath);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async onunload() { console.log("New Tab Default Page Plugin unloaded.") }

	async openNewTabPage () {
		const newTabPage = this.settings.filePath;
		console.log(`new tab page: ${newTabPage}`);
		return;

		// abort when not empty tab
		const tabNotEmpty = Boolean(app.workspace.getActiveFile());
		if (tabNotEmpty) return;

		// abort when setting empty (e.g., on install)
		if (!newTabPage) return;

		// abort when path invalid
		const tFiletoOpen = app.vault.getAbstractFileByPath(newTabPage);
		if (tFiletoOpen instanceof TFile) {
			console.error(`filepath to open is invalid: ${newTabPage}`);
			return;
		}

		// @ts-ignore
		await app.workspace.activeLeaf.openFile(tFiletoOpen);
	}
}

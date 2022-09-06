import { Notice, Plugin, WorkspaceLeaf } from "obsidian";
import { DefaultNewTabPageSettingTab } from "./settings";

interface DefaultNewTabPageSettings { filePath: string }

const DEFAULT_SETTINGS: Partial<DefaultNewTabPageSettings> = { filePath: "" };

export default class defaultNewTabPage extends Plugin {
	settings: DefaultNewTabPageSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new DefaultNewTabPageSettingTab(this.app, this));

		app.workspace.onLayoutReady(() => {
			// Get existing leaves (tabs)
			const existingLeaves = new WeakSet<WorkspaceLeaf>();
			app.workspace.iterateAllLeaves(leaf => { existingLeaves.add(leaf) });

			// When layout changes, check for new ones
			this.registerEvent(app.workspace.on("layout-change", () => {
				this.checkForNewTab(existingLeaves);
			}));
		});

		console.log("New Tab Default Page Plugin loaded.");
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async onunload() { console.log("New Tab Default Page Plugin unloaded.") }

	checkForNewTab (existingLeaves: WeakSet<WorkspaceLeaf>) { // WeakSet won't hold references, unused leaves are automatically removed
		app.workspace.iterateAllLeaves(leaf => {
			if (existingLeaves.has(leaf)) return; // only ever check a new leaf once
			existingLeaves.add(leaf);

			const tabIsEmpty = !leaf.view || leaf.view.getViewType() === "empty";
			if (!tabIsEmpty) return;

			this.openDefaultPage (leaf);
		});
	}

	openDefaultPage (leaf: WorkspaceLeaf) {
		const newTabPage = this.settings.filePath;
		if (!newTabPage) return;

		const tFiletoOpen = app.metadataCache.getFirstLinkpathDest(newTabPage, "/"); // `getFirstLinkpathDest` more reliably finds match than `getAbstractFileByPath`, e.g. with missing file extensions
		const pathIsValid = Boolean(tFiletoOpen);
		if (!pathIsValid) {
			new Notice (`${newTabPage} is not a valid path to a note in your vault.`);
			return;
		}

		leaf.openFile(tFiletoOpen);
	}

}

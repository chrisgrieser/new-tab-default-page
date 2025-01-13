import { Notice, Plugin, WorkspaceLeaf } from "obsidian";
import { DefaultNewTabPageSettingTab } from "./settings";

// add type safety for the undocumented methods
declare module "obsidian" {
	interface App {
		internalPlugins: {
			plugins: {
				switcher: { enabled: boolean };
			};
		};
		commands: {
			executeCommandById: (commandID: string) => boolean;
		};
	}
}

// Default Settings
interface DefaultNewTabPageSettings {
	whatToOpen: string;
	filePath: string;
	mode: string;
	compatibilityMode: boolean;
}

const DEFAULT_SETTINGS: Partial<DefaultNewTabPageSettings> = {
	whatToOpen: "new-tab-page",
	filePath: "",
	mode: "obsidian-default",
	compatibilityMode: false,
};

//──────────────────────────────────────────────────────────────────────────────

export default class defaultNewTabPage extends Plugin {
	settings: DefaultNewTabPageSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new DefaultNewTabPageSettingTab(this.app, this));
		const { workspace } = this.app;

		workspace.onLayoutReady(() => {
			// Get existing leaves (tabs)
			const existingLeaves = new WeakSet<WorkspaceLeaf>();
			workspace.iterateAllLeaves((leaf) => {
				existingLeaves.add(leaf);
			});

			// When layout changes, check for new ones
			// second arg needs to be arrow-function, so that `this` gets set
			// correctly. https://discord.com/channels/686053708261228577/840286264964022302/1016341061641183282
			this.registerEvent(
				workspace.on("layout-change", () => {
					this.checkForNewTab(existingLeaves);
				}),
			);
		});

		console.debug("New Tab Default Page Plugin loaded.");
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async onunload() {
		console.debug("New Tab Default Page Plugin unloaded.");
	}

	checkForNewTab(existingLeaves: WeakSet<WorkspaceLeaf>) {
		// WeakSet won't hold references, unused leaves are automatically removed
		this.app.workspace.iterateAllLeaves((leaf) => {
			if (existingLeaves.has(leaf)) return; // only ever check a new leaf once
			existingLeaves.add(leaf);

			if (!this.tabIsEmpty(leaf)) return;

			if (this.settings.whatToOpen === "new-tab-page") this.openDefaultPage(leaf);
			else this.runCommand(this.settings.whatToOpen, leaf);
		});
	}

	runCommand(commandId: string, leaf: WorkspaceLeaf) {
		const delay = commandId.includes("switcher") ? 200 : 0; // eslint-disable-line no-magic-numbers
		setTimeout(() => {
			if (!this.tabIsEmpty(leaf)) return;
			const commandExists = this.app.commands.executeCommandById(commandId);
			const success = commandExists !== false; // INFO on success, commandExists is undefined, otherwise false
			if (!success) new Notice("Plugin for the New Tab Page is not enabled.");
		}, delay);
	}

	tabIsEmpty(leaf: WorkspaceLeaf) {
		return !leaf.view || leaf.view.getViewType() === "empty";
	}

	// INFO In compatibility mode, we have to check if the view state type of a leaf is
	// still empty at the next tick. Other plugins might open a new leaf and change the view state
	// after opening the leaf. The layout-change listener is triggered before the state
	// might be changed. This might cause this.checkForNewTab to conclude that the view state
	// is empty, whilst in fact is only STILL empty but will be overwritten.
	// An example of how other plugins might open leafs and change the view state:
	// https://github.com/marcusolsson/obsidian-projects/blob/1.16.3/src/main.ts#L207
	async leafIsStillEmpty(leaf: WorkspaceLeaf) {
		return new Promise((resolve, _reject) => {
			process.nextTick(() => {
				const viewStateAfterDelay = leaf.getViewState();
				resolve(viewStateAfterDelay?.type === "empty");
			});
		});
	}

	async openDefaultPage(leaf: WorkspaceLeaf) {
		const newTabPage = this.settings.filePath;
		if (!newTabPage) return;

		const tFiletoOpen = this.app.metadataCache.getFirstLinkpathDest(newTabPage, "/"); // `getFirstLinkpathDest` more reliably finds match than `getAbstractFileByPath`, e.g. with missing file extensions
		const pathIsValid = Boolean(tFiletoOpen);
		if (!pathIsValid) {
			new Notice(`${newTabPage} is not a valid path to a note in your vault.`);
			return;
		}

		// When compatibility mode is enabled, check if leaf is still empty
		if (this.settings.compatibilityMode && !(await this.leafIsStillEmpty(leaf))) return;

		await leaf.openFile(tFiletoOpen);
		this.setViewMode(leaf, this.settings.mode);
	}

	setViewMode(leaf: WorkspaceLeaf, targetMode: string) {
		const view = leaf.getViewState();
		if (targetMode === "source-mode") {
			view.state.mode = "source";
			view.state.source = true;
		} else if (targetMode === "live-preview") {
			view.state.mode = "source";
			view.state.source = false;
		} else if (targetMode === "reading-mode") {
			view.state.mode = "preview";
		}
		leaf.setViewState(view);
	}
}

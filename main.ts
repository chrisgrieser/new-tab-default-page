import { Plugin } from "obsidian";

export default class {{plugin-class}} extends Plugin {

	async onload() {
		console.log("{{plugin-name}} Plugin loaded.");
	}

	async onunload() { console.log("{{plugin-name}} Plugin unloaded.") }

}

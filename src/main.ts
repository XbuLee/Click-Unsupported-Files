import { Plugin, Notice, TFile, View } from 'obsidian';
import { DEFAULT_SETTINGS, ClickControlSettings, ClickControlSettingTab } from "./settings";

/**
 * Interface for internal Obsidian App extensions used by the plugin
 */
interface ObsidianApp {
	viewRegistry: {
		getTypeByExtension(extension: string): string | null;
	};
	showInFolder(path: string): void;
	openWithDefaultApp(path: string): void;
}

/**
 * Interface for internal Obsidian File Explorer View
 */
interface FileExplorerView extends View {
	fileItems: Record<string, {
		titleEl: HTMLElement;
		el: HTMLElement;
		file: TFile;
	}>;
}

export default class ClickControlPlugin extends Plugin {
	settings: ClickControlSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new ClickControlSettingTab(this.app, this));

		// Intercept click events in the document using capture phase
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			const target = evt.target as HTMLElement;
			const navFileTitle = target.closest('.nav-file-title');

			if (navFileTitle) {
				const path = navFileTitle.getAttribute('data-path') || this.getFilePathFromElement(navFileTitle as HTMLElement);

				if (!path) return;

				const extension = path.split('.').pop()?.toLowerCase() || '';
				if (!extension) return;

				const unsupportedExts = this.settings.unsupportedExtensions
					.split(',')
					.map((e: string) => e.trim().toLowerCase())
					.filter((e: string) => e !== "");

				const isUnsupported = unsupportedExts.includes(extension);

				// Safely check against Obsidian's viewRegistry
				const appWithExt = this.app as unknown as ObsidianApp;
				const isUnrecognized = this.settings.interceptUnrecognized &&
					appWithExt.viewRegistry &&
					!appWithExt.viewRegistry.getTypeByExtension(extension);

				if (isUnsupported || isUnrecognized) {
					// Always intercept default behavior for these files
					evt.preventDefault();
					evt.stopPropagation();

					// Only act on the first click of a potential double-click to avoid double execution
					if (evt.detail === 1) {
						const isCtrl = evt.ctrlKey || evt.metaKey;
						const isShift = evt.shiftKey;

						if (isShift) {
							// Shift + Click: Show in folder
							new Notice("📁 正在打开所在文件夹...");
							appWithExt.showInFolder(path);
						} else if (isCtrl) {
							// Ctrl + Click: Open with default app
							new Notice("🚀 正在通过系统程序打开...");
							appWithExt.openWithDefaultApp(path);
						} else {
							// Regular Click: Instruction Hint
							new Notice(`💡 该文件受限: ${extension.toUpperCase()}\n• Shift + 单击: 定位文件夹\n• Ctrl + 单击: 强制打开`, 4000);
						}
					}
				}
			}
		}, true); // Use capture phase
	}

	/**
	 * Tries to find the file path associated with a DOM element in the file explorer
	 */
	private getFilePathFromElement(el: HTMLElement): string | null {
		const navFile = el.closest('.nav-file');
		if (!navFile) return null;

		const explorerLeaves = this.app.workspace.getLeavesOfType('file-explorer');
		for (const leaf of explorerLeaves) {
			const view = leaf.view as unknown as FileExplorerView;
			if (view.fileItems) {
				for (const path in view.fileItems) {
					const item = view.fileItems[path];
					if (item && (item.titleEl === el || item.el === navFile)) {
						return path;
					}
				}
			}
		}
		return null;
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<ClickControlSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

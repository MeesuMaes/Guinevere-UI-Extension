import { extension_settings } from "../../../extensions.js";
import {
	extensionName,
	extensionFolderPath,
	defaultSettings,
} from "./constants.js";
import { saveSettingsDebounced } from "../../../../script.js";

async function loadSettings() {
	extension_settings[extensionName] = extension_settings[extensionName] || {};
	if (Object.keys(extension_settings[extensionName]).length === 0) {
		Object.assign(extension_settings[extensionName], defaultSettings);
	}

	$("#guinevere-enable").prop(
		"checked",
		extension_settings[extensionName].enabled,
	);
	$("#guinevere-theme-input").val(extension_settings[extensionName].theme);

	extension_settings[extensionName].lastSuccessfulTheme = "";
	saveSettingsDebounced();
}

// Handles the enabling/disabling of Guinevere.
function onThemeBoxClick(event) {
	const value = Boolean($(event.target).prop("checked"));
	extension_settings[extensionName].enabled = value;
	saveSettingsDebounced();
	if (!value) {
		resetTheme();
	}
}

// Handles the input box for theme selection.
function onThemeTextChange() {
	// Get the value of the input box
	const value = $("#guinevere-theme-input").val();
	extension_settings[extensionName].theme = value;
	saveSettingsDebounced();
	toastr.success("Saved selected theme successfully.");
}

// Handles the application of Guinevere themes.
function onThemeApplyClick() {
	if (!extension_settings[extensionName].enabled) {
		toastr.error("Guinevere is not enabled.");
		return;
	}
	applyTheme();
}

// Handles the removal of Guinevere themes.
function onThemeRemoveClick() {
	resetTheme();
	extension_settings[extensionName].enabled = false;
	extension_settings[extensionName].theme = "";
	saveSettingsDebounced();
	$("#guinevere-enable").prop("checked", false);
	$("#guinevere-theme-input").val("");
}

/**
 * Executes the theme's code.js file.
 * @param {any} themeDiv - The div to apply the theme to.
 * @param {boolean} auto - Whether the theme is being applied automatically (on toggle/startup).
 * @param {boolean} silent - Whether to suppress the success message.
 */
function executeCode(themeDiv, auto, silent) {
	if (extension_settings[extensionName].theme === "") {
		toastr.error("No theme selected.");
		return;
	}

	const themeCode = `./themes/${extension_settings[extensionName].theme}/code.js`;
	try {
		import(themeCode)
			.then((module) => {
				module.execute(themeDiv, auto);
				extension_settings[extensionName].lastSuccessfulTheme =
					extension_settings[extensionName].theme;
				saveSettingsDebounced();

				if (!silent)
					toastr.success(
						`Applied '${extension_settings[extensionName].theme}' theme successfully.`,
					);
			})
			.catch((error) => {
				toastr.error(
					`Failed to apply '${extension_settings[extensionName].theme}' theme${auto ? " automatically." : "."} Check console for more info.`,
				);
				console.error(error);
			});
	} catch (error) {
		toastr.error(
			`Failed to execute '${extension_settings[extensionName].theme}' code file${auto ? " automatically." : "."} Check console for more info.`,
		);
		console.error(error);
	}
}

/**
 * Executes the theme's disable code.
 * @param {any} [themeDiv] - The div to remove the theme from.
 */
function executeDisableCode(themeDiv) {
	if (!extension_settings[extensionName].theme === "") {
		toastr.error("No theme selected.");
		return;
	}
	if (extension_settings[extensionName].lastSuccessfulTheme === "") {
		toastr.error("No theme has been successfully applied to revert from.");
		return;
	}

	// import "disable" from theme's code.js file
	const themeCode = `./themes/${extension_settings[extensionName].lastSuccessfulTheme}/code.js`;
	try {
		import(themeCode)
			.then((module) => {
				module.disable(themeDiv);
			})
			.catch((error) => {
				toastr.error(
					"Failed to revert to default theme. Check console for more info.",
				);
				console.error(error);
			});
	} catch (error) {
		toastr.error(
			"Failed to execute last successful theme's disable code. Check console for more info.",
		);
		console.error(error);
	}
}

/**
 * Applies a Guinevere theme to the page.
 * @param {boolean} auto - Whether the theme is being applied automatically (on toggle/startup).
 * @param {boolean} silent - Whether to suppress the success message.
 */
async function applyTheme(auto, silent) {
	// Ensure the last theme is cleaned up before applying a new one
	resetTheme(true);

	const themeDiv = $("<div id='guinevere-theme'></div>");
	if (extension_settings[extensionName].enabled) {
		executeCode(themeDiv, auto, silent);
	}
}

/**
 * Resets the theme back to the default theme.
 * @param {boolean} silent - Whether to suppress the success message.
 * @returns {void}
 */
function resetTheme(silent) {
	const themeDiv = $("#guinevere-theme");
	if (themeDiv.length === 0) {
		return;
	}
	executeDisableCode(themeDiv);
	$("#guinevere-theme-input").val(extension_settings[extensionName].theme);
	$("#guinevere-enable").prop(
		"checked",
		extension_settings[extensionName].enabled,
	);
	if (!silent) toastr.success("Reverted to default theme.");
}

// This function is called when the extension is loaded
jQuery(async () => {
	const settingsHtml = await $.get(`${extensionFolderPath}/settings.html`);
	$("#extensions_settings").append(settingsHtml);

	loadSettings();

	$("#guinevere-enable").on("click", onThemeBoxClick);
	$("#guinevere-apply").on("click", onThemeApplyClick);
	$("#guinevere-reset").on("click", onThemeRemoveClick);
	$("#guinevere-theme-text-button").on("click", onThemeTextChange);

	await applyTheme(true, true);
});

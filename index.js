import { extension_settings } from "../../../extensions.js";
import {
	extensionName,
	extensionFolderPath,
	defaultSettings,
} from "./constants.js";
import { saveSettingsDebounced } from "../../../../script.js";
import { getTranslation } from "../../../i18n.js"; // 假设i18n模块路径

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
	const value = $("#guinevere-theme-input").val();
	extension_settings[extensionName].theme = value;
	saveSettingsDebounced();
	toastr.success(getTranslation("theme.saved_success")); // 修改为i18n
}

// Handles the application of Guinevere themes.
function onThemeApplyClick() {
	if (!extension_settings[extensionName].enabled) {
		toastr.error(getTranslation("theme.not_enabled")); // 修改为i18n
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
		toastr.error(getTranslation("theme.no_theme_selected")); // 修改为i18n
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
						getTranslation("theme.applied_success", {theme: extension_settings[extensionName].theme}) // 修改为i18n
					);
			})
			.catch((error) => {
				toastr.error(
					getTranslation(auto ? "theme.apply_failed_auto" : "theme.apply_failed") // 修改为i18n
				);
				console.error(error);
			});
	} catch (error) {
		toastr.error(
			getTranslation(auto ? "theme.execute_failed_auto" : "theme.execute_failed") // 修改为i18n
		);
		console.error(error);
	}
}

/**
 * Executes the theme's disable code.
 */
function executeDisableCode() {
	if (!extension_settings[extensionName].theme === "") {
		toastr.error(getTranslation("theme.no_theme_selected")); // 修改为i18n
		return;
	}
	if (extension_settings[extensionName].lastSuccessfulTheme === "") {
		toastr.error(getTranslation("theme.no_previous_theme")); // 修改为i18n
		return;
	}

	// import "disable" from theme's code.js file
	const themeCode = `./themes/${extension_settings[extensionName].lastSuccessfulTheme}/code.js`;
	try {
		import(themeCode)
			.then((module) => {
				module.disable();
			})
			.catch((error) => {
				toastr.error(getTranslation("theme.revert_failed")); // 修改为i18n
				console.error(error);
			});
	} catch (error) {
		toastr.error(getTranslation("theme.disable_failed")); // 修改为i18n
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
	if (!silent) toastr.success(getTranslation("theme.reverted_default")); // 修改为i18n
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

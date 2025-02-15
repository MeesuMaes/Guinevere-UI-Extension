/**
 * Template Theme
 * This is basically a code template in case you want to create your own theme
 * with buttons, input boxes, etc.
 *
 * Before getting started, make sure to have prior knowledge of HTML, CSS, and JS
 * as well as jQuery and the ST codebase itself. You may need to call some ST functions
 * that are documented or undocumented.
 *
 * While you can use the 'google-messages' theme as a reference, that code is overly
 * complex and may be difficult to understand. This template is meant to be a simpler
 * example to get you started.
 */

import { extensionFolderPath } from "../../constants.js";

/**
 * Executes the Template theme code.
 * @param {any} themeDiv - The div to apply the theme to
 * @param {*} auto - Whether the theme is being applied automatically (on toggle/startup)
 */
export async function execute(themeDiv, auto) {
	// Don't touch this.
	const topSettingsHolder = $("#top-settings-holder");
	if (!topSettingsHolder.length) {
		throw Error("Failed to find top-settings-holder.");
	}

	// Path to the theme's index.html file
	const themeHTMLPath = `${extensionFolderPath}/themes/template/index.html`;

	try {
		const data = await $.get(themeHTMLPath);
		themeDiv.html(data);

		// Your code here (e.g. event listeners, logic, etc.)
		// Preferralby assign jQuery logic to the new stuff you added to your theme.

		// Appends your theme above the top bar
		// If you want this after, use `after` instead of `before`.
		topSettingsHolder.before(themeDiv);

		// Additional code here (e.g. event listeners, logic, etc.)
		// This is for if you want to add more logic to your theme that only works
		// after the theme has been appended to the page.
	} catch (error) {
		throw Error(error);
	}

	// Uncomment these lines if you want to use your own CSS file
	// for the theme.
	// Path to the theme's CSS file
	// const cssPath = `${extensionFolderPath}/themes/template/style.css`;
	// try {
	// 	const cssData = await $.get(cssPath);
	// 	$("#guinevere-theme-css").remove();
	// 	$("<style id='guinevere-theme-css'></style>").html(cssData).appendTo("head");
	// } catch (error) {
	// 	throw Error(error);
	// };
}

/**
 * Disables the Template theme code.
 * @param {any} themeDiv - The div to remove the theme from
 */
export function disable(themeDiv) {
	// Your removal code here (if applicable)

	// Removes the theme's CSS. If you used your own CSS file, uncomment this.
	// $("#guinevere-theme-css").remove();
	themeDiv.remove();
}

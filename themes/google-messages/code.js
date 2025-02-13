import { extensionFolderPath } from "../../constants.js";
import { select2ChoiceClickSubscribe } from "../../../../../utils.js";
import { world_names } from "../../../../../world-info.js";
import {
	eventSource,
	event_types,
	name1,
} from "../../../../../../script.js";
import { user_avatar, getUserAvatars } from "../../../../../personas.js";
import { debounce, getSortableDelay } from "../../../../../utils.js";
import { debounce_timeout } from "../../../../../constants.js";
import {
	getCharacters,
	saveSettingsDebounced,
} from "../../../../../../script.js";
import { getBackgrounds } from "../../../../../backgrounds.js";
import { RA_CountCharTokens } from "../../../../../RossAscends-mods.js";
import {
	promptManager,
	oai_settings,
} from "../../../../../openai.js";
import { countTokensOpenAIAsync } from "../../../../../tokenizers.js";

const profileDataDebounce = debounce(setProfile, debounce_timeout.quick);
const personaDataDebounce = debounce(() => {
	getUserAvatars(true, user_avatar);
}, debounce_timeout.relaxed);
const characterDataDebounce = debounce(getCharacters, debounce_timeout.relaxed);
const backgroundDataDebounce = debounce(
	getBackgrounds,
	debounce_timeout.relaxed,
);
const countTokensDebounced = debounce(
	RA_CountCharTokens,
	debounce_timeout.relaxed,
);

function setProfile() {
	if (name1.length > 0) {
		// Replace the text with the selected persona's name
		$("#google-message-modal-profile-name").text(`Hi, ${name1}!`);
		// Replace the image with the selected persona's image
		$("#google-message-modal-profile-icon").attr(
			"src",
			`User Avatars/${user_avatar}`,
		);
		// Replace the settings icon with the selected persona's image
		$("#google-message-settings-profile-icon").attr(
			"src",
			`User Avatars/${user_avatar}`,
		);
	}
}

async function refetchData() {
	await profileDataDebounce();
	await personaDataDebounce();
	await characterDataDebounce();
	await backgroundDataDebounce();
}

/**
 * Executes the Google Messages theme code.
 * @param {any} themeDiv - The div to apply the theme to
 * @param {boolean} auto - Whether the theme is being applied automatically (on toggle/startup)
 */
export async function execute(themeDiv, auto) {
	const topSettingsHolder = $("#top-settings-holder");
	if (!topSettingsHolder.length) {
		throw Error("Failed to find top-settings-holder.");
	}

	// Apply theme via new div
	const themeHTMLPath = `${extensionFolderPath}/themes/google-messages/index.html`;

	try {
		const data = await $.get(themeHTMLPath);
		themeDiv.html(data);

		// Add logic to google-message-settings-icon (Profile icon)
		themeDiv.find("#google-message-settings-icon").on("click", () => {
			$("#google-message-settings-modal").toggle();
		});

		// Add logic to google-message-modal-settings-button (ST Settings button)
		themeDiv.find("#google-message-modal-settings-button").on("click", () => {
			$("#google-message-settings-modal").hide();
			$("#google-message-st-settings-modal").toggle();
		});

		// Add logic to google-message-st-modal-close (close button)
		themeDiv.find("#google-message-st-modal-close").on("click", () => {
			$("#google-message-st-settings-modal").hide();
		});

		setProfile();

		// Append themeDiv above top-bar
		topSettingsHolder.before(themeDiv);

		const stOptions = themeDiv.find("#google-st-options");
		const stPreviewer = themeDiv.find("#google-st-preview");

		// Grab data from top-settings-holder
		const drawerButtons = topSettingsHolder.find(".drawer");

		drawerButtons.each(function () {
			const button = $(this).find(".drawer-toggle");
			const backupId = $(this).attr("id"); // for drawer contents with no id

			// Copy button to stOptions
			stOptions.append(button.clone());
			const stButton = stOptions.find(".drawer-toggle").last();

			// Copy all children of drawer-content to stPreviewer
			const drawerContent = $(this).find(".drawer-content");
			if (!drawerContent.attr("id")) {
				drawerContent.attr("id", backupId);
			}

			const stPreviewerContents = drawerContent.clone(true);
			stPreviewerContents.addClass("google-message-st-option-preview");
			stPreviewer.append(stPreviewerContents);

			// Alter on click to show/hide the cloned div in the previewer
			stButton.on("click", () => {
				stPreviewer.children().css("display", "none");
				stPreviewerContents.css("display", "contents");
				stButton.children().addClass("openIcon");
				stButton.children().removeClass("closedIcon");
				stButton
					.siblings()
					.children()
					.removeClass("openIcon")
					.addClass("closedIcon");
			});
		});

		// Handles assignment of select2 code to the new div
		const newClick = stPreviewer.find("#WorldInfo").find("#world_info");
		const oldSpan = stPreviewer.find("#WorldInfo").find(".range-block-range").find("span");
		oldSpan.remove();

		newClick.select2({
			width: "100%",
			placeholder: "No Worlds active. Click here to select.",
			allowClear: true,
			closeOnSelect: false,
		});

		select2ChoiceClickSubscribe(
			newClick,
			(target) => {
				const name = $(target).text();
				const selectedIndex = world_names.indexOf(name);
				if (selectedIndex !== -1) {
					$("#world_editor_select").val(selectedIndex).trigger("change");
					console.log("Quick selection of world", name);
				}
			},
			{ buttonStyle: true, closeDrawer: true },
		);
	} catch (error) {
		throw Error(error);
	}

	const cssPath = `${extensionFolderPath}/themes/google-messages/style.css`;
	try {
		const cssData = await $.get(cssPath);
		$("#guinevere-theme-css").remove();
		$("<style id='guinevere-theme-css'></style>")
			.html(cssData)
			.appendTo("head");
	} catch (error) {
		throw Error(error);
	}

	eventSource.on(event_types.SETTINGS_UPDATED, refetchData);
	eventSource.on(event_types.CHAT_CHANGED, countTokensDebounced);

	const configuration = {
		prefix: "completion_",
		containerIdentifier: "completion_prompt_manager",
		listIdentifier: "completion_prompt_manager_list",
		toggleDisabled: [],
		sortableDelay: getSortableDelay(),
		defaultPrompts: {
			main: "",
			nsfw: "",
			jailbreak: "",
			enhanceDefinitions: "",
		},
		promptOrder: {
			strategy: "global",
			dummyId: 100001,
		},
	};
	promptManager.init(configuration, oai_settings);
	promptManager.render(false);

	topSettingsHolder.css("display", "none");
	$("#top-bar").css("display", "none");
}

export function disable() {
	const topSettingsHolder = $("#top-settings-holder");

	const oldClick = topSettingsHolder.find("#WorldInfo").find("#world_info");
	const stSpan = topSettingsHolder
		.find("#WorldInfo")
		.find(".range-block-range")
		.find("span");
	stSpan.remove();

	oldClick.select2({
		width: "100%",
		placeholder: "No Worlds active. Click here to select.",
		allowClear: true,
		closeOnSelect: false,
	});

	select2ChoiceClickSubscribe(
		oldClick,
		(target) => {
			const name = $(target).text();
			const selectedIndex = world_names.indexOf(name);
			if (selectedIndex !== -1) {
				$("#world_editor_select").val(selectedIndex).trigger("change");
				console.log("Quick selection of world", name);
			}
		},
		{ buttonStyle: true, closeDrawer: true },
	);

	// remove display element from top-settings-holder
	topSettingsHolder.css("display", "flex");
	$("#top-bar").css("display", "flex");

	// remove css
	$("#guinevere-theme-css").remove();
}

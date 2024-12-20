import { describe, expect, it, vi } from "vitest";

import { createTemplate } from "../../creators/createTemplate.js";
import { promptForInitializationDirectory } from "./promptForInitializationDirectory.js";
import { validateNewDirectory } from "./validators.js";

const templateAnonymous = createTemplate({
	presets: [],
});

const templateWithName = createTemplate({
	about: { name: "Test" },
	presets: [],
});

const mockIsCancel = vi.fn();
const mockText = vi.fn();
const mockWarn = vi.fn();

vi.mock("@clack/prompts", () => ({
	get isCancel() {
		return mockIsCancel;
	},
	log: {
		get warn() {
			return mockWarn;
		},
	},
	get text() {
		return mockText;
	},
}));

const mockMkdir = vi.fn();

vi.mock("node:fs/promises", () => ({
	default: {
		get mkdir() {
			return mockMkdir;
		},
	},
}));

const mockValidateNewDirectory = vi.fn();

vi.mock("./validators.js", () => ({
	get validateNewDirectory() {
		return mockValidateNewDirectory;
	},
}));

const requested = "directory-requested";
const prompted = "directory-prompted";

describe("promptForInitializationDirectory", () => {
	it("creates the directory when one is requested and it does not yet exist", async () => {
		mockValidateNewDirectory.mockReturnValueOnce(undefined);

		const actual = await promptForInitializationDirectory(
			requested,
			templateAnonymous,
		);

		expect(actual).toBe(requested);
		expect(mockWarn).not.toHaveBeenCalled();
		expect(mockMkdir).toHaveBeenCalledWith(requested, { recursive: true });
		expect(mockText).not.toHaveBeenCalled();
	});

	it("prompts for a new directory when one is requested that already exists", async () => {
		mockValidateNewDirectory.mockReturnValueOnce("it exists");
		mockText.mockResolvedValueOnce(prompted);

		const actual = await promptForInitializationDirectory(
			requested,
			templateAnonymous,
		);

		expect(actual).toBe(prompted);
		expect(mockMkdir).toHaveBeenCalledWith(prompted, { recursive: true });
		expect(mockText).toHaveBeenCalledWith({
			message: "What directory would you like to create the repository in?",
			validate: validateNewDirectory,
		});
	});

	it("does not provide an initial value when prompting and the template does not have a name", async () => {
		mockValidateNewDirectory.mockReturnValueOnce("it exists");
		mockText.mockResolvedValueOnce(prompted);

		await promptForInitializationDirectory(requested, templateAnonymous);

		expect(mockText).toHaveBeenCalledWith({
			initialValue: undefined,
			message: "What directory would you like to create the repository in?",
			validate: validateNewDirectory,
		});
	});

	it("uses the template name for an initial value when prompting and it exists", async () => {
		mockValidateNewDirectory.mockReturnValueOnce("it exists");
		mockText.mockResolvedValueOnce(prompted);

		await promptForInitializationDirectory(requested, templateWithName);

		expect(mockText).toHaveBeenCalledWith({
			initialValue: "my-test",
			message: "What directory would you like to create the repository in?",
			validate: validateNewDirectory,
		});
	});
});

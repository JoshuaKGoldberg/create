import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { logHelpOptions } from "./logHelpOptions.js";

export interface HelpSource {
	descriptor: string;
	type: string;
}

export function logHelpText(mode: string, source?: Error | HelpSource) {
	logHelpOptions("create", [
		{
			examples: ["typescript-app --directory my-fancy-project"],
			flag: "directory",
			text: "What local directory path to run under",
			type: "string",
		},
		{
			examples: [
				"typescript-app --from @example/my-fancy-template",
				"typescript-app --from ../create-typescript-app",
			],
			flag: "from",
			text: "An explicit package or path to import a template from.",
			type: "string",
		},
		{
			examples: ["--help"],
			flag: "help",
			text: "Prints help text.",
			type: "string",
		},
		{
			examples: [
				"typescript-app --mode initialize",
				"typescript-app --mode migrate",
			],
			flag: "mode",
			text: "Which mode to run in.",
			type: '"initialize" | "migrate"',
		},
		{
			examples: ["typescript-app --offline"],
			flag: "offline",
			text: 'Whether to run in an "offline" mode that skips network requests.',
			type: "boolean",
		},
		{
			examples: ["typescript-app --preset common"],
			flag: "preset",
			text: "Which preset to use from the template.",
			type: "string",
		},
		{
			examples: ["--version"],
			flag: "version",
			text: "Prints the create package version.",
			type: "boolean",
		},
	]);

	if (source instanceof Error) {
		prompts.log.error(source.message);
	} else if (source) {
		prompts.log.info(
			[
				chalk.green(`--mode ${mode}`),
				` detected with the `,
				chalk.blue(source.descriptor),
				" ",
				source.type,
			].join(""),
		);
	}
}

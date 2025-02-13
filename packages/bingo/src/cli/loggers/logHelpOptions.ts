import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { formatFlag } from "./formatFlag.js";

export interface HelpOption {
	examples?: string[];
	flag: string;
	text?: string;
	type: string;
}

export function logHelpOptions(category: string, options: HelpOption[]) {
	prompts.log.message(
		[
			`${chalk.bgGreenBright.black(category)} options:`,
			"",
			...options.map((option) => {
				const text = option.text ? chalk.blue(option.text) : "";
				return [
					`  ${formatFlag(option.flag, option.type)}${chalk.blue(text)}`,
					option.examples?.length &&
						`\n${option.examples
							.map((example) => chalk.blue(`      npx bingo ${example}\n`))
							.join("")}`,
				]
					.filter(Boolean)
					.join("");
			}),
		].join("\n"),
	);
}

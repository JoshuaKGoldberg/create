import * as prompts from "@clack/prompts";
import { CachedFactory } from "cached-factory";

import { SystemDisplay, SystemDisplayItem } from "../../types/system.js";

export type SystemItemsDump = Record<string, Record<string, SystemDisplayItem>>;

export function createClackDisplay() {
	const spinner = prompts.spinner();
	const groups = new CachedFactory<
		string,
		CachedFactory<string, SystemDisplayItem>
	>(() => new CachedFactory(() => ({})));

	const display = {
		item(group, id, item) {
			Object.assign(groups.get(group).get(id), item);
		},
		log(message) {
			spinner.message(message);
		},
	} satisfies SystemDisplay;

	return {
		...display,
		dumpItems(): SystemItemsDump {
			return Object.fromEntries(
				Array.from(groups.entries()).map(([key, factory]) => [
					key,
					Object.fromEntries(factory.entries()),
				]),
			);
		},
		spinner,
	};
}

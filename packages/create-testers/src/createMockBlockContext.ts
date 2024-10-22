import { type BlockContext } from "create";

import { createFailingFunction, failingFunction } from "./utils.js";

export function createMockBlockContext<
	Options extends object,
	Overrides extends Partial<BlockContext<Options>>,
>(overrides?: Overrides): BlockContext<Options> & Overrides {
	return {
		created: {
			documentation: {},
			editor: {},
			jobs: [],
			metadata: [],
			...overrides?.created,
		},
		get options(): never {
			return failingFunction("options");
		},
		take: createFailingFunction("take"),
		...overrides,
	} as BlockContext<Options> & Overrides;
}

import { describe, expect, test } from "vitest";

import { mergeScripts } from "./mergeScripts.js";

describe("mergeScripts", () => {
	test.each([
		[undefined, undefined, undefined],
		[[], undefined, []],
		[undefined, [], []],
		[[], [], []],
		[
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
			],
			undefined,
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build", "pnpm run"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run"],
					phase: 0,
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run"],
					phase: 0,
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build", "pnpm run"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run"],
					phase: 0,
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build", "pnpm run:a"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run:b"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run:a"],
					phase: 0,
				},
				{
					commands: ["pnpm build", "pnpm run:b"],
					phase: 0,
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build", "pnpm run:a"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run:a", "pnpm run:b"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run:a", "pnpm run:b"],
					phase: 0,
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build", "pnpm run:a", "pnpm run:b"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run:a"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run:a", "pnpm run:b"],
					phase: 0,
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build", "pnpm run:a", "pnpm run:b"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run:c"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run:a", "pnpm run:b"],
					phase: 0,
				},
				{
					commands: ["pnpm build", "pnpm run:c"],
					phase: 0,
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build"],
					phase: 1,
				},
			],
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
				{
					commands: ["pnpm build"],
					phase: 1,
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm lint"],
					phase: 1,
				},
			],
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
				{
					commands: ["pnpm lint"],
					phase: 1,
				},
			],
		],
	])("%j and %j", (first, second, expected) => {
		const actual = mergeScripts(first, second);

		expect(actual).toEqual(expected);
	});
});
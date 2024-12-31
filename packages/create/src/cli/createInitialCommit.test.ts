import { describe, expect, test, vi } from "vitest";

import { createInitialCommit } from "./createInitialCommit.js";

describe("createInitialCommit", () => {
	test("commands", async () => {
		const runner = vi.fn();

		await createInitialCommit(runner);

		expect(runner.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "git add -A",
			  ],
			  [
			    "git commit --message feat:\\ initialized\\ repo\\ ✨ --no-gpg-sign",
			  ],
			  [
			    "git push -u origin main --force",
			  ],
			]
		`);
	});
});

import { describe, expect, test, vi } from "vitest";

import { createInitialCommit } from "./createInitialCommit.js";

describe("createInitialCommit", () => {
	test("runs without --amend when amend is falsy", async () => {
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

	test("runs with --amend when amend is true", async () => {
		const runner = vi.fn();

		await createInitialCommit(runner, true);

		expect(runner.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "git add -A",
			  ],
			  [
			    "git commit --message feat:\\ initialized\\ repo\\ ✨ --amend --no-gpg-sign",
			  ],
			  [
			    "git push -u origin main --force",
			  ],
			]
		`);
	});
});

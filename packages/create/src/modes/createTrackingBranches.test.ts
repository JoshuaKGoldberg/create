import { describe, expect, test, vi } from "vitest";

import { createTrackingBranches } from "./createTrackingBranches.js";

describe("createTrackingBranches", () => {
	test("commands", async () => {
		const runner = vi.fn();

		await createTrackingBranches(
			{ owner: "TestOwner", repository: "test-repository" },
			runner,
		);

		expect(runner.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "git init",
			  ],
			  [
			    "git remote add origin https://github.com/TestOwner/test-repository",
			  ],
			  [
			    "git add -A",
			  ],
			  [
			    "git commit --message "feat:\\ initialized\\ repo\\ ✨" --no-gpg-sign",
			  ],
			  [
			    "git push -u origin main --force",
			  ],
			]
		`);
	});
});

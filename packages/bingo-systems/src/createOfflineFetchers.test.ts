import { describe, expect, it } from "vitest";

import { createOfflineFetchers } from "./createOfflineFetchers.js";

describe("createOfflineFetchers", () => {
	it("rejects when called", async () => {
		const fetchers = createOfflineFetchers();

		await expect(
			async () => await fetchers.fetch(""),
		).rejects.toMatchInlineSnapshot(
			`[Error: Offline specified. This request should be caught by its Input.]`,
		);
	});
});

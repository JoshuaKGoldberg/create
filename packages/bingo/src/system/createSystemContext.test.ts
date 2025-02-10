import { describe, expect, it, vi } from "vitest";

import { createSystemContext } from "./createSystemContext.js";

const mockOfflineFetchers = {
	variant: "offline",
};

vi.mock("./createOfflineFetchers", () => ({
	createOfflineFetchers: () => mockOfflineFetchers,
}));

const mockSystemFetchers = {
	variant: "system",
};

vi.mock("./createSystemFetchers", () => ({
	createSystemFetchers: () => mockSystemFetchers,
}));

describe("createSystemContext", () => {
	describe("fetchers", () => {
		it("creates standard fetchers when fetchers and offline are not provided", () => {
			const { fetchers } = createSystemContext({ directory: "." });

			expect(fetchers).toBe(mockSystemFetchers);
		});

		it("creates offline fetchers when fetchers is not provided and offline is true", () => {
			const { fetchers } = createSystemContext({
				directory: ".",
				offline: true,
			});

			expect(fetchers).toBe(mockOfflineFetchers);
		});
	});
});

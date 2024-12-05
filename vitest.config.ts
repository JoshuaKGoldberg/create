import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			exclude: [
				"packages/site/astro.config.ts",
				"packages/site/src/content",
				"**/*.d.ts",
				"**/*.js",
			],
		},
	},
});

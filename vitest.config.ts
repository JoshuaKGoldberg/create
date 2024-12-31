import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			exclude: [
				"**/.*",
				"**/*.d.ts",
				"**/*.js",
				"**/vitest.*.ts",
				"packages/*/src/index.ts",
				"packages/site/astro.config.ts",
				"packages/site/src/content",
			],
		},
	},
});

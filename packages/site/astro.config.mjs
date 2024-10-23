import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import { remarkHeadingId } from "remark-custom-heading-id";

export default defineConfig({
	integrations: [
		starlight({
			sidebar: [
				{
					items: [
						{ label: "Schemas", link: "concepts/schemas" },
						{ label: "Blocks", link: "concepts/blocks" },
						{ label: "Inputs", link: "concepts/inputs" },
						{ label: "Presets", link: "concepts/presets" },
					],
					label: "Concepts",
				},
				{
					items: [
						{ label: "Contexts", link: "runtime/contexts" },
						{ label: "Creations", link: "runtime/creations" },
						{ label: "Phases", link: "runtime/phases" },
					],
					label: "Runtime",
				},
				{
					items: [
						{ label: "produceBlock", link: "api/produce-block" },
						{ label: "producePreset", link: "api/produce-preset" },
					],
					label: "API",
				},
				{
					items: [
						{ label: "Schemas", link: "testing/schemas" },
						{ label: "Blocks", link: "testing/blocks" },
						{ label: "Inputs", link: "testing/inputs" },
					],
					label: "Testing",
				},
			],
			social: {
				github: "https://github.com/JoshuaKGoldberg/create",
			},
			title: "create",
		}),
	],
	markdown: {
		remarkPlugins: [remarkHeadingId],
	},
});

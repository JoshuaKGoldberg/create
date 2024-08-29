import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

export default defineConfig({
	integrations: [
		starlight({
			sidebar: [
				{
					label: "About",
					link: "about",
				},
				{
					items: [
						{ label: "About", link: "blocks/about" },
						{ label: "Options", link: "blocks/options" },
						{ label: "Inputs", link: "blocks/inputs" },
					],
					label: "Blocks",
				},
				{
					items: [
						{ label: "About", link: "inputs/about" },
						{ label: "Options", link: "inputs/options" },
						{ label: "Composition", link: "inputs/composition" },
					],
					label: "Inputs",
				},
				{
					items: [
						{ label: "About", link: "addons/about" },
						{ label: "Options", link: "addons/options" },
					],
					label: "Addons",
				},
				{
					items: [
						{ label: "About", link: "presets/about" },
						{ label: "Options", link: "presets/options" },
						{ label: "Repositories", link: "presets/repositories" },
					],
					label: "Presets",
				},
				{
					items: [
						{ label: "About", link: "running/about" },
						{ label: "CLI", link: "running/cli" },
						{ label: "Configuration", link: "running/configuration" },
					],
					label: "Running",
				},
				{
					items: [
						{ label: "Blocks", link: "testing/blocks" },
						{ label: "Inputs", link: "testing/inputs" },
						{ label: "Addons", link: "testing/addons" },
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
});

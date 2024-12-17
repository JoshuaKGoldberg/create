import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import { remarkHeadingId } from "remark-custom-heading-id";

export default defineConfig({
	integrations: [
		starlight({
			customCss: ["./src/styles.css"],
			sidebar: [
				{ label: "CLI", link: "cli" },
				{ label: "Configuration", link: "configuration" },
				{
					items: [
						{ label: "About", link: "engine/about" },
						{
							items: [
								{ label: "Bases", link: "engine/concepts/bases" },
								{ label: "Blocks", link: "engine/concepts/blocks" },
								{ label: "Presets", link: "engine/concepts/presets" },
								{ label: "Templates", link: "engine/concepts/templates" },
							],
							label: "Concepts",
						},
						{
							items: [
								{ label: "Contexts", link: "engine/runtime/contexts" },
								{ label: "Creations", link: "engine/runtime/creations" },
								{ label: "Execution", link: "engine/runtime/execution" },
								{ label: "Inputs", link: "engine/runtime/inputs" },
								{ label: "Merging", link: "engine/runtime/merging" },
							],
							label: "Runtime",
						},
						{
							items: [
								{ label: "Creators", link: "engine/apis/creators" },
								{ label: "Producers", link: "engine/apis/producers" },
								{ label: "Runners", link: "engine/apis/runners" },
								{ label: "Testers", link: "engine/apis/testers" },
							],
							label: "APIs",
						},
					],
					label: "Engine",
				},
				{ label: "FAQs", link: "faqs" },
				{ label: "Glossary", link: "glossary" },
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

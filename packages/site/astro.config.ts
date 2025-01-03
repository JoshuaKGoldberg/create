import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import { remarkHeadingId } from "remark-custom-heading-id";

export default defineConfig({
	integrations: [
		starlight({
			components: {
				Footer: "src/components/Footer.astro",
				Head: "src/components/Head.astro",
			},
			customCss: ["src/styles.css"],
			favicon: "/favicon.png",
			logo: {
				src: "src/assets/favicon.png",
			},
			sidebar: [
				{ label: "About", link: "about" },
				{ label: "CLI", link: "cli" },
				{ label: "Configuration", link: "configuration" },
				{ label: "FAQs", link: "faqs" },
				{ label: "Glossary", link: "glossary" },
				{
					collapsed: true,
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
					label: "Templating Engine",
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
	site: "https://create.bingo",
});

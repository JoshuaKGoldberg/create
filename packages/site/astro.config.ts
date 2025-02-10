import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import { remarkHeadingId } from "remark-custom-heading-id";
import starlightSidebarTopics from "starlight-sidebar-topics";

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
			plugins: [
				starlightSidebarTopics([
					{
						icon: "open-book",
						items: [
							{ label: "About", link: "about" },
							{ label: "CLI", link: "cli" },
							{ label: "Configuration", link: "configuration" },
							{ label: "FAQs", link: "faqs" },
							{ label: "Glossary", link: "glossary" },
						],
						label: "Get Started",
						link: "/about",
					},
					{
						icon: "information",
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
								],
								label: "APIs",
							},
							{
								items: [
									{ label: "create-fs", link: "engine/packages/create-fs" },
									{
										label: "create-testers",
										link: "engine/packages/create-testers",
									},
								],
								label: "Packages",
							},
							{ label: "Templating FAQs", link: "engine/templating-faqs" },
						],
						label: "Templating Engine",
						link: "/engine/about",
					},
				]),
			],
			social: {
				github: "https://github.com/JoshuaKGoldberg/bingo",
			},
			title: "Bingo",
		}),
	],
	markdown: {
		remarkPlugins: [remarkHeadingId],
	},
	site: "https://create.bingo",
});

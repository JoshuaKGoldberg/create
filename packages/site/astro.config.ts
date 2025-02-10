import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import { remarkHeadingId } from "remark-custom-heading-id";
import starlightLinksValidator from "starlight-links-validator";
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
				starlightLinksValidator(),
				starlightSidebarTopics([
					{
						icon: "open-book",
						items: [
							{ label: "About Bingo", link: "about" },
							{ label: "CLI", link: "cli" },
							{ label: "Configuration", link: "configuration" },
							{ label: "FAQs", link: "faqs" },
						],
						label: "About",
						link: "/about",
					},
					{
						icon: "pen",
						items: [
							{ label: "About", link: "build/about" },
							{
								items: [
									{ label: "Creations", link: "build/concepts/creations" },
									{ label: "Inputs", link: "build/concepts/inputs" },
									{ label: "Modes", link: "build/concepts/modes" },
									{ label: "Templates", link: "build/concepts/templates" },
								],
								label: "Concepts",
							},
							{
								items: [
									{ label: "Contexts", link: "build/details/contexts" },
									{ label: "Merging", link: "build/details/merging" },
								],
								label: "Details",
							},
							{
								items: [
									{
										label: "createInput",
										link: "build/apis/create-input",
									},
									{
										label: "createTemplate",
										link: "build/apis/create-template",
									},
									{
										label: "prepareOptions",
										link: "build/apis/prepare-options",
									},
									{
										label: "produceInput",
										link: "build/apis/produce-input",
									},
									{
										label: "produceTemplate",
										link: "build/apis/produce-template",
									},
									{
										label: "runTemplate",
										link: "build/apis/run-template",
									},
								],
								label: "APIs",
							},
							{
								items: [
									{ label: "bingo-fs", link: "build/packages/bingo-fs" },
									{
										label: "bingo-testers",
										link: "build/packages/bingo-testers",
									},
								],
								label: "Packages",
							},
							{ label: "FAQs", link: "build/faqs" },
						],
						label: "Building Templates",
						link: "/build/about",
					},
					{
						icon: "setting",
						items: [
							{ label: "About", link: "engines/about" },
							{ label: "Handlebars", link: "engines/handlebars/about" },
							{
								collapsed: true,
								items: [
									{ label: "About", link: "engines/stratum/about" },
									{
										items: [
											{
												label: "Bases",
												link: "engines/stratum/concepts/bases",
											},
											{
												label: "Blocks",
												link: "engines/stratum/concepts/blocks",
											},
											{
												label: "Presets",
												link: "engines/stratum/concepts/presets",
											},
											{
												label: "Templates",
												link: "engines/stratum/concepts/templates",
											},
										],
										label: "Concepts",
									},
									{
										items: [
											{
												label: "Contexts",
												link: "engines/stratum/details/contexts",
											},
											{
												label: "Execution",
												link: "engines/stratum/details/execution",
											},
										],
										label: "Details",
									},
									{
										items: [
											{
												label: "Creators",
												link: "engines/stratum/apis/creators",
											},
											{
												label: "Producers",
												link: "engines/stratum/apis/producers",
											},
											{
												label: "Runners",
												link: "engines/stratum/apis/runners",
											},
											{
												label: "Testers",
												link: "engines/stratum/apis/testers",
											},
										],
										label: "APIs",
									},
									{ label: "FAQs", link: "engines/stratum/faqs" },
								],
								label: "Stratum",
							},
							{ label: "Custom Engines", link: "engines/custom" },
						],
						label: "Templating Engines",
						link: "/engines/about",
					},
				]),
			],
			social: {
				github: "https://github.com/JoshuaKGoldberg/bingo",
			},
			tableOfContents: {
				maxHeadingLevel: 4,
			},
			title: "Bingo",
		}),
	],
	markdown: {
		remarkPlugins: [remarkHeadingId],
	},
	site: "https://create.bingo",
});

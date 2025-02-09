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
							{ label: "About Create", link: "about" },
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
										label: "produceInput",
										link: "build/apis/produce-input",
									},
									{
										label: "produceOptions",
										link: "build/apis/produce-options",
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
									{ label: "create-fs", link: "build/packages/create-fs" },
									{
										label: "create-testers",
										link: "build/packages/create-testers",
									},
								],
								label: "Packages",
							},
							{ label: "FAQs", link: "build/faqs" },
						],
						label: "Building Templates",
						link: "/build/about",
					},
				]),
			],
			social: {
				github: "https://github.com/JoshuaKGoldberg/create",
			},
			tableOfContents: {
				maxHeadingLevel: 4,
			},
			title: "create",
		}),
	],
	markdown: {
		remarkPlugins: [remarkHeadingId],
	},
	site: "https://create.bingo",
});

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
						{ label: "Presets", link: "concepts/presets" },
						{ label: "Inputs", link: "concepts/inputs" },
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
						{ label: "Creators", link: "apis/creators" },
						{ label: "Producers", link: "apis/producers" },
						{ label: "Testers", link: "apis/testers" },
					],
					label: "APIs",
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

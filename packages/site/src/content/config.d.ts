export declare const collections: {
	docs: import("astro:content").CollectionConfig<
		import("astro/zod").ZodObject<
			{
				title: import("astro/zod").ZodString;
				description: import("astro/zod").ZodOptional<
					import("astro/zod").ZodString
				>;
				editUrl: import("astro/zod").ZodDefault<
					import("astro/zod").ZodOptional<
						import("astro/zod").ZodUnion<
							[import("astro/zod").ZodString, import("astro/zod").ZodBoolean]
						>
					>
				>;
				head: import("astro/zod").ZodDefault<
					import("astro/zod").ZodArray<
						import("astro/zod").ZodObject<
							{
								tag: import("astro/zod").ZodEnum<
									[
										"title",
										"base",
										"link",
										"style",
										"meta",
										"script",
										"noscript",
										"template",
									]
								>;
								attrs: import("astro/zod").ZodDefault<
									import("astro/zod").ZodRecord<
										import("astro/zod").ZodString,
										import("astro/zod").ZodUnion<
											[
												import("astro/zod").ZodString,
												import("astro/zod").ZodBoolean,
												import("astro/zod").ZodUndefined,
											]
										>
									>
								>;
								content: import("astro/zod").ZodDefault<
									import("astro/zod").ZodString
								>;
							},
							"strip",
							import("astro/zod").ZodTypeAny,
							{
								attrs: Record<string, string | boolean | undefined>;
								tag:
									| "link"
									| "script"
									| "title"
									| "style"
									| "base"
									| "meta"
									| "noscript"
									| "template";
								content: string;
							},
							{
								tag:
									| "link"
									| "script"
									| "title"
									| "style"
									| "base"
									| "meta"
									| "noscript"
									| "template";
								attrs?:
									| Record<string, string | boolean | undefined>
									| undefined;
								content?: string | undefined;
							}
						>,
						"many"
					>
				>;
				tableOfContents: import("astro/zod").ZodOptional<
					import("astro/zod").ZodEffects<
						import("astro/zod").ZodDefault<
							import("astro/zod").ZodUnion<
								[
									import("astro/zod").ZodObject<
										{
											minHeadingLevel: import("astro/zod").ZodDefault<
												import("astro/zod").ZodOptional<
													import("astro/zod").ZodNumber
												>
											>;
											maxHeadingLevel: import("astro/zod").ZodDefault<
												import("astro/zod").ZodOptional<
													import("astro/zod").ZodNumber
												>
											>;
										},
										"strip",
										import("astro/zod").ZodTypeAny,
										{
											minHeadingLevel: number;
											maxHeadingLevel: number;
										},
										{
											minHeadingLevel?: number | undefined;
											maxHeadingLevel?: number | undefined;
										}
									>,
									import("astro/zod").ZodEffects<
										import("astro/zod").ZodBoolean,
										| false
										| {
												minHeadingLevel: number;
												maxHeadingLevel: number;
										  },
										boolean
									>,
								]
							>
						>,
						| false
						| {
								minHeadingLevel: number;
								maxHeadingLevel: number;
						  }
						| {
								minHeadingLevel: number;
								maxHeadingLevel: number;
						  },
						| boolean
						| {
								minHeadingLevel?: number | undefined;
								maxHeadingLevel?: number | undefined;
						  }
						| undefined
					>
				>;
				template: import("astro/zod").ZodDefault<
					import("astro/zod").ZodEnum<["doc", "splash"]>
				>;
				hero: import("astro/zod").ZodOptional<
					import("astro/zod").ZodObject<
						{
							title: import("astro/zod").ZodOptional<
								import("astro/zod").ZodString
							>;
							tagline: import("astro/zod").ZodOptional<
								import("astro/zod").ZodString
							>;
							image: import("astro/zod").ZodOptional<
								import("astro/zod").ZodUnion<
									[
										import("astro/zod").ZodObject<
											{
												alt: import("astro/zod").ZodDefault<
													import("astro/zod").ZodString
												>;
												file: import("astro/zod").ZodObject<
													{
														src: import("astro/zod").ZodString;
														width: import("astro/zod").ZodNumber;
														height: import("astro/zod").ZodNumber;
														format: import("astro/zod").ZodUnion<
															[
																import("astro/zod").ZodLiteral<"png">,
																import("astro/zod").ZodLiteral<"jpg">,
																import("astro/zod").ZodLiteral<"jpeg">,
																import("astro/zod").ZodLiteral<"tiff">,
																import("astro/zod").ZodLiteral<"webp">,
																import("astro/zod").ZodLiteral<"gif">,
																import("astro/zod").ZodLiteral<"svg">,
																import("astro/zod").ZodLiteral<"avif">,
															]
														>;
													},
													import("astro/zod").UnknownKeysParam,
													import("astro/zod").ZodTypeAny,
													{
														src: string;
														height: number;
														width: number;
														format:
															| "svg"
															| "png"
															| "jpg"
															| "jpeg"
															| "tiff"
															| "webp"
															| "gif"
															| "avif";
													},
													{
														src: string;
														height: number;
														width: number;
														format:
															| "svg"
															| "png"
															| "jpg"
															| "jpeg"
															| "tiff"
															| "webp"
															| "gif"
															| "avif";
													}
												>;
											},
											"strip",
											import("astro/zod").ZodTypeAny,
											{
												alt: string;
												file: {
													src: string;
													height: number;
													width: number;
													format:
														| "svg"
														| "png"
														| "jpg"
														| "jpeg"
														| "tiff"
														| "webp"
														| "gif"
														| "avif";
												};
											},
											{
												file: {
													src: string;
													height: number;
													width: number;
													format:
														| "svg"
														| "png"
														| "jpg"
														| "jpeg"
														| "tiff"
														| "webp"
														| "gif"
														| "avif";
												};
												alt?: string | undefined;
											}
										>,
										import("astro/zod").ZodObject<
											{
												alt: import("astro/zod").ZodDefault<
													import("astro/zod").ZodString
												>;
												dark: import("astro/zod").ZodObject<
													{
														src: import("astro/zod").ZodString;
														width: import("astro/zod").ZodNumber;
														height: import("astro/zod").ZodNumber;
														format: import("astro/zod").ZodUnion<
															[
																import("astro/zod").ZodLiteral<"png">,
																import("astro/zod").ZodLiteral<"jpg">,
																import("astro/zod").ZodLiteral<"jpeg">,
																import("astro/zod").ZodLiteral<"tiff">,
																import("astro/zod").ZodLiteral<"webp">,
																import("astro/zod").ZodLiteral<"gif">,
																import("astro/zod").ZodLiteral<"svg">,
																import("astro/zod").ZodLiteral<"avif">,
															]
														>;
													},
													import("astro/zod").UnknownKeysParam,
													import("astro/zod").ZodTypeAny,
													{
														src: string;
														height: number;
														width: number;
														format:
															| "svg"
															| "png"
															| "jpg"
															| "jpeg"
															| "tiff"
															| "webp"
															| "gif"
															| "avif";
													},
													{
														src: string;
														height: number;
														width: number;
														format:
															| "svg"
															| "png"
															| "jpg"
															| "jpeg"
															| "tiff"
															| "webp"
															| "gif"
															| "avif";
													}
												>;
												light: import("astro/zod").ZodObject<
													{
														src: import("astro/zod").ZodString;
														width: import("astro/zod").ZodNumber;
														height: import("astro/zod").ZodNumber;
														format: import("astro/zod").ZodUnion<
															[
																import("astro/zod").ZodLiteral<"png">,
																import("astro/zod").ZodLiteral<"jpg">,
																import("astro/zod").ZodLiteral<"jpeg">,
																import("astro/zod").ZodLiteral<"tiff">,
																import("astro/zod").ZodLiteral<"webp">,
																import("astro/zod").ZodLiteral<"gif">,
																import("astro/zod").ZodLiteral<"svg">,
																import("astro/zod").ZodLiteral<"avif">,
															]
														>;
													},
													import("astro/zod").UnknownKeysParam,
													import("astro/zod").ZodTypeAny,
													{
														src: string;
														height: number;
														width: number;
														format:
															| "svg"
															| "png"
															| "jpg"
															| "jpeg"
															| "tiff"
															| "webp"
															| "gif"
															| "avif";
													},
													{
														src: string;
														height: number;
														width: number;
														format:
															| "svg"
															| "png"
															| "jpg"
															| "jpeg"
															| "tiff"
															| "webp"
															| "gif"
															| "avif";
													}
												>;
											},
											"strip",
											import("astro/zod").ZodTypeAny,
											{
												alt: string;
												dark: {
													src: string;
													height: number;
													width: number;
													format:
														| "svg"
														| "png"
														| "jpg"
														| "jpeg"
														| "tiff"
														| "webp"
														| "gif"
														| "avif";
												};
												light: {
													src: string;
													height: number;
													width: number;
													format:
														| "svg"
														| "png"
														| "jpg"
														| "jpeg"
														| "tiff"
														| "webp"
														| "gif"
														| "avif";
												};
											},
											{
												dark: {
													src: string;
													height: number;
													width: number;
													format:
														| "svg"
														| "png"
														| "jpg"
														| "jpeg"
														| "tiff"
														| "webp"
														| "gif"
														| "avif";
												};
												light: {
													src: string;
													height: number;
													width: number;
													format:
														| "svg"
														| "png"
														| "jpg"
														| "jpeg"
														| "tiff"
														| "webp"
														| "gif"
														| "avif";
												};
												alt?: string | undefined;
											}
										>,
										import("astro/zod").ZodEffects<
											import("astro/zod").ZodObject<
												{
													html: import("astro/zod").ZodString;
												},
												"strip",
												import("astro/zod").ZodTypeAny,
												{
													html: string;
												},
												{
													html: string;
												}
											>,
											{
												html: string;
												alt: string;
											},
											{
												html: string;
											}
										>,
									]
								>
							>;
							actions: import("astro/zod").ZodDefault<
								import("astro/zod").ZodArray<
									import("astro/zod").ZodObject<
										{
											text: import("astro/zod").ZodString;
											link: import("astro/zod").ZodString;
											variant: import("astro/zod").ZodDefault<
												import("astro/zod").ZodEnum<
													["primary", "secondary", "minimal"]
												>
											>;
											icon: import("astro/zod").ZodOptional<
												import("astro/zod").ZodEffects<
													import("astro/zod").ZodUnion<
														[
															import("astro/zod").ZodEnum<
																[
																	(
																		| "twitter"
																		| "mastodon"
																		| "github"
																		| "gitlab"
																		| "bitbucket"
																		| "discord"
																		| "gitter"
																		| "codeberg"
																		| "codePen"
																		| "youtube"
																		| "threads"
																		| "linkedin"
																		| "twitch"
																		| "microsoftTeams"
																		| "instagram"
																		| "stackOverflow"
																		| "x.com"
																		| "telegram"
																		| "rss"
																		| "facebook"
																		| "email"
																		| "reddit"
																		| "patreon"
																		| "signal"
																		| "slack"
																		| "matrix"
																		| "openCollective"
																		| "hackerOne"
																		| "blueSky"
																		| "discourse"
																		| "zulip"
																		| "pinterest"
																		| "translate"
																		| "document"
																		| "error"
																		| "comment"
																		| "close"
																		| "seti:folder"
																		| "seti:default"
																		| "seti:bsl"
																		| "seti:mdo"
																		| "seti:salesforce"
																		| "seti:asm"
																		| "seti:bicep"
																		| "seti:bazel"
																		| "seti:c"
																		| "seti:c-sharp"
																		| "seti:html"
																		| "seti:cpp"
																		| "seti:clojure"
																		| "seti:coldfusion"
																		| "seti:config"
																		| "seti:crystal"
																		| "seti:crystal_embedded"
																		| "seti:json"
																		| "seti:css"
																		| "seti:csv"
																		| "seti:xls"
																		| "seti:cu"
																		| "seti:cake"
																		| "seti:cake_php"
																		| "seti:d"
																		| "seti:word"
																		| "seti:elixir"
																		| "seti:elixir_script"
																		| "seti:hex"
																		| "seti:elm"
																		| "seti:favicon"
																		| "seti:f-sharp"
																		| "seti:git"
																		| "seti:go"
																		| "seti:godot"
																		| "seti:gradle"
																		| "seti:grails"
																		| "seti:graphql"
																		| "seti:hacklang"
																		| "seti:haml"
																		| "seti:mustache"
																		| "seti:haskell"
																		| "seti:haxe"
																		| "seti:jade"
																		| "seti:java"
																		| "seti:javascript"
																		| "seti:jinja"
																		| "seti:julia"
																		| "seti:karma"
																		| "seti:kotlin"
																		| "seti:dart"
																		| "seti:liquid"
																		| "seti:livescript"
																		| "seti:lua"
																		| "seti:markdown"
																		| "seti:argdown"
																		| "seti:info"
																		| "seti:clock"
																		| "seti:maven"
																		| "seti:nim"
																		| "seti:github"
																		| "seti:notebook"
																		| "seti:nunjucks"
																		| "seti:npm"
																		| "seti:ocaml"
																		| "seti:odata"
																		| "seti:perl"
																		| "seti:php"
																		| "seti:pipeline"
																		| "seti:pddl"
																		| "seti:plan"
																		| "seti:happenings"
																		| "seti:powershell"
																		| "seti:prisma"
																		| "seti:pug"
																		| "seti:puppet"
																		| "seti:purescript"
																		| "seti:python"
																		| "seti:react"
																		| "seti:rescript"
																		| "seti:R"
																		| "seti:ruby"
																		| "seti:rust"
																		| "seti:sass"
																		| "seti:spring"
																		| "seti:slim"
																		| "seti:smarty"
																		| "seti:sbt"
																		| "seti:scala"
																		| "seti:ethereum"
																		| "seti:stylus"
																		| "seti:svelte"
																		| "seti:swift"
																		| "seti:db"
																		| "seti:terraform"
																		| "seti:tex"
																		| "seti:twig"
																		| "seti:typescript"
																		| "seti:tsconfig"
																		| "seti:vala"
																		| "seti:vue"
																		| "seti:wasm"
																		| "seti:wat"
																		| "seti:xml"
																		| "seti:yml"
																		| "seti:prolog"
																		| "seti:zig"
																		| "seti:zip"
																		| "seti:wgt"
																		| "seti:illustrator"
																		| "seti:photoshop"
																		| "seti:pdf"
																		| "seti:font"
																		| "seti:image"
																		| "seti:svg"
																		| "seti:sublime"
																		| "seti:code-search"
																		| "seti:shell"
																		| "seti:video"
																		| "seti:audio"
																		| "seti:windows"
																		| "seti:jenkins"
																		| "seti:babel"
																		| "seti:bower"
																		| "seti:docker"
																		| "seti:code-climate"
																		| "seti:eslint"
																		| "seti:firebase"
																		| "seti:firefox"
																		| "seti:gitlab"
																		| "seti:grunt"
																		| "seti:gulp"
																		| "seti:ionic"
																		| "seti:platformio"
																		| "seti:rollup"
																		| "seti:stylelint"
																		| "seti:yarn"
																		| "seti:webpack"
																		| "seti:lock"
																		| "seti:license"
																		| "seti:makefile"
																		| "seti:heroku"
																		| "seti:todo"
																		| "seti:ignored"
																		| "up-caret"
																		| "down-caret"
																		| "right-caret"
																		| "right-arrow"
																		| "left-arrow"
																		| "bars"
																		| "pencil"
																		| "pen"
																		| "add-document"
																		| "setting"
																		| "external"
																		| "moon"
																		| "sun"
																		| "laptop"
																		| "open-book"
																		| "information"
																		| "magnifier"
																		| "forward-slash"
																		| "warning"
																		| "approve-check-circle"
																		| "approve-check"
																		| "rocket"
																		| "star"
																		| "puzzle"
																		| "list-format"
																		| "random"
																		| "comment-alt"
																		| "heart"
																		| "farcaster"
																		| "astro"
																		| "alpine"
																		| "pnpm"
																		| "biome"
																		| "bun"
																		| "mdx"
																		| "apple"
																		| "linux"
																		| "homebrew"
																		| "nix"
																		| "starlight"
																		| "pkl"
																		| "node"
																		| "cloudflare"
																		| "vercel"
																		| "netlify"
																		| "deno"
																	),
																	...(
																		| "twitter"
																		| "mastodon"
																		| "github"
																		| "gitlab"
																		| "bitbucket"
																		| "discord"
																		| "gitter"
																		| "codeberg"
																		| "codePen"
																		| "youtube"
																		| "threads"
																		| "linkedin"
																		| "twitch"
																		| "microsoftTeams"
																		| "instagram"
																		| "stackOverflow"
																		| "x.com"
																		| "telegram"
																		| "rss"
																		| "facebook"
																		| "email"
																		| "reddit"
																		| "patreon"
																		| "signal"
																		| "slack"
																		| "matrix"
																		| "openCollective"
																		| "hackerOne"
																		| "blueSky"
																		| "discourse"
																		| "zulip"
																		| "pinterest"
																		| "translate"
																		| "document"
																		| "error"
																		| "comment"
																		| "close"
																		| "seti:folder"
																		| "seti:default"
																		| "seti:bsl"
																		| "seti:mdo"
																		| "seti:salesforce"
																		| "seti:asm"
																		| "seti:bicep"
																		| "seti:bazel"
																		| "seti:c"
																		| "seti:c-sharp"
																		| "seti:html"
																		| "seti:cpp"
																		| "seti:clojure"
																		| "seti:coldfusion"
																		| "seti:config"
																		| "seti:crystal"
																		| "seti:crystal_embedded"
																		| "seti:json"
																		| "seti:css"
																		| "seti:csv"
																		| "seti:xls"
																		| "seti:cu"
																		| "seti:cake"
																		| "seti:cake_php"
																		| "seti:d"
																		| "seti:word"
																		| "seti:elixir"
																		| "seti:elixir_script"
																		| "seti:hex"
																		| "seti:elm"
																		| "seti:favicon"
																		| "seti:f-sharp"
																		| "seti:git"
																		| "seti:go"
																		| "seti:godot"
																		| "seti:gradle"
																		| "seti:grails"
																		| "seti:graphql"
																		| "seti:hacklang"
																		| "seti:haml"
																		| "seti:mustache"
																		| "seti:haskell"
																		| "seti:haxe"
																		| "seti:jade"
																		| "seti:java"
																		| "seti:javascript"
																		| "seti:jinja"
																		| "seti:julia"
																		| "seti:karma"
																		| "seti:kotlin"
																		| "seti:dart"
																		| "seti:liquid"
																		| "seti:livescript"
																		| "seti:lua"
																		| "seti:markdown"
																		| "seti:argdown"
																		| "seti:info"
																		| "seti:clock"
																		| "seti:maven"
																		| "seti:nim"
																		| "seti:github"
																		| "seti:notebook"
																		| "seti:nunjucks"
																		| "seti:npm"
																		| "seti:ocaml"
																		| "seti:odata"
																		| "seti:perl"
																		| "seti:php"
																		| "seti:pipeline"
																		| "seti:pddl"
																		| "seti:plan"
																		| "seti:happenings"
																		| "seti:powershell"
																		| "seti:prisma"
																		| "seti:pug"
																		| "seti:puppet"
																		| "seti:purescript"
																		| "seti:python"
																		| "seti:react"
																		| "seti:rescript"
																		| "seti:R"
																		| "seti:ruby"
																		| "seti:rust"
																		| "seti:sass"
																		| "seti:spring"
																		| "seti:slim"
																		| "seti:smarty"
																		| "seti:sbt"
																		| "seti:scala"
																		| "seti:ethereum"
																		| "seti:stylus"
																		| "seti:svelte"
																		| "seti:swift"
																		| "seti:db"
																		| "seti:terraform"
																		| "seti:tex"
																		| "seti:twig"
																		| "seti:typescript"
																		| "seti:tsconfig"
																		| "seti:vala"
																		| "seti:vue"
																		| "seti:wasm"
																		| "seti:wat"
																		| "seti:xml"
																		| "seti:yml"
																		| "seti:prolog"
																		| "seti:zig"
																		| "seti:zip"
																		| "seti:wgt"
																		| "seti:illustrator"
																		| "seti:photoshop"
																		| "seti:pdf"
																		| "seti:font"
																		| "seti:image"
																		| "seti:svg"
																		| "seti:sublime"
																		| "seti:code-search"
																		| "seti:shell"
																		| "seti:video"
																		| "seti:audio"
																		| "seti:windows"
																		| "seti:jenkins"
																		| "seti:babel"
																		| "seti:bower"
																		| "seti:docker"
																		| "seti:code-climate"
																		| "seti:eslint"
																		| "seti:firebase"
																		| "seti:firefox"
																		| "seti:gitlab"
																		| "seti:grunt"
																		| "seti:gulp"
																		| "seti:ionic"
																		| "seti:platformio"
																		| "seti:rollup"
																		| "seti:stylelint"
																		| "seti:yarn"
																		| "seti:webpack"
																		| "seti:lock"
																		| "seti:license"
																		| "seti:makefile"
																		| "seti:heroku"
																		| "seti:todo"
																		| "seti:ignored"
																		| "up-caret"
																		| "down-caret"
																		| "right-caret"
																		| "right-arrow"
																		| "left-arrow"
																		| "bars"
																		| "pencil"
																		| "pen"
																		| "add-document"
																		| "setting"
																		| "external"
																		| "moon"
																		| "sun"
																		| "laptop"
																		| "open-book"
																		| "information"
																		| "magnifier"
																		| "forward-slash"
																		| "warning"
																		| "approve-check-circle"
																		| "approve-check"
																		| "rocket"
																		| "star"
																		| "puzzle"
																		| "list-format"
																		| "random"
																		| "comment-alt"
																		| "heart"
																		| "farcaster"
																		| "astro"
																		| "alpine"
																		| "pnpm"
																		| "biome"
																		| "bun"
																		| "mdx"
																		| "apple"
																		| "linux"
																		| "homebrew"
																		| "nix"
																		| "starlight"
																		| "pkl"
																		| "node"
																		| "cloudflare"
																		| "vercel"
																		| "netlify"
																		| "deno"
																	)[],
																]
															>,
															import("astro/zod").ZodString,
														]
													>,
													| {
															readonly type: "icon";
															readonly name:
																| "twitter"
																| "mastodon"
																| "github"
																| "gitlab"
																| "bitbucket"
																| "discord"
																| "gitter"
																| "codeberg"
																| "codePen"
																| "youtube"
																| "threads"
																| "linkedin"
																| "twitch"
																| "microsoftTeams"
																| "instagram"
																| "stackOverflow"
																| "x.com"
																| "telegram"
																| "rss"
																| "facebook"
																| "email"
																| "reddit"
																| "patreon"
																| "signal"
																| "slack"
																| "matrix"
																| "openCollective"
																| "hackerOne"
																| "blueSky"
																| "discourse"
																| "zulip"
																| "pinterest"
																| "translate"
																| "document"
																| "error"
																| "comment"
																| "close"
																| "seti:folder"
																| "seti:default"
																| "seti:bsl"
																| "seti:mdo"
																| "seti:salesforce"
																| "seti:asm"
																| "seti:bicep"
																| "seti:bazel"
																| "seti:c"
																| "seti:c-sharp"
																| "seti:html"
																| "seti:cpp"
																| "seti:clojure"
																| "seti:coldfusion"
																| "seti:config"
																| "seti:crystal"
																| "seti:crystal_embedded"
																| "seti:json"
																| "seti:css"
																| "seti:csv"
																| "seti:xls"
																| "seti:cu"
																| "seti:cake"
																| "seti:cake_php"
																| "seti:d"
																| "seti:word"
																| "seti:elixir"
																| "seti:elixir_script"
																| "seti:hex"
																| "seti:elm"
																| "seti:favicon"
																| "seti:f-sharp"
																| "seti:git"
																| "seti:go"
																| "seti:godot"
																| "seti:gradle"
																| "seti:grails"
																| "seti:graphql"
																| "seti:hacklang"
																| "seti:haml"
																| "seti:mustache"
																| "seti:haskell"
																| "seti:haxe"
																| "seti:jade"
																| "seti:java"
																| "seti:javascript"
																| "seti:jinja"
																| "seti:julia"
																| "seti:karma"
																| "seti:kotlin"
																| "seti:dart"
																| "seti:liquid"
																| "seti:livescript"
																| "seti:lua"
																| "seti:markdown"
																| "seti:argdown"
																| "seti:info"
																| "seti:clock"
																| "seti:maven"
																| "seti:nim"
																| "seti:github"
																| "seti:notebook"
																| "seti:nunjucks"
																| "seti:npm"
																| "seti:ocaml"
																| "seti:odata"
																| "seti:perl"
																| "seti:php"
																| "seti:pipeline"
																| "seti:pddl"
																| "seti:plan"
																| "seti:happenings"
																| "seti:powershell"
																| "seti:prisma"
																| "seti:pug"
																| "seti:puppet"
																| "seti:purescript"
																| "seti:python"
																| "seti:react"
																| "seti:rescript"
																| "seti:R"
																| "seti:ruby"
																| "seti:rust"
																| "seti:sass"
																| "seti:spring"
																| "seti:slim"
																| "seti:smarty"
																| "seti:sbt"
																| "seti:scala"
																| "seti:ethereum"
																| "seti:stylus"
																| "seti:svelte"
																| "seti:swift"
																| "seti:db"
																| "seti:terraform"
																| "seti:tex"
																| "seti:twig"
																| "seti:typescript"
																| "seti:tsconfig"
																| "seti:vala"
																| "seti:vue"
																| "seti:wasm"
																| "seti:wat"
																| "seti:xml"
																| "seti:yml"
																| "seti:prolog"
																| "seti:zig"
																| "seti:zip"
																| "seti:wgt"
																| "seti:illustrator"
																| "seti:photoshop"
																| "seti:pdf"
																| "seti:font"
																| "seti:image"
																| "seti:svg"
																| "seti:sublime"
																| "seti:code-search"
																| "seti:shell"
																| "seti:video"
																| "seti:audio"
																| "seti:windows"
																| "seti:jenkins"
																| "seti:babel"
																| "seti:bower"
																| "seti:docker"
																| "seti:code-climate"
																| "seti:eslint"
																| "seti:firebase"
																| "seti:firefox"
																| "seti:gitlab"
																| "seti:grunt"
																| "seti:gulp"
																| "seti:ionic"
																| "seti:platformio"
																| "seti:rollup"
																| "seti:stylelint"
																| "seti:yarn"
																| "seti:webpack"
																| "seti:lock"
																| "seti:license"
																| "seti:makefile"
																| "seti:heroku"
																| "seti:todo"
																| "seti:ignored"
																| "up-caret"
																| "down-caret"
																| "right-caret"
																| "right-arrow"
																| "left-arrow"
																| "bars"
																| "pencil"
																| "pen"
																| "add-document"
																| "setting"
																| "external"
																| "moon"
																| "sun"
																| "laptop"
																| "open-book"
																| "information"
																| "magnifier"
																| "forward-slash"
																| "warning"
																| "approve-check-circle"
																| "approve-check"
																| "rocket"
																| "star"
																| "puzzle"
																| "list-format"
																| "random"
																| "comment-alt"
																| "heart"
																| "farcaster"
																| "astro"
																| "alpine"
																| "pnpm"
																| "biome"
																| "bun"
																| "mdx"
																| "apple"
																| "linux"
																| "homebrew"
																| "nix"
																| "starlight"
																| "pkl"
																| "node"
																| "cloudflare"
																| "vercel"
																| "netlify"
																| "deno";
															readonly html?: undefined;
													  }
													| {
															readonly type: "raw";
															readonly html: string;
															readonly name?: undefined;
													  },
													string
												>
											>;
											attrs: import("astro/zod").ZodOptional<
												import("astro/zod").ZodRecord<
													import("astro/zod").ZodString,
													import("astro/zod").ZodUnion<
														[
															import("astro/zod").ZodString,
															import("astro/zod").ZodNumber,
															import("astro/zod").ZodBoolean,
														]
													>
												>
											>;
										},
										"strip",
										import("astro/zod").ZodTypeAny,
										{
											link: string;
											variant: "primary" | "secondary" | "minimal";
											text: string;
											attrs?:
												| Record<string, string | number | boolean>
												| undefined;
											icon?:
												| {
														readonly type: "icon";
														readonly name:
															| "twitter"
															| "mastodon"
															| "github"
															| "gitlab"
															| "bitbucket"
															| "discord"
															| "gitter"
															| "codeberg"
															| "codePen"
															| "youtube"
															| "threads"
															| "linkedin"
															| "twitch"
															| "microsoftTeams"
															| "instagram"
															| "stackOverflow"
															| "x.com"
															| "telegram"
															| "rss"
															| "facebook"
															| "email"
															| "reddit"
															| "patreon"
															| "signal"
															| "slack"
															| "matrix"
															| "openCollective"
															| "hackerOne"
															| "blueSky"
															| "discourse"
															| "zulip"
															| "pinterest"
															| "translate"
															| "document"
															| "error"
															| "comment"
															| "close"
															| "seti:folder"
															| "seti:default"
															| "seti:bsl"
															| "seti:mdo"
															| "seti:salesforce"
															| "seti:asm"
															| "seti:bicep"
															| "seti:bazel"
															| "seti:c"
															| "seti:c-sharp"
															| "seti:html"
															| "seti:cpp"
															| "seti:clojure"
															| "seti:coldfusion"
															| "seti:config"
															| "seti:crystal"
															| "seti:crystal_embedded"
															| "seti:json"
															| "seti:css"
															| "seti:csv"
															| "seti:xls"
															| "seti:cu"
															| "seti:cake"
															| "seti:cake_php"
															| "seti:d"
															| "seti:word"
															| "seti:elixir"
															| "seti:elixir_script"
															| "seti:hex"
															| "seti:elm"
															| "seti:favicon"
															| "seti:f-sharp"
															| "seti:git"
															| "seti:go"
															| "seti:godot"
															| "seti:gradle"
															| "seti:grails"
															| "seti:graphql"
															| "seti:hacklang"
															| "seti:haml"
															| "seti:mustache"
															| "seti:haskell"
															| "seti:haxe"
															| "seti:jade"
															| "seti:java"
															| "seti:javascript"
															| "seti:jinja"
															| "seti:julia"
															| "seti:karma"
															| "seti:kotlin"
															| "seti:dart"
															| "seti:liquid"
															| "seti:livescript"
															| "seti:lua"
															| "seti:markdown"
															| "seti:argdown"
															| "seti:info"
															| "seti:clock"
															| "seti:maven"
															| "seti:nim"
															| "seti:github"
															| "seti:notebook"
															| "seti:nunjucks"
															| "seti:npm"
															| "seti:ocaml"
															| "seti:odata"
															| "seti:perl"
															| "seti:php"
															| "seti:pipeline"
															| "seti:pddl"
															| "seti:plan"
															| "seti:happenings"
															| "seti:powershell"
															| "seti:prisma"
															| "seti:pug"
															| "seti:puppet"
															| "seti:purescript"
															| "seti:python"
															| "seti:react"
															| "seti:rescript"
															| "seti:R"
															| "seti:ruby"
															| "seti:rust"
															| "seti:sass"
															| "seti:spring"
															| "seti:slim"
															| "seti:smarty"
															| "seti:sbt"
															| "seti:scala"
															| "seti:ethereum"
															| "seti:stylus"
															| "seti:svelte"
															| "seti:swift"
															| "seti:db"
															| "seti:terraform"
															| "seti:tex"
															| "seti:twig"
															| "seti:typescript"
															| "seti:tsconfig"
															| "seti:vala"
															| "seti:vue"
															| "seti:wasm"
															| "seti:wat"
															| "seti:xml"
															| "seti:yml"
															| "seti:prolog"
															| "seti:zig"
															| "seti:zip"
															| "seti:wgt"
															| "seti:illustrator"
															| "seti:photoshop"
															| "seti:pdf"
															| "seti:font"
															| "seti:image"
															| "seti:svg"
															| "seti:sublime"
															| "seti:code-search"
															| "seti:shell"
															| "seti:video"
															| "seti:audio"
															| "seti:windows"
															| "seti:jenkins"
															| "seti:babel"
															| "seti:bower"
															| "seti:docker"
															| "seti:code-climate"
															| "seti:eslint"
															| "seti:firebase"
															| "seti:firefox"
															| "seti:gitlab"
															| "seti:grunt"
															| "seti:gulp"
															| "seti:ionic"
															| "seti:platformio"
															| "seti:rollup"
															| "seti:stylelint"
															| "seti:yarn"
															| "seti:webpack"
															| "seti:lock"
															| "seti:license"
															| "seti:makefile"
															| "seti:heroku"
															| "seti:todo"
															| "seti:ignored"
															| "up-caret"
															| "down-caret"
															| "right-caret"
															| "right-arrow"
															| "left-arrow"
															| "bars"
															| "pencil"
															| "pen"
															| "add-document"
															| "setting"
															| "external"
															| "moon"
															| "sun"
															| "laptop"
															| "open-book"
															| "information"
															| "magnifier"
															| "forward-slash"
															| "warning"
															| "approve-check-circle"
															| "approve-check"
															| "rocket"
															| "star"
															| "puzzle"
															| "list-format"
															| "random"
															| "comment-alt"
															| "heart"
															| "farcaster"
															| "astro"
															| "alpine"
															| "pnpm"
															| "biome"
															| "bun"
															| "mdx"
															| "apple"
															| "linux"
															| "homebrew"
															| "nix"
															| "starlight"
															| "pkl"
															| "node"
															| "cloudflare"
															| "vercel"
															| "netlify"
															| "deno";
														readonly html?: undefined;
												  }
												| {
														readonly type: "raw";
														readonly html: string;
														readonly name?: undefined;
												  }
												| undefined;
										},
										{
											link: string;
											text: string;
											variant?: "primary" | "secondary" | "minimal" | undefined;
											attrs?:
												| Record<string, string | number | boolean>
												| undefined;
											icon?: string | undefined;
										}
									>,
									"many"
								>
							>;
						},
						"strip",
						import("astro/zod").ZodTypeAny,
						{
							actions: {
								link: string;
								variant: "primary" | "secondary" | "minimal";
								text: string;
								attrs?: Record<string, string | number | boolean> | undefined;
								icon?:
									| {
											readonly type: "icon";
											readonly name:
												| "twitter"
												| "mastodon"
												| "github"
												| "gitlab"
												| "bitbucket"
												| "discord"
												| "gitter"
												| "codeberg"
												| "codePen"
												| "youtube"
												| "threads"
												| "linkedin"
												| "twitch"
												| "microsoftTeams"
												| "instagram"
												| "stackOverflow"
												| "x.com"
												| "telegram"
												| "rss"
												| "facebook"
												| "email"
												| "reddit"
												| "patreon"
												| "signal"
												| "slack"
												| "matrix"
												| "openCollective"
												| "hackerOne"
												| "blueSky"
												| "discourse"
												| "zulip"
												| "pinterest"
												| "translate"
												| "document"
												| "error"
												| "comment"
												| "close"
												| "seti:folder"
												| "seti:default"
												| "seti:bsl"
												| "seti:mdo"
												| "seti:salesforce"
												| "seti:asm"
												| "seti:bicep"
												| "seti:bazel"
												| "seti:c"
												| "seti:c-sharp"
												| "seti:html"
												| "seti:cpp"
												| "seti:clojure"
												| "seti:coldfusion"
												| "seti:config"
												| "seti:crystal"
												| "seti:crystal_embedded"
												| "seti:json"
												| "seti:css"
												| "seti:csv"
												| "seti:xls"
												| "seti:cu"
												| "seti:cake"
												| "seti:cake_php"
												| "seti:d"
												| "seti:word"
												| "seti:elixir"
												| "seti:elixir_script"
												| "seti:hex"
												| "seti:elm"
												| "seti:favicon"
												| "seti:f-sharp"
												| "seti:git"
												| "seti:go"
												| "seti:godot"
												| "seti:gradle"
												| "seti:grails"
												| "seti:graphql"
												| "seti:hacklang"
												| "seti:haml"
												| "seti:mustache"
												| "seti:haskell"
												| "seti:haxe"
												| "seti:jade"
												| "seti:java"
												| "seti:javascript"
												| "seti:jinja"
												| "seti:julia"
												| "seti:karma"
												| "seti:kotlin"
												| "seti:dart"
												| "seti:liquid"
												| "seti:livescript"
												| "seti:lua"
												| "seti:markdown"
												| "seti:argdown"
												| "seti:info"
												| "seti:clock"
												| "seti:maven"
												| "seti:nim"
												| "seti:github"
												| "seti:notebook"
												| "seti:nunjucks"
												| "seti:npm"
												| "seti:ocaml"
												| "seti:odata"
												| "seti:perl"
												| "seti:php"
												| "seti:pipeline"
												| "seti:pddl"
												| "seti:plan"
												| "seti:happenings"
												| "seti:powershell"
												| "seti:prisma"
												| "seti:pug"
												| "seti:puppet"
												| "seti:purescript"
												| "seti:python"
												| "seti:react"
												| "seti:rescript"
												| "seti:R"
												| "seti:ruby"
												| "seti:rust"
												| "seti:sass"
												| "seti:spring"
												| "seti:slim"
												| "seti:smarty"
												| "seti:sbt"
												| "seti:scala"
												| "seti:ethereum"
												| "seti:stylus"
												| "seti:svelte"
												| "seti:swift"
												| "seti:db"
												| "seti:terraform"
												| "seti:tex"
												| "seti:twig"
												| "seti:typescript"
												| "seti:tsconfig"
												| "seti:vala"
												| "seti:vue"
												| "seti:wasm"
												| "seti:wat"
												| "seti:xml"
												| "seti:yml"
												| "seti:prolog"
												| "seti:zig"
												| "seti:zip"
												| "seti:wgt"
												| "seti:illustrator"
												| "seti:photoshop"
												| "seti:pdf"
												| "seti:font"
												| "seti:image"
												| "seti:svg"
												| "seti:sublime"
												| "seti:code-search"
												| "seti:shell"
												| "seti:video"
												| "seti:audio"
												| "seti:windows"
												| "seti:jenkins"
												| "seti:babel"
												| "seti:bower"
												| "seti:docker"
												| "seti:code-climate"
												| "seti:eslint"
												| "seti:firebase"
												| "seti:firefox"
												| "seti:gitlab"
												| "seti:grunt"
												| "seti:gulp"
												| "seti:ionic"
												| "seti:platformio"
												| "seti:rollup"
												| "seti:stylelint"
												| "seti:yarn"
												| "seti:webpack"
												| "seti:lock"
												| "seti:license"
												| "seti:makefile"
												| "seti:heroku"
												| "seti:todo"
												| "seti:ignored"
												| "up-caret"
												| "down-caret"
												| "right-caret"
												| "right-arrow"
												| "left-arrow"
												| "bars"
												| "pencil"
												| "pen"
												| "add-document"
												| "setting"
												| "external"
												| "moon"
												| "sun"
												| "laptop"
												| "open-book"
												| "information"
												| "magnifier"
												| "forward-slash"
												| "warning"
												| "approve-check-circle"
												| "approve-check"
												| "rocket"
												| "star"
												| "puzzle"
												| "list-format"
												| "random"
												| "comment-alt"
												| "heart"
												| "farcaster"
												| "astro"
												| "alpine"
												| "pnpm"
												| "biome"
												| "bun"
												| "mdx"
												| "apple"
												| "linux"
												| "homebrew"
												| "nix"
												| "starlight"
												| "pkl"
												| "node"
												| "cloudflare"
												| "vercel"
												| "netlify"
												| "deno";
											readonly html?: undefined;
									  }
									| {
											readonly type: "raw";
											readonly html: string;
											readonly name?: undefined;
									  }
									| undefined;
							}[];
							title?: string | undefined;
							tagline?: string | undefined;
							image?:
								| {
										alt: string;
										file: {
											src: string;
											height: number;
											width: number;
											format:
												| "svg"
												| "png"
												| "jpg"
												| "jpeg"
												| "tiff"
												| "webp"
												| "gif"
												| "avif";
										};
								  }
								| {
										alt: string;
										dark: {
											src: string;
											height: number;
											width: number;
											format:
												| "svg"
												| "png"
												| "jpg"
												| "jpeg"
												| "tiff"
												| "webp"
												| "gif"
												| "avif";
										};
										light: {
											src: string;
											height: number;
											width: number;
											format:
												| "svg"
												| "png"
												| "jpg"
												| "jpeg"
												| "tiff"
												| "webp"
												| "gif"
												| "avif";
										};
								  }
								| {
										html: string;
										alt: string;
								  }
								| undefined;
						},
						{
							title?: string | undefined;
							tagline?: string | undefined;
							image?:
								| {
										file: {
											src: string;
											height: number;
											width: number;
											format:
												| "svg"
												| "png"
												| "jpg"
												| "jpeg"
												| "tiff"
												| "webp"
												| "gif"
												| "avif";
										};
										alt?: string | undefined;
								  }
								| {
										dark: {
											src: string;
											height: number;
											width: number;
											format:
												| "svg"
												| "png"
												| "jpg"
												| "jpeg"
												| "tiff"
												| "webp"
												| "gif"
												| "avif";
										};
										light: {
											src: string;
											height: number;
											width: number;
											format:
												| "svg"
												| "png"
												| "jpg"
												| "jpeg"
												| "tiff"
												| "webp"
												| "gif"
												| "avif";
										};
										alt?: string | undefined;
								  }
								| {
										html: string;
								  }
								| undefined;
							actions?:
								| {
										link: string;
										text: string;
										variant?: "primary" | "secondary" | "minimal" | undefined;
										attrs?:
											| Record<string, string | number | boolean>
											| undefined;
										icon?: string | undefined;
								  }[]
								| undefined;
						}
					>
				>;
				lastUpdated: import("astro/zod").ZodOptional<
					import("astro/zod").ZodUnion<
						[import("astro/zod").ZodDate, import("astro/zod").ZodBoolean]
					>
				>;
				prev: import("astro/zod").ZodOptional<
					import("astro/zod").ZodUnion<
						[
							import("astro/zod").ZodBoolean,
							import("astro/zod").ZodString,
							import("astro/zod").ZodObject<
								{
									link: import("astro/zod").ZodOptional<
										import("astro/zod").ZodString
									>;
									label: import("astro/zod").ZodOptional<
										import("astro/zod").ZodString
									>;
								},
								"strict",
								import("astro/zod").ZodTypeAny,
								{
									link?: string | undefined;
									label?: string | undefined;
								},
								{
									link?: string | undefined;
									label?: string | undefined;
								}
							>,
						]
					>
				>;
				next: import("astro/zod").ZodOptional<
					import("astro/zod").ZodUnion<
						[
							import("astro/zod").ZodBoolean,
							import("astro/zod").ZodString,
							import("astro/zod").ZodObject<
								{
									link: import("astro/zod").ZodOptional<
										import("astro/zod").ZodString
									>;
									label: import("astro/zod").ZodOptional<
										import("astro/zod").ZodString
									>;
								},
								"strict",
								import("astro/zod").ZodTypeAny,
								{
									link?: string | undefined;
									label?: string | undefined;
								},
								{
									link?: string | undefined;
									label?: string | undefined;
								}
							>,
						]
					>
				>;
				sidebar: import("astro/zod").ZodDefault<
					import("astro/zod").ZodObject<
						{
							order: import("astro/zod").ZodOptional<
								import("astro/zod").ZodNumber
							>;
							label: import("astro/zod").ZodOptional<
								import("astro/zod").ZodString
							>;
							hidden: import("astro/zod").ZodDefault<
								import("astro/zod").ZodBoolean
							>;
							badge: import("astro/zod").ZodOptional<
								import("astro/zod").ZodEffects<
									import("astro/zod").ZodUnion<
										[
											import("astro/zod").ZodString,
											import("astro/zod").ZodObject<
												{
													variant: import("astro/zod").ZodDefault<
														import("astro/zod").ZodEnum<
															[
																"note",
																"danger",
																"success",
																"caution",
																"tip",
																"default",
															]
														>
													>;
													text: import("astro/zod").ZodString;
													class: import("astro/zod").ZodOptional<
														import("astro/zod").ZodString
													>;
												},
												"strip",
												import("astro/zod").ZodTypeAny,
												{
													variant:
														| "note"
														| "danger"
														| "success"
														| "caution"
														| "tip"
														| "default";
													text: string;
													class?: string | undefined;
												},
												{
													text: string;
													variant?:
														| "note"
														| "danger"
														| "success"
														| "caution"
														| "tip"
														| "default"
														| undefined;
													class?: string | undefined;
												}
											>,
										]
									>,
									{
										variant:
											| "note"
											| "danger"
											| "success"
											| "caution"
											| "tip"
											| "default";
										text: string;
										class?: string | undefined;
									},
									| string
									| {
											text: string;
											variant?:
												| "note"
												| "danger"
												| "success"
												| "caution"
												| "tip"
												| "default"
												| undefined;
											class?: string | undefined;
									  }
								>
							>;
							attrs: import("astro/zod").ZodDefault<
								import("astro/zod").ZodType<
									Omit<
										import("astro/types").HTMLAttributes<"a">,
										keyof import("astro").AstroBuiltinAttributes | "children"
									>,
									import("astro/zod").ZodTypeDef,
									Omit<
										import("astro/types").HTMLAttributes<"a">,
										keyof import("astro").AstroBuiltinAttributes | "children"
									>
								>
							>;
						},
						"strip",
						import("astro/zod").ZodTypeAny,
						{
							hidden: boolean;
							attrs: Omit<
								import("astro/types").HTMLAttributes<"a">,
								keyof import("astro").AstroBuiltinAttributes | "children"
							>;
							label?: string | undefined;
							badge?:
								| {
										variant:
											| "note"
											| "danger"
											| "success"
											| "caution"
											| "tip"
											| "default";
										text: string;
										class?: string | undefined;
								  }
								| undefined;
							order?: number | undefined;
						},
						{
							label?: string | undefined;
							badge?:
								| string
								| {
										text: string;
										variant?:
											| "note"
											| "danger"
											| "success"
											| "caution"
											| "tip"
											| "default"
											| undefined;
										class?: string | undefined;
								  }
								| undefined;
							hidden?: boolean | undefined;
							attrs?:
								| Omit<
										import("astro/types").HTMLAttributes<"a">,
										keyof import("astro").AstroBuiltinAttributes | "children"
								  >
								| undefined;
							order?: number | undefined;
						}
					>
				>;
				banner: import("astro/zod").ZodOptional<
					import("astro/zod").ZodObject<
						{
							content: import("astro/zod").ZodString;
						},
						"strip",
						import("astro/zod").ZodTypeAny,
						{
							content: string;
						},
						{
							content: string;
						}
					>
				>;
				pagefind: import("astro/zod").ZodDefault<
					import("astro/zod").ZodBoolean
				>;
				draft: import("astro/zod").ZodDefault<import("astro/zod").ZodBoolean>;
			},
			"strip",
			import("astro/zod").ZodTypeAny,
			{
				title: string;
				sidebar: {
					hidden: boolean;
					attrs: Omit<
						import("astro/types").HTMLAttributes<"a">,
						keyof import("astro").AstroBuiltinAttributes | "children"
					>;
					label?: string | undefined;
					badge?:
						| {
								variant:
									| "note"
									| "danger"
									| "success"
									| "caution"
									| "tip"
									| "default";
								text: string;
								class?: string | undefined;
						  }
						| undefined;
					order?: number | undefined;
				};
				template: "doc" | "splash";
				head: {
					attrs: Record<string, string | boolean | undefined>;
					tag:
						| "link"
						| "script"
						| "title"
						| "style"
						| "base"
						| "meta"
						| "noscript"
						| "template";
					content: string;
				}[];
				pagefind: boolean;
				editUrl: string | boolean;
				draft: boolean;
				description?: string | undefined;
				tableOfContents?:
					| false
					| {
							minHeadingLevel: number;
							maxHeadingLevel: number;
					  }
					| {
							minHeadingLevel: number;
							maxHeadingLevel: number;
					  }
					| undefined;
				lastUpdated?: boolean | Date | undefined;
				banner?:
					| {
							content: string;
					  }
					| undefined;
				next?:
					| string
					| boolean
					| {
							link?: string | undefined;
							label?: string | undefined;
					  }
					| undefined;
				hero?:
					| {
							actions: {
								link: string;
								variant: "primary" | "secondary" | "minimal";
								text: string;
								attrs?: Record<string, string | number | boolean> | undefined;
								icon?:
									| {
											readonly type: "icon";
											readonly name:
												| "twitter"
												| "mastodon"
												| "github"
												| "gitlab"
												| "bitbucket"
												| "discord"
												| "gitter"
												| "codeberg"
												| "codePen"
												| "youtube"
												| "threads"
												| "linkedin"
												| "twitch"
												| "microsoftTeams"
												| "instagram"
												| "stackOverflow"
												| "x.com"
												| "telegram"
												| "rss"
												| "facebook"
												| "email"
												| "reddit"
												| "patreon"
												| "signal"
												| "slack"
												| "matrix"
												| "openCollective"
												| "hackerOne"
												| "blueSky"
												| "discourse"
												| "zulip"
												| "pinterest"
												| "translate"
												| "document"
												| "error"
												| "comment"
												| "close"
												| "seti:folder"
												| "seti:default"
												| "seti:bsl"
												| "seti:mdo"
												| "seti:salesforce"
												| "seti:asm"
												| "seti:bicep"
												| "seti:bazel"
												| "seti:c"
												| "seti:c-sharp"
												| "seti:html"
												| "seti:cpp"
												| "seti:clojure"
												| "seti:coldfusion"
												| "seti:config"
												| "seti:crystal"
												| "seti:crystal_embedded"
												| "seti:json"
												| "seti:css"
												| "seti:csv"
												| "seti:xls"
												| "seti:cu"
												| "seti:cake"
												| "seti:cake_php"
												| "seti:d"
												| "seti:word"
												| "seti:elixir"
												| "seti:elixir_script"
												| "seti:hex"
												| "seti:elm"
												| "seti:favicon"
												| "seti:f-sharp"
												| "seti:git"
												| "seti:go"
												| "seti:godot"
												| "seti:gradle"
												| "seti:grails"
												| "seti:graphql"
												| "seti:hacklang"
												| "seti:haml"
												| "seti:mustache"
												| "seti:haskell"
												| "seti:haxe"
												| "seti:jade"
												| "seti:java"
												| "seti:javascript"
												| "seti:jinja"
												| "seti:julia"
												| "seti:karma"
												| "seti:kotlin"
												| "seti:dart"
												| "seti:liquid"
												| "seti:livescript"
												| "seti:lua"
												| "seti:markdown"
												| "seti:argdown"
												| "seti:info"
												| "seti:clock"
												| "seti:maven"
												| "seti:nim"
												| "seti:github"
												| "seti:notebook"
												| "seti:nunjucks"
												| "seti:npm"
												| "seti:ocaml"
												| "seti:odata"
												| "seti:perl"
												| "seti:php"
												| "seti:pipeline"
												| "seti:pddl"
												| "seti:plan"
												| "seti:happenings"
												| "seti:powershell"
												| "seti:prisma"
												| "seti:pug"
												| "seti:puppet"
												| "seti:purescript"
												| "seti:python"
												| "seti:react"
												| "seti:rescript"
												| "seti:R"
												| "seti:ruby"
												| "seti:rust"
												| "seti:sass"
												| "seti:spring"
												| "seti:slim"
												| "seti:smarty"
												| "seti:sbt"
												| "seti:scala"
												| "seti:ethereum"
												| "seti:stylus"
												| "seti:svelte"
												| "seti:swift"
												| "seti:db"
												| "seti:terraform"
												| "seti:tex"
												| "seti:twig"
												| "seti:typescript"
												| "seti:tsconfig"
												| "seti:vala"
												| "seti:vue"
												| "seti:wasm"
												| "seti:wat"
												| "seti:xml"
												| "seti:yml"
												| "seti:prolog"
												| "seti:zig"
												| "seti:zip"
												| "seti:wgt"
												| "seti:illustrator"
												| "seti:photoshop"
												| "seti:pdf"
												| "seti:font"
												| "seti:image"
												| "seti:svg"
												| "seti:sublime"
												| "seti:code-search"
												| "seti:shell"
												| "seti:video"
												| "seti:audio"
												| "seti:windows"
												| "seti:jenkins"
												| "seti:babel"
												| "seti:bower"
												| "seti:docker"
												| "seti:code-climate"
												| "seti:eslint"
												| "seti:firebase"
												| "seti:firefox"
												| "seti:gitlab"
												| "seti:grunt"
												| "seti:gulp"
												| "seti:ionic"
												| "seti:platformio"
												| "seti:rollup"
												| "seti:stylelint"
												| "seti:yarn"
												| "seti:webpack"
												| "seti:lock"
												| "seti:license"
												| "seti:makefile"
												| "seti:heroku"
												| "seti:todo"
												| "seti:ignored"
												| "up-caret"
												| "down-caret"
												| "right-caret"
												| "right-arrow"
												| "left-arrow"
												| "bars"
												| "pencil"
												| "pen"
												| "add-document"
												| "setting"
												| "external"
												| "moon"
												| "sun"
												| "laptop"
												| "open-book"
												| "information"
												| "magnifier"
												| "forward-slash"
												| "warning"
												| "approve-check-circle"
												| "approve-check"
												| "rocket"
												| "star"
												| "puzzle"
												| "list-format"
												| "random"
												| "comment-alt"
												| "heart"
												| "farcaster"
												| "astro"
												| "alpine"
												| "pnpm"
												| "biome"
												| "bun"
												| "mdx"
												| "apple"
												| "linux"
												| "homebrew"
												| "nix"
												| "starlight"
												| "pkl"
												| "node"
												| "cloudflare"
												| "vercel"
												| "netlify"
												| "deno";
											readonly html?: undefined;
									  }
									| {
											readonly type: "raw";
											readonly html: string;
											readonly name?: undefined;
									  }
									| undefined;
							}[];
							title?: string | undefined;
							tagline?: string | undefined;
							image?:
								| {
										alt: string;
										file: {
											src: string;
											height: number;
											width: number;
											format:
												| "svg"
												| "png"
												| "jpg"
												| "jpeg"
												| "tiff"
												| "webp"
												| "gif"
												| "avif";
										};
								  }
								| {
										alt: string;
										dark: {
											src: string;
											height: number;
											width: number;
											format:
												| "svg"
												| "png"
												| "jpg"
												| "jpeg"
												| "tiff"
												| "webp"
												| "gif"
												| "avif";
										};
										light: {
											src: string;
											height: number;
											width: number;
											format:
												| "svg"
												| "png"
												| "jpg"
												| "jpeg"
												| "tiff"
												| "webp"
												| "gif"
												| "avif";
										};
								  }
								| {
										html: string;
										alt: string;
								  }
								| undefined;
					  }
					| undefined;
				prev?:
					| string
					| boolean
					| {
							link?: string | undefined;
							label?: string | undefined;
					  }
					| undefined;
			},
			{
				title: string;
				description?: string | undefined;
				tableOfContents?:
					| boolean
					| {
							minHeadingLevel?: number | undefined;
							maxHeadingLevel?: number | undefined;
					  }
					| undefined;
				sidebar?:
					| {
							label?: string | undefined;
							badge?:
								| string
								| {
										text: string;
										variant?:
											| "note"
											| "danger"
											| "success"
											| "caution"
											| "tip"
											| "default"
											| undefined;
										class?: string | undefined;
								  }
								| undefined;
							hidden?: boolean | undefined;
							attrs?:
								| Omit<
										import("astro/types").HTMLAttributes<"a">,
										keyof import("astro").AstroBuiltinAttributes | "children"
								  >
								| undefined;
							order?: number | undefined;
					  }
					| undefined;
				template?: "doc" | "splash" | undefined;
				head?:
					| {
							tag:
								| "link"
								| "script"
								| "title"
								| "style"
								| "base"
								| "meta"
								| "noscript"
								| "template";
							attrs?: Record<string, string | boolean | undefined> | undefined;
							content?: string | undefined;
					  }[]
					| undefined;
				lastUpdated?: boolean | Date | undefined;
				pagefind?: boolean | undefined;
				banner?:
					| {
							content: string;
					  }
					| undefined;
				next?:
					| string
					| boolean
					| {
							link?: string | undefined;
							label?: string | undefined;
					  }
					| undefined;
				editUrl?: string | boolean | undefined;
				hero?:
					| {
							title?: string | undefined;
							tagline?: string | undefined;
							image?:
								| {
										file: {
											src: string;
											height: number;
											width: number;
											format:
												| "svg"
												| "png"
												| "jpg"
												| "jpeg"
												| "tiff"
												| "webp"
												| "gif"
												| "avif";
										};
										alt?: string | undefined;
								  }
								| {
										dark: {
											src: string;
											height: number;
											width: number;
											format:
												| "svg"
												| "png"
												| "jpg"
												| "jpeg"
												| "tiff"
												| "webp"
												| "gif"
												| "avif";
										};
										light: {
											src: string;
											height: number;
											width: number;
											format:
												| "svg"
												| "png"
												| "jpg"
												| "jpeg"
												| "tiff"
												| "webp"
												| "gif"
												| "avif";
										};
										alt?: string | undefined;
								  }
								| {
										html: string;
								  }
								| undefined;
							actions?:
								| {
										link: string;
										text: string;
										variant?: "primary" | "secondary" | "minimal" | undefined;
										attrs?:
											| Record<string, string | number | boolean>
											| undefined;
										icon?: string | undefined;
								  }[]
								| undefined;
					  }
					| undefined;
				prev?:
					| string
					| boolean
					| {
							link?: string | undefined;
							label?: string | undefined;
					  }
					| undefined;
				draft?: boolean | undefined;
			}
		>
	>;
};

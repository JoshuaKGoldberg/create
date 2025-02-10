import { Octokit } from "octokit";

import { SystemFetchers } from "../types/system.js";

export interface SystemFetchersSettings {
	auth?: string;
	fetch?: typeof fetch;
}

export function createSystemFetchers({
	auth,
	fetch = globalThis.fetch,
}: SystemFetchersSettings): SystemFetchers {
	return {
		fetch,
		octokit: new Octokit({
			auth,
			request: { fetch },
		}),
	};
}

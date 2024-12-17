import { Octokit } from "octokit";

import { SystemFetchers } from "../types/system.js";

export function createSystemFetchers(fetch = globalThis.fetch): SystemFetchers {
	return {
		fetch,
		octokit: new Octokit(),
	};
}

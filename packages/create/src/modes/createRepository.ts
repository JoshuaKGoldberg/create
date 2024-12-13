import { RepositoryTemplate } from "../types/bases.js";
import { SystemRunner } from "../types/system.js";
import { createRepositoryOnGitHub } from "./createRepositoryOnGitHub.js";
import { createTrackingBranches } from "./createTrackingBranches.js";
import { getGitHub } from "./getGitHub.js";
import { CreationOptions } from "./types.js";

export async function createRepository(
	options: CreationOptions,
	runner: SystemRunner,
	template?: RepositoryTemplate,
) {
	const octokit = await getGitHub();

	await createRepositoryOnGitHub(octokit, options, runner, template);
	await createTrackingBranches(options, runner);
}

import { Octokit } from "octokit";

import { RepositoryTemplate } from "../types/bases.js";
import { SystemRunner } from "../types/system.js";
import { clearLocalGitTags } from "./clearLocalGitTags.js";
import { CreationOptions } from "./types.js";

export async function createRepositoryOnGitHub(
	octokit: Octokit,
	{ owner, repository }: CreationOptions,
	runner: SystemRunner,
	template?: RepositoryTemplate,
) {
	if (template) {
		await octokit.rest.repos.createUsingTemplate({
			name: repository,
			owner,
			template_owner: template.owner,
			template_repo: template.repository,
		});
		await clearLocalGitTags(runner);
		return;
	}

	const currentUser = await octokit.rest.users.getAuthenticated();

	if (currentUser.data.login === owner) {
		await octokit.rest.repos.createForAuthenticatedUser({
			name: repository,
		});
	} else {
		await octokit.rest.repos.createInOrg({
			name: repository,
			org: owner,
		});
	}
}

import { Octokit } from "octokit";

import { RepositoryTemplate } from "../types/bases.js";
import { CreationOptions } from "./types.js";

export async function createRepositoryOnGitHub(
	{ owner, repository }: CreationOptions,
	octokit: Octokit,
	template?: RepositoryTemplate,
) {
	if (template) {
		await octokit.rest.repos.createUsingTemplate({
			name: repository,
			owner,
			template_owner: template.owner,
			template_repo: template.repository,
		});
	} else {
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
}

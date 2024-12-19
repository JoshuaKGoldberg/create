import { RepositoryTemplate } from "../types/bases.js";
import { SystemContext } from "../types/system.js";
import { CreationOptions } from "./types.js";

export async function createRepositoryOnGitHub(
	{ owner, repository }: CreationOptions,
	system: SystemContext,
	template?: RepositoryTemplate,
) {
	if (template) {
		await system.fetchers.octokit.rest.repos.createUsingTemplate({
			name: repository,
			owner,
			template_owner: template.owner,
			template_repo: template.repository,
		});
	} else {
		const currentUser =
			await system.fetchers.octokit.rest.users.getAuthenticated();

		if (currentUser.data.login === owner) {
			await system.fetchers.octokit.rest.repos.createForAuthenticatedUser({
				name: repository,
			});
		} else {
			await system.fetchers.octokit.rest.repos.createInOrg({
				name: repository,
				org: owner,
			});
		}
	}
}

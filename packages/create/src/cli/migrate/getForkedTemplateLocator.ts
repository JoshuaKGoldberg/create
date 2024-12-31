import hostedGitInfo from "hosted-git-info";
import { readPackage } from "read-pkg";

import { RepositoryTemplate } from "../../types/bases.js";

export async function getForkedTemplateLocator(
	directory: string,
	template: RepositoryTemplate,
) {
	const { repository } = await readPackage({ cwd: directory });
	if (!repository?.url) {
		return undefined;
	}

	// eslint-disable-next-line @typescript-eslint/await-thenable
	const gitInfo = await hostedGitInfo.fromUrl(repository.url);

	if (
		gitInfo?.user !== template.owner ||
		gitInfo.project !== template.repository
	) {
		return undefined;
	}

	return `${template.owner}/${template.repository}`;
}

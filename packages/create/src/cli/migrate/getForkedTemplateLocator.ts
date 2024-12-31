import hostedGitInfo from "hosted-git-info";
import { readPackage } from "read-pkg";

import { RepositoryTemplate } from "../../types/bases.js";
import { swallowAsync } from "../utils.js";

export async function getForkedTemplateLocator(
	directory: string,
	template: RepositoryTemplate,
) {
	const packageData = await swallowAsync(readPackage({ cwd: directory }));
	if (!packageData?.repository?.url) {
		return undefined;
	}

	const gitInfo = hostedGitInfo.fromUrl(packageData.repository.url);

	if (
		gitInfo?.user !== template.owner ||
		gitInfo.project !== template.repository
	) {
		return undefined;
	}

	return `${template.owner}/${template.repository}`;
}

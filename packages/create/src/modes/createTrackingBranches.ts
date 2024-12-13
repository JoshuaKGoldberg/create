import { SystemRunner } from "../types/system.js";
import { CreationOptions } from "./types.js";

export async function createTrackingBranches(
	{ owner, repository }: CreationOptions,
	runner: SystemRunner,
) {
	for (const command of [
		`git remote add origin https://github.com/${owner}/${repository}`,
		`git add -A`,
		`git commit --message "feat:\\ initialized\\ repo\\ ✨" --no-gpg-sign`,
		`git push -u origin main --force`,
	]) {
		await runner(command);
	}
}

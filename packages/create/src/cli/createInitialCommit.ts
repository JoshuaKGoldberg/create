import { SystemRunner } from "../types/system.js";

export async function createInitialCommit(
	runner: SystemRunner,
	amend?: boolean,
) {
	for (const command of [
		`git add -A`,
		`git commit --message feat:\\ initialized\\ repo\\ ✨ ${amend ? "--amend " : ""}--no-gpg-sign`,
		`git push -u origin main --force`,
	]) {
		await runner(command);
	}
}

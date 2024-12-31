import { SystemRunner } from "../../types/system.js";
import { CreationOptions } from "./assertOptionsForInitialize.js";

export async function createTrackingBranches(
	{ owner, repository }: CreationOptions,
	runner: SystemRunner,
) {
	for (const command of [
		`git init`,
		`git remote add origin https://github.com/${owner}/${repository}`,
	]) {
		await runner(command);
	}
}

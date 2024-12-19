import { getGitHubAuthToken } from "get-github-auth-token";

import {
	createSystemContext,
	SystemContextSettings,
} from "./createSystemContext.js";

export async function createSystemContextWithAuth(
	settings: SystemContextSettings,
) {
	const authToken = settings.auth ? undefined : await getGitHubAuthToken();
	const auth = authToken?.succeeded ? authToken.token : settings.auth;

	return createSystemContext({ ...settings, auth });
}

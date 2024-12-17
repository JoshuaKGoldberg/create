import { CreatedRequest } from "../types/creations.js";
import { SystemFetchers } from "../types/system.js";

export async function applyRequestsToSystem(
	requests: CreatedRequest[],
	fetchers: SystemFetchers,
) {
	await Promise.all(
		requests.map(async (request) => {
			await request.send(fetchers);
		}),
	);
}

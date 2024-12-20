import { logError } from "../cli/loggers/logError.js";
import { CreatedRequest } from "../types/creations.js";
import { SystemFetchers } from "../types/system.js";

export async function applyRequestsToSystem(
	requests: CreatedRequest[],
	fetchers: SystemFetchers,
) {
	await Promise.all(
		requests.map(async (request) => {
			try {
				await request.send(fetchers);
			} catch (error) {
				logError(`Error sending ${request.id}:`, error);
			}
		}),
	);
}

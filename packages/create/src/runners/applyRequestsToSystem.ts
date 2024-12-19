import { CreatedRequest } from "../types/creations.js";
import { SystemFetchers } from "../types/system.js";

export async function applyRequestsToSystem(
	requests: CreatedRequest[],
	fetchers: SystemFetchers,
) {
	await Promise.all(
		requests.map(async (request) => {
			try {
				// TODO: Handle in-progress outputs better, in some way?
				console.log("Running request:", request.id);
				await request.send(fetchers);
				console.log("Done with request:", request.id);
			} catch (error) {
				// TODO: Handle errors better, in some way?
				console.error("Error in request:", error);
			}
		}),
	);
}

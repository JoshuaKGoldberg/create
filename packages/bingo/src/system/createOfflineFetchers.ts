import { SystemFetchers } from "../types/system.js";
import { createSystemFetchers } from "./createSystemFetchers.js";

export function createOfflineFetchers(): SystemFetchers {
	return createSystemFetchers({
		fetch: () =>
			Promise.reject(
				new Error(
					"Offline specified. This request should be caught by its Input.",
				),
			),
	});
}

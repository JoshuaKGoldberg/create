import { SystemDisplay } from "./types.js";

export function createSystemDisplay(): SystemDisplay {
	return {
		item: (group, id, item) => {
			if (item.error) {
				console.error("Error in", group, id, item.error);
			}
		},
		log: (message) => {
			console.log(message);
		},
	};
}

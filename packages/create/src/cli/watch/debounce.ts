export function debounce<Args extends unknown[]>(
	callback: (...args: Args) => Promise<void>,
) {
	let requested = false;

	return async (...args: Args) => {
		if (requested) {
			return;
		}

		requested = true;

		try {
			await callback(...args);
		} finally {
			requested = false;
		}
	};
}

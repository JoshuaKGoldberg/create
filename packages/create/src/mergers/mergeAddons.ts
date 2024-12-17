import { BlockWithAddons } from "../types/blocks.js";
import { CreatedBlockAddons } from "../types/creations.js";

export function mergeAddons<Options extends object | unknown[]>(
	first: CreatedBlockAddons<object, Options>[],
	second: CreatedBlockAddons<object, Options>[],
): CreatedBlockAddons<object, Options>[] {
	const byBlock = new Map<
		BlockWithAddons<object, Options>,
		object | unknown[]
	>();

	for (const { addons, block } of [...first, ...second]) {
		const merged = mergeBlockAddons(byBlock.get(block), addons);

		if (isNotNullish(merged)) {
			byBlock.set(block, merged);
		}
	}

	return Array.from(byBlock).map(([block, addons]) => ({ addons, block }));
}

function isNotNullish(value: unknown) {
	return value != null;
}

function mergeBlockAddonArrays(firsts: unknown[], seconds: unknown[]) {
	const firstNonNullish = firsts.filter(isNotNullish);
	const secondNonNullish = seconds.filter(isNotNullish);

	return mergeBlockAddonArraysNonNullish(firstNonNullish, secondNonNullish);
}

function mergeBlockAddonArraysNonNullish(
	firsts: unknown[],
	seconds: unknown[],
) {
	const results: unknown[] = [];
	const sharedLength = Math.min(firsts.length, seconds.length);

	for (let i = 0; i < sharedLength; i += 1) {
		const first = firsts[i];
		const second = seconds[i];

		if (first === second) {
			results.push(first);
		} else {
			results.push(first, second);
		}
	}

	for (let i = seconds.length; i < firsts.length; i += 1) {
		results.push(firsts[i]);
	}

	for (let i = firsts.length; i < seconds.length; i += 1) {
		results.push(seconds[i]);
	}

	return Array.from(new Set(results));
}

function mergeBlockAddons(first: unknown, second: unknown) {
	if (Array.isArray(first) && Array.isArray(second)) {
		return mergeBlockAddonArrays(first, second);
	}

	return first ?? second;
}

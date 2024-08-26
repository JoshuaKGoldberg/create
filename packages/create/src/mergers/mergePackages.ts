import * as semver from "semver";

import { CreatedPackages, CreatedPackagesWithVersions } from "../shared";
import { removeEmptyEntries } from "./removeEmptyEntries";

export function mergePackages(
	first: CreatedPackages | undefined,
	second: CreatedPackages | undefined,
) {
	if (!first) {
		return second;
	}

	if (!second) {
		return first;
	}

	const result: CreatedPackages = {};

	for (const key of [
		"dependencies",
		"devDependencies",
		"peerDependencies",
	] as const) {
		result[key] = mergePackageEntries(result, key, first[key], second[key]);
	}

	return removeEmptyEntries(result);
}

function mergePackageEntries(
	result: CreatedPackages,
	key: "dependencies" | "devDependencies" | "peerDependencies",
	first: CreatedPackagesWithVersions | undefined,
	second: CreatedPackagesWithVersions | undefined,
) {
	if (!first) {
		return second;
	}

	if (!second) {
		return first;
	}

	const entries: CreatedPackagesWithVersions = {};

	for (const packageName in first) {
		if (!(packageName in second)) {
			entries[packageName] = first[packageName];
			continue;
		}

		if (!semver.intersects(first[packageName], second[packageName])) {
			throw new Error(
				`Conflicting ${key} entries for ${packageName}: ${first[packageName]} vs. ${second[packageName]}.`,
			);
		}

		// TODO: Find a way to simplify to highest?
		entries[packageName] = `${first[packageName]} || ${second[packageName]}`;
	}

	return entries;
}

import * as semver from "semver";

import {
	CreatedPackage,
	CreatedPackageScripts,
	CreatedPackagesWithVersions,
} from "../types/creations.js";
import { removeEmptyEntries } from "./removeEmptyEntries.js";

export function mergePackage(
	first: CreatedPackage,
	second: CreatedPackage | undefined,
) {
	if (!second) {
		return first;
	}

	const result: CreatedPackage = {};

	for (const key of [
		"dependencies",
		"devDependencies",
		"peerDependencies",
	] as const) {
		result[key] = mergeDependencyEntries(key, first[key], second[key]);
	}

	result.scripts = mergeScripts(first.scripts, second.scripts);

	return removeEmptyEntries(result);
}

function mergeDependencyEntries(
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

function mergeScripts(
	first: CreatedPackageScripts | undefined,
	second: CreatedPackageScripts | undefined,
) {
	if (!first) {
		return second;
	}

	if (!second) {
		return first;
	}

	const scripts: CreatedPackageScripts = {};

	for (const scriptKey in first) {
		if (!(scriptKey in first)) {
			scripts[scriptKey] = second[scriptKey];
			continue;
		}

		if (!(scriptKey in second)) {
			scripts[scriptKey] = first[scriptKey];
			continue;
		}

		if (first[scriptKey] !== second[scriptKey]) {
			throw new Error(
				`Conflicting ${scriptKey} scripts: ${first[scriptKey]} vs. ${second[scriptKey]}.`,
			);
		}
	}

	return scripts;
}

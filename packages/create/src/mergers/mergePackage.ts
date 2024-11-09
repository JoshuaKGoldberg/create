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

	const result: CreatedPackage = {
		...first,
		...second,
	};

	for (const key of new Set([...Object.keys(first), ...Object.keys(second)])) {
		switch (key) {
			case "dependencies":
			case "devDependencies":
			case "peerDependencies":
				result[key] = mergeDependencyEntries(key, first[key], second[key]);
				break;

			case "scripts":
				result.scripts = mergeScripts(first.scripts, second.scripts);
				break;

			default:
				result[key] = mergeArbitraryEntry(key, first[key], second[key]);
				break;
		}
	}

	return removeEmptyEntries(result);
}

function mergeArbitraryEntry(key: string, first: unknown, second: unknown) {
	if (first === undefined || second === undefined || first === second) {
		return first ?? second;
	}

	// TODO: use deep equality checking
	if (JSON.stringify(first) !== JSON.stringify(second)) {
		throw new Error(
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			`Conflicting ${key} entries for ${key}: ${first} vs. ${second}.`,
		);
	}

	return first;
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
		if (
			!(packageName in second) ||
			(first[packageName] === "latest" && second[packageName] === "latest")
		) {
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

	for (const packageName in second) {
		entries[packageName] = second[packageName];
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
		if (scriptKey in second && first[scriptKey] !== second[scriptKey]) {
			throw new Error(
				// eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
				`Conflicting ${scriptKey} scripts: ${first[scriptKey]} vs. ${second[scriptKey]}.`,
			);
		}

		scripts[scriptKey] = first[scriptKey];
	}

	for (const scriptKey in second) {
		if (!(scriptKey in first)) {
			scripts[scriptKey] = second[scriptKey];
		}
	}

	return scripts;
}

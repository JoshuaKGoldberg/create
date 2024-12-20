import { createRequire } from "node:module";

const require = createRequire(import.meta.dirname);

export function tryRequire(id: string) {
	try {
		return require(id) as unknown;
	} catch {
		return undefined;
	}
}

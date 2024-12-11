import { z } from "zod";

import { AnyOptionalShape, InferredObject } from "../options.js";

export function applyZodDefaults<Shape extends AnyOptionalShape>(
	shape: Shape,
	value: InferredObject<Shape> | undefined,
): InferredObject<Shape> {
	return z.object(shape).parse(value ?? {}) as InferredObject<Shape>;
}

export function isDefinitionWithAddons(definition: object) {
	return "addons" in definition;
}

export function isDefinitionWithArgs(definition: object) {
	return "args" in definition;
}

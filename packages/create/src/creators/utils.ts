export function isDefinitionWithArgs(definition: object) {
	return "args" in definition;
}

export function isDefinitionWithOptions(definition: object) {
	return "options" in definition;
}

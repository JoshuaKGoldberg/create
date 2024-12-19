import * as fs from "node:fs";
import { z } from "zod";

export function validateBlankDirectory(value: string) {
	if (fs.existsSync(value)) {
		return `That directory already exists. Please choose another one.`;
	}

	return validateText(value);
}

export function validateNumber(value: string) {
	if (isNaN(parseFloat(value))) {
		return "Please enter a numeric value.";
	}
}

export function validateText(value: string) {
	if (!value) {
		return "Please enter a value.";
	}
}

export function validatorFromSchema(schema: z.ZodTypeAny) {
	return (value: string) => {
		return schema.safeParse(value).error?.message ?? validateText(value);
	};
}

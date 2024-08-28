import { z } from "zod";

export type AnyOptionsSchema = z.ZodRawShape;

export type InferredSchema<OptionsSchema extends AnyOptionsSchema | undefined> =
	OptionsSchema extends AnyOptionsSchema
		? z.infer<z.ZodObject<OptionsSchema>>
		: undefined;

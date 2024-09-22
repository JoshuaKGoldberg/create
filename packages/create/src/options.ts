import { z } from "zod";

export type AnyShape = z.ZodRawShape;

export type AnyOptionalShape = Record<string, z.ZodOptional<z.ZodTypeAny>>;

export type InferredObject<OptionsShape extends AnyShape | undefined> =
	OptionsShape extends AnyShape
		? z.infer<z.ZodObject<OptionsShape>>
		: undefined;

export type InputShape<OptionsShape extends AnyShape> = z.input<
	z.ZodObject<OptionsShape>
>;

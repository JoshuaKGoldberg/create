import { AnyShape, InferredObject } from "../options.js";
import { createNativeSystems } from "../system/createNativeSystems.js";
import { LazyOptionalOptions, Schema } from "../types/schemas.js";
import { NativeSystem } from "../types/system.js";
import {
	AwaitedLazyProperties,
	awaitLazyProperties,
} from "../utils/awaitLazyProperties.js";

export interface SchemaProductionSettings<OptionsShape extends AnyShape>
	extends Partial<NativeSystem> {
	options?: Partial<InferredObject<OptionsShape>>;
}

export type SchemaProduction<OptionsShape extends AnyShape> =
	AwaitedLazyProperties<LazyOptionalOptions<InferredObject<OptionsShape>>>;

export async function produceSchema<OptionsShape extends AnyShape>(
	schema: Schema<OptionsShape>,
	settings: SchemaProductionSettings<OptionsShape>,
): Promise<Partial<SchemaProduction<OptionsShape>> | undefined> {
	if (!schema.produce) {
		return settings.options;
	}

	const { system, take } = createNativeSystems(settings);

	return await awaitLazyProperties(
		schema.produce({
			options: settings.options ?? {},
			...system,
			take,
		}),
	);
}

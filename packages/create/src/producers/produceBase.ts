import { AnyShape, InferredObject } from "../options.js";
import { createSystemContextWithAuth } from "../system/createSystemContextWithAuth.js";
import { Base, LazyOptionalOptions } from "../types/bases.js";
import { NativeSystem } from "../types/system.js";
import {
	AwaitedLazyProperties,
	awaitLazyProperties,
} from "../utils/awaitLazyProperties.js";

export type BaseProduction<OptionsShape extends AnyShape> =
	AwaitedLazyProperties<LazyOptionalOptions<InferredObject<OptionsShape>>>;

export interface BaseProductionSettings<OptionsShape extends AnyShape>
	extends Partial<NativeSystem> {
	directory?: string;
	options?: Partial<InferredObject<OptionsShape>>;
}

export async function produceBase<OptionsShape extends AnyShape>(
	base: Base<OptionsShape>,
	settings: BaseProductionSettings<OptionsShape> = {},
): Promise<Partial<BaseProduction<OptionsShape>>> {
	if (!base.produce) {
		return settings.options ?? {};
	}

	const system = await createSystemContextWithAuth({
		directory: settings.directory ?? ".",
		...settings,
	});

	return await awaitLazyProperties(
		base.produce({
			options: settings.options ?? {},
			...system,
		}),
	);
}

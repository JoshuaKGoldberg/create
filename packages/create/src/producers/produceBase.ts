import { AnyShape, InferredObject } from "../options.js";
import { createSystemContext } from "../system/createNativeSystems.js";
import { Base, LazyOptionalOptions } from "../types/bases.js";
import { NativeSystem } from "../types/system.js";
import {
	AwaitedLazyProperties,
	awaitLazyProperties,
} from "../utils/awaitLazyProperties.js";

export interface BaseProductionSettings<OptionsShape extends AnyShape>
	extends Partial<NativeSystem> {
	options?: Partial<InferredObject<OptionsShape>>;
}

export type BaseProduction<OptionsShape extends AnyShape> =
	AwaitedLazyProperties<LazyOptionalOptions<InferredObject<OptionsShape>>>;

export async function produceBase<OptionsShape extends AnyShape>(
	base: Base<OptionsShape>,
	settings: BaseProductionSettings<OptionsShape>,
): Promise<Partial<BaseProduction<OptionsShape>> | undefined> {
	if (!base.produce) {
		return settings.options;
	}

	return await awaitLazyProperties(
		base.produce({
			options: settings.options ?? {},
			...createSystemContext(settings),
		}),
	);
}

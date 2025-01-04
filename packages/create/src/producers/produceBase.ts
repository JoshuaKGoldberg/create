import { AnyShape, InferredObject } from "../options.js";
import { createSystemContextWithAuth } from "../system/createSystemContextWithAuth.js";
import { Base } from "../types/bases.js";
import { NativeSystem } from "../types/system.js";
import { awaitLazyProperties } from "../utils/awaitLazyProperties.js";

export interface ProduceBaseSettings<OptionsShape extends AnyShape>
	extends Partial<NativeSystem> {
	directory?: string;
	offline?: boolean;
	options?: Partial<InferredObject<OptionsShape>>;
}

export async function produceBase<OptionsShape extends AnyShape>(
	base: Base<OptionsShape>,
	settings: ProduceBaseSettings<OptionsShape> = {},
): Promise<Partial<InferredObject<OptionsShape>>> {
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

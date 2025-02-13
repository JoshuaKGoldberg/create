import {
	AnyShape,
	awaitLazyProperties,
	createSystemContextWithAuth,
	InferredObject,
} from "bingo";
import { BingoSystem } from "bingo-systems";

import { Base } from "../types/bases.js";

export interface ProduceBaseSettings<OptionsShape extends AnyShape>
	extends Partial<BingoSystem> {
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

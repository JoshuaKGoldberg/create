import { TakeInput } from "../types/inputs.js";
import { NativeSystem } from "../types/system.js";

export function createTakeInput(system: NativeSystem): TakeInput {
	return (input, args) =>
		input({ args, ...system } as Parameters<TakeInput>[0]);
}

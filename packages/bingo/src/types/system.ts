import { NativeSystem, SystemDisplay } from "bingo-systems";

import { TakeInput } from "./inputs.js";

export interface SystemContext extends NativeSystem {
	directory: string;
	display: SystemDisplay;
	take: TakeInput;
}

import {
	AnyShape,
	InferredObject,
	Template,
	TemplateAbout,
	TemplatePrepare,
} from "bingo";

import { Base } from "./bases.js";
import { Preset } from "./presets.js";

export interface StratumTemplate<OptionsShape extends AnyShape = AnyShape>
	extends Template<OptionsShape> {
	base: Base<OptionsShape>;
}

export interface StratumTemplateDefinition<
	OptionsShape extends AnyShape = AnyShape,
> {
	about?: TemplateAbout;
	options?: OptionsShape;
	prepare?: TemplatePrepare<InferredObject<OptionsShape>>;
	presets: Preset<OptionsShape>[];
	suggested?: Preset<OptionsShape>;
}

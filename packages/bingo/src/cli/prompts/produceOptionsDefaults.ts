import { SystemContext } from "../../types/system.js";
import { TemplatePrepare } from "../../types/templates.js";
import { awaitLazyProperties } from "../../utils/awaitLazyProperties.js";

export interface ProduceOptionsDefaultsSettings<Options extends object>
	extends SystemContext {
	existing: Partial<Options>;
	offline?: boolean;
}

export async function produceOptionsDefaults<Options extends object>(
	optionsDefaults: TemplatePrepare<Options> | undefined,
	settings: ProduceOptionsDefaultsSettings<Options>,
) {
	return (
		optionsDefaults &&
		(await awaitLazyProperties(
			optionsDefaults({
				options: settings.existing,
				...settings,
			}),
		))
	);
}

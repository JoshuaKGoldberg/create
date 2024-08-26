import readline from "node:readline/promises";

export async function promptForBoolean(rl: readline.Interface, query: string) {
	return (await rl.question(query)).toLowerCase() === "y";
}

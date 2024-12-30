export function isLocalPath(from: string) {
	return [".", "/", "~"].includes(from[0]);
}

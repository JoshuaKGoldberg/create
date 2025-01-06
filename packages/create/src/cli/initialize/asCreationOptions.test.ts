import { describe, expect, it } from "vitest";

import { asCreationOptions } from "./asCreationOptions.js";

const owner = "TestOwner";
const repository = "test-repository";

describe("asCreationOptions", () => {
	it("throws an error when the options are missing owner", () => {
		const options = { repository };

		expect(() => {
			asCreationOptions(options);
		}).toThrowError(
			`To run with --mode initialize, the Template must have a --owner Option of type string.`,
		);
	});

	it("throws an error when the options have an invalid owner", () => {
		const options = { owner: 123, repository };

		expect(() => {
			asCreationOptions(options);
		}).toThrowError(
			`To run with --mode initialize, the Template must have a --owner Option of type string.`,
		);
	});

	it("throws an error when the options are missing repository", () => {
		const options = { owner };

		expect(() => {
			asCreationOptions(options);
		}).toThrowError(
			`To run with --mode initialize, the Template must have a --repository Option of type string.`,
		);
	});

	it("throws an error when the options have an invalid repository", () => {
		const options = { owner, repository: 123 };

		expect(() => {
			asCreationOptions(options);
		}).toThrowError(
			`To run with --mode initialize, the Template must have a --repository Option of type string.`,
		);
	});

	it("does not throw an error when the options have owner and repository", () => {
		const options = { owner, repository };

		expect(asCreationOptions(options)).toBe(options);
	});
});

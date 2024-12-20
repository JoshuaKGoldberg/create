import { describe, expect, it } from "vitest";

import { assertOptionsForInitialize } from "./assertOptionsForInitialize.js";

const owner = "TestOwner";
const repository = "test-repository";

describe("assertOptionsForInitialize", () => {
	it("throws an error when the options are missing owner", () => {
		const options = { repository };

		expect(() => {
			assertOptionsForInitialize(options);
		}).toThrowError(
			`To run with --mode initialize, the Template must have a --owner Option of type string.`,
		);
	});

	it("throws an error when the options have an invalid owner", () => {
		const options = { owner: 123, repository };

		expect(() => {
			assertOptionsForInitialize(options);
		}).toThrowError(
			`To run with --mode initialize, the Template must have a --owner Option of type string.`,
		);
	});

	it("throws an error when the options are missing repository", () => {
		const options = { owner };

		expect(() => {
			assertOptionsForInitialize(options);
		}).toThrowError(
			`To run with --mode initialize, the Template must have a --repository Option of type string.`,
		);
	});

	it("throws an error when the options have an invalid repository", () => {
		const options = { owner, repository: 123 };

		expect(() => {
			assertOptionsForInitialize(options);
		}).toThrowError(
			`To run with --mode initialize, the Template must have a --repository Option of type string.`,
		);
	});

	it("does not throw an error when the options have owner and repository", () => {
		const options = { owner, repository };

		expect(() => {
			assertOptionsForInitialize(options);
		}).not.toThrow();
	});
});

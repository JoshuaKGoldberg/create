import { describe, expect, it, vi } from "vitest";

import { createRepositoryOnGitHub } from "./createRepositoryOnGitHub.js";

const mockCreateUsingTemplate = vi.fn();
const mockCreateInOrg = vi.fn();
const mockCreateForAuthenticatedUser = vi.fn();
const mockGetAuthenticated = vi.fn();

vi.mock("./getGitHub.js", () => ({
	getGitHub: () => ({
		rest: {
			repos: {
				createForAuthenticatedUser: mockCreateForAuthenticatedUser,
				createInOrg: mockCreateInOrg,
				createUsingTemplate: mockCreateUsingTemplate,
			},
			users: {
				getAuthenticated: mockGetAuthenticated,
			},
		},
	}),
}));

const mockClearLocalGitTags = vi.fn();

vi.mock("./clearLocalGitTags", () => ({
	get clearLocalGitTags() {
		return mockClearLocalGitTags;
	},
}));

const owner = "StubOwner";
const repository = "stub-repository";

const template = {
	owner: "JoshuaKGoldberg",
	repository: "create-typescript-app",
};

describe("createRepositoryOnGitHub", () => {
	it("creates using a template when a template is provided", async () => {
		await createRepositoryOnGitHub({ owner, repository }, vi.fn(), template);

		expect(mockCreateForAuthenticatedUser).not.toHaveBeenCalled();
		expect(mockCreateInOrg).not.toHaveBeenCalled();
		expect(mockCreateUsingTemplate).toHaveBeenCalledWith({
			name: repository,
			owner,
			template_owner: template.owner,
			template_repo: template.repository,
		});
		expect(mockClearLocalGitTags).toHaveBeenCalledOnce();
	});

	it("creates under the user when the user is the owner", async () => {
		mockGetAuthenticated.mockResolvedValueOnce({
			data: {
				login: owner,
			},
		});
		await createRepositoryOnGitHub({ owner, repository }, vi.fn());

		expect(mockCreateForAuthenticatedUser).toHaveBeenCalledWith({
			name: repository,
		});
		expect(mockCreateInOrg).not.toHaveBeenCalled();
		expect(mockCreateUsingTemplate).not.toHaveBeenCalled();
		expect(mockClearLocalGitTags).not.toHaveBeenCalled();
	});

	it("creates under an org when the user is not the owner", async () => {
		const login = "other-user";
		mockGetAuthenticated.mockResolvedValueOnce({ data: { login } });
		await createRepositoryOnGitHub({ owner, repository }, vi.fn());

		expect(mockCreateForAuthenticatedUser).not.toHaveBeenCalled();
		expect(mockCreateInOrg).toHaveBeenCalledWith({
			name: repository,
			org: owner,
		});
		expect(mockCreateUsingTemplate).not.toHaveBeenCalled();
		expect(mockClearLocalGitTags).not.toHaveBeenCalled();
	});
});

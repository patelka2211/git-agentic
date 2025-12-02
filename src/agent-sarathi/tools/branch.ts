import { tool } from "langchain";
import z from "zod";
import { git } from "../utils/git";
import { validateBranchName } from "../utils/validators";

export default [
	tool(
		async ({ includeRemote }) => {
			try {
				const branches = await git.branch(includeRemote ? ["-a"] : []);
				return JSON.stringify(
					{
						current: branches.current,
						all: branches.all,
						branches: branches.branches,
					},
					null,
					2,
				);
			} catch {
				return "There was an error while listing branches.";
			}
		},
		{
			name: "list_branches",
			description: "List all local and remote branches in the repository.",
			schema: z.object({
				includeRemote: z
					.boolean()
					.default(true)
					.describe("Whether to include remote branches"),
			}),
		},
	),

	tool(
		async ({ branchName, checkout, startPoint }) => {
			try {
				const valid = validateBranchName(branchName);

				if (!valid) {
					return `${branchName} is not a valid branch name`;
				}

				const args = [branchName];
				if (startPoint) {
					args.push(startPoint);
				}

				await git.branch(args);

				if (checkout) {
					await git.checkout(branchName);
					return `Branch '${branchName}' created and checked out successfully.`;
				}

				return `Branch '${branchName}' created successfully.`;
			} catch {
				return "There was an error while creating branch.";
			}
		},
		{
			name: "create_branch",
			description:
				"Create a new Git branch. Optionally checkout the new branch immediately.",
			schema: z.object({
				branchName: z.string().describe("Name of the new branch to create"),
				checkout: z
					.boolean()
					.default(false)
					.describe("Whether to checkout the new branch after creation"),
				startPoint: z
					.string()
					.optional()
					.describe(
						"Starting point for the new branch (commit SHA or branch name)",
					),
			}),
		},
	),

	tool(
		async ({ target, createIfNotExists }) => {
			try {
				const args = createIfNotExists ? ["-b", target] : [target];
				await git.checkout(args);
				return `Successfully checked out '${target}'.`;
			} catch {
				return "There was an error while checkout branch.";
			}
		},
		{
			name: "checkout_branch",
			description:
				"Switch to a different branch or checkout a specific commit.",
			schema: z.object({
				target: z.string().describe("Branch name or commit SHA to checkout"),
				createIfNotExists: z
					.boolean()
					.default(false)
					.describe("Create the branch if it does not exist"),
			}),
		},
	),

	tool(
		async ({ branchName, force }) => {
			try {
				const valid = validateBranchName(branchName);

				if (!valid) {
					return `${branchName} is not a valid branch name`;
				}

				const flag = force ? "-D" : "-d";
				await git.branch([flag, branchName]);
				return `Branch '${branchName}' deleted successfully.`;
			} catch {
				return "There was an error deleting a branch.";
			}
		},
		{
			name: "delete_branch",
			description: "Delete a Git branch. This is a destructive operation.",
			schema: z.object({
				branchName: z.string().describe("Name of the branch to delete"),
				force: z
					.boolean()
					.default(false)
					.describe("Force delete even if not fully merged"),
			}),
		},
	),
];

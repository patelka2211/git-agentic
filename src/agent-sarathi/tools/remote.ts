import { tool } from "langchain";
import z from "zod";
import { git } from "../utils/git";
import { validateRemoteName } from "../utils/validators";

export default [
	tool(
		async ({ remote, branch, force, setUpstream }) => {
			try {
				const valid = validateRemoteName(remote);

				if (!valid) {
					return `${remote} is not a valid remote`;
				}

				const options: any = {};

				if (force) {
					options["--force"] = null;
				}
				if (setUpstream) {
					options["--set-upstream"] = null;
				}

				await git.push(remote, branch, options);
				return `Successfully pushed to ${remote}${branch ? `/${branch}` : ""}.`;
			} catch {
				return "There was an error while pushing changes to the remote.";
			}
		},
		{
			name: "push_to_remote",
			description: "Push commits to a remote repository.",
			schema: z.object({
				remote: z.string().default("origin").describe("Remote name"),
				branch: z
					.string()
					.optional()
					.describe(
						"Branch name to push. If not provided, pushes current branch",
					),
				force: z
					.boolean()
					.default(false)
					.describe("Force push (destructive operation)"),
				setUpstream: z
					.boolean()
					.default(false)
					.describe("Set upstream tracking"),
			}),
		},
	),

	tool(
		async ({ remote, branch, rebase }) => {
			try {
				const valid = validateRemoteName(remote);

				if (!valid) {
					return `${remote} is not a valid remote`;
				}

				const options: any = {};
				if (rebase) {
					options["--rebase"] = null;
				}

				await git.pull(remote, branch, options);
				return `Successfully pulled from ${remote}${branch ? `/${branch}` : ""}.`;
			} catch {
				return "There was an error while pulling changes from the remote.";
			}
		},
		{
			name: "pull_from_remote",
			description: "Pull changes from a remote repository.",
			schema: z.object({
				remote: z.string().default("origin").describe("Remote name"),
				branch: z.string().optional().describe("Branch name to pull"),
				rebase: z
					.boolean()
					.default(false)
					.describe("Use rebase instead of merge"),
			}),
		},
	),
];

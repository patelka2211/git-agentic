import { tool } from "langchain";
import z from "zod";
import { git } from "../utils/git";

export default [
	tool(
		async ({ stashRef, pop }) => {
			try {
				if (pop) {
					await git.stash(["pop", stashRef]);
					return `Stash '${stashRef}' applied and removed.`;
				} else {
					await git.stash(["apply", stashRef]);
					return `Stash '${stashRef}' applied.`;
				}
			} catch {
				return "There was an error while applying stash.";
			}
		},
		{
			name: "apply_stash",
			description: "Apply stashed changes back to the working directory.",
			schema: z.object({
				stashRef: z
					.string()
					.default("stash@{0}")
					.describe("Stash reference to apply"),
				pop: z
					.boolean()
					.default(false)
					.describe("Remove the stash after applying"),
			}),
		},
	),

	tool(
		async ({ message, includeUntracked }) => {
			try {
				const args: string[] = ["push"];

				if (includeUntracked) {
					args.push("-u");
				}

				if (message) {
					args.push("-m", message);
				}

				await git.stash(args);
				return "Changes stashed successfully.";
			} catch {
				return "There was an error while stashing the changes.";
			}
		},
		{
			name: "stash_changes",
			description: "Stash current changes in the working directory.",
			schema: z.object({
				message: z.string().optional().describe("Optional stash message"),
				includeUntracked: z
					.boolean()
					.default(false)
					.describe("Include untracked files"),
			}),
		},
	),
];

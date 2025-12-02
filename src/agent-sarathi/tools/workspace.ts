import { tool } from "langchain";
import z from "zod";
import { git } from "../utils/git";
import { sanitizeFilePath, validateCommitSha } from "../utils/validators";

export default [
	tool(
		async ({ mode, target }) => {
			try {
				const resetMode = `--${mode}`;
				const args = [resetMode];

				if (target) {
					const valid = validateCommitSha(target);

					if (!valid) {
						return `${target} is not a valid commit`;
					}

					args.push(target);
				}

				await git.reset(args);
				return `Reset to ${target || "HEAD"} with mode '${mode}' completed.`;
			} catch {
				return "There was an error while resetting changes.";
			}
		},
		{
			name: "reset_changes",
			description:
				"Reset current HEAD to a specified state. This can be destructive.",
			schema: z.object({
				mode: z
					.enum(["soft", "mixed", "hard"])
					.describe(
						"Reset mode: soft (keep changes staged), mixed (keep changes unstaged), hard (discard all changes)",
					),
				target: z
					.string()
					.optional()
					.describe("Target commit SHA or reference. Defaults to HEAD"),
			}),
		},
	),

	tool(
		async ({ target, staged }) => {
			try {
				const args: string[] = [];

				if (staged) {
					args.push("--cached");
				}

				if (target) {
					args.push(target);
				}

				const diff = await git.diff(args);
				return diff || "No differences found.";
			} catch {
				return "There was an error while showing diff.";
			}
		},
		{
			name: "show_diff",
			description:
				"Show differences between commits, branches, or working tree.",
			schema: z.object({
				target: z
					.string()
					.optional()
					.describe("Specific file, commit, or branch to diff"),
				staged: z
					.boolean()
					.default(false)
					.describe("Show diff of staged changes"),
			}),
		},
	),

	tool(
		async ({ message, amend }) => {
			try {
				const result = await git.commit(
					message,
					undefined,
					amend ? { "--amend": null } : {},
				);
				return `Committed successfully. Commit hash: ${result.commit}`;
			} catch {
				return "There was an error while committing changes.";
			}
		},
		{
			name: "commit_changes",
			description: "Commit staged changes with a message.",
			schema: z.object({
				message: z.string().min(1).describe("Commit message"),
				amend: z.boolean().default(false).describe("Amend the previous commit"),
			}),
		},
	),

	tool(
		async ({ files }) => {
			try {
				const sanitizedFiles = files.map(sanitizeFilePath);
				await git.add(sanitizedFiles);
				return `Successfully staged ${sanitizedFiles.length} file(s).`;
			} catch {
				return "There was an error while staging files.";
			}
		},
		{
			name: "stage_files",
			description: "Stage files for commit (git add).",
			schema: z.object({
				files: z
					.array(z.string())
					.describe(
						'Array of file paths to stage. Use ["."] to stage all files',
					),
			}),
		},
	),

	tool(
		async ({ maxCount, branch, author }) => {
			try {
				const options: any = { maxCount };

				if (branch) {
					options.from = branch;
				}

				if (author) {
					options.author = author;
				}

				const log = await git.log(options);
				return JSON.stringify(log.all, null, 2);
			} catch {
				return "There was an error commtting log.";
			}
		},
		{
			name: "get_commit_log",
			description: "Get the commit history/log with optional filters.",
			schema: z.object({
				maxCount: z
					.number()
					.int()
					// .positive()
					.min(1)
					.default(10)
					.describe("Maximum number of commits to retrieve"),
				branch: z
					.string()
					.optional()
					.describe("Specific branch to get log from"),
				author: z
					.string()
					.optional()
					.describe("Filter by author name or email"),
			}),
		},
	),

	tool(
		async () => {
			try {
				const status = await git.status();
				return JSON.stringify(
					{
						current: status.current,
						tracking: status.tracking,
						ahead: status.ahead,
						behind: status.behind,
						staged: status.staged,
						modified: status.modified,
						not_added: status.not_added,
						deleted: status.deleted,
						renamed: status.renamed,
						conflicted: status.conflicted,
					},
					null,
					2,
				);
			} catch {
				return "There was an error while showing git status.";
			}
		},
		{
			name: "get_git_status",
			description:
				"Get the current status of the Git repository, including staged, unstaged, and untracked files.",
			schema: z.object({}),
		},
	),
];

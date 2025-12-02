import simpleGit, { type SimpleGit, type SimpleGitOptions } from "simple-git";

/**
 * Initialize simple-git instance
 */
const gitOptions: Partial<SimpleGitOptions> = {
	baseDir: process.cwd(),
	binary: "git",
	maxConcurrentProcesses: 6,
	trimmed: false,
};

export const git: SimpleGit = simpleGit(gitOptions);

export function validateCommitSha(sha: string) {
	const shaRegex = /^[a-f0-9]{7,40}$/i;

	// if (
	// ) {
	// 	throw new ValidationError("commitSha", `Invalid commit SHA: ${sha}`);
	// }
	return shaRegex.test(sha);
}

export function sanitizeFilePath(filePath: string): string {
	// Remove any potentially dangerous patterns
	return filePath
		.replace(/\.\./g, "") // Remove parent directory references
		.replace(/^\/+/, "") // Remove leading slashes
		.trim();
}

export function validateRemoteName(remoteName: string) {
	const remoteRegex = /^[a-zA-Z0-9_-]+$/;

	return remoteRegex.test(remoteName);
}

export function validateBranchName(branchName: string) {
	// Git branch naming rules
	const invalidPatterns = [
		/^\./, // Cannot start with .
		/\.\./, // Cannot contain ..
		/\/\//, // Cannot contain //
		/\s/, // Cannot contain whitespace
		/[~^:?*[\\]/, // Cannot contain special chars
		/\.lock$/, // Cannot end with .lock
		/@\{/, // Cannot contain @{
	];

	return !invalidPatterns.some((pattern) => pattern.test(branchName));
}

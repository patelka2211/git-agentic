import type { ImplType } from "../../builder";

export default ((state) => {
	console.log(state);

	if (state.promptsChunked) return "n2_FilterGitQuery";

	return "n1_ProcessPrompt";
}) as ImplType["ce1_ChunkingFailed"];

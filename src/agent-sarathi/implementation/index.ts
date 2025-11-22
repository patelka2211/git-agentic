import { createAgent } from "../builder";
import checkForToolCall from "./conditional-edges/check-for-tool-call";
import chunkingFailed from "./conditional-edges/chunking-failed";
import filterGitRelatedQuery from "./conditional-edges/filter-git-related-query";
import checkForAction from "./nodes/check-for-action";
import filterGitQuery from "./nodes/filter-git-query";
import gitToolCalls from "./nodes/git-tool-calls";
import processPrompt from "./nodes/process-prompt";
import requireGitQuery from "./nodes/require-git-query";
import respondOnNoAction from "./nodes/respond-on-no-action";

export const Sarathi = createAgent({
	n1_ProcessPrompt: processPrompt,
	n2_FilterGitQuery: filterGitQuery,
	n3_RequireGitQuery: requireGitQuery,
	n4_CheckForAction: checkForAction,
	n5_GitToolCalls: gitToolCalls,
	n6_RespondOnNoAction: respondOnNoAction,
	ce1_ChunkingFailed: chunkingFailed,
	ce2_FilterGitRelatedQuery: filterGitRelatedQuery,
	ce3_CheckForToolCall: checkForToolCall,
}).compile();

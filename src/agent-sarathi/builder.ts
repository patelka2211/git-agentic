import {
	Annotation,
	END,
	type NodeType,
	START,
	StateGraph,
	type StateType,
} from "@langchain/langgraph";
import type { BaseMessage } from "langchain";

export const State = Annotation.Root({
	messages: Annotation<BaseMessage[]>({
		reducer: (left: BaseMessage[], right: BaseMessage | BaseMessage[]) => {
			if (Array.isArray(right)) {
				return left.concat(right);
			}
			return left.concat([right]);
		},
		default: () => [],
	}),
	userPrompt: Annotation<string>({ reducer: (_, b) => b }),
	//
	promptChunks: Annotation<string[]>({
		reducer: (_, b) => b,
		default: () => [],
	}),
	promptsChunked: Annotation<boolean>({
		reducer: (_, b) => b,
		default: () => false,
	}),
});

export type ImplType = {
	n1_ProcessPrompt: NodeType<typeof State.spec>;
	n2_FilterGitQuery: NodeType<typeof State.spec>;
	n3_RequireGitQuery: NodeType<typeof State.spec>;
	n4_CheckForAction: NodeType<typeof State.spec>;
	n5_GitToolCalls: NodeType<typeof State.spec>;
	n6_RespondOnNoAction: NodeType<typeof State.spec>;
	ce1_ChunkingFailed: (
		state: StateType<typeof State.spec>,
	) => "n1_ProcessPrompt" | "n2_FilterGitQuery";
	ce2_FilterGitRelatedQuery: (
		state: StateType<typeof State.spec>,
	) => typeof END | "n3_RequireGitQuery" | "n4_CheckForAction";
	ce3_CheckForToolCall: (
		state: StateType<typeof State.spec>,
	) => "n5_GitToolCalls" | "n6_RespondOnNoAction";
};

export function createAgent(impl: ImplType) {
	return (
		new StateGraph(State)
			.addNode("n1_ProcessPrompt", impl.n1_ProcessPrompt)
			.addNode("n2_FilterGitQuery", impl.n2_FilterGitQuery)
			.addNode("n3_RequireGitQuery", impl.n3_RequireGitQuery)
			.addNode("n4_CheckForAction", impl.n4_CheckForAction)
			.addNode("n5_GitToolCalls", impl.n5_GitToolCalls)
			.addNode("n6_RespondOnNoAction", impl.n6_RespondOnNoAction)
			.addEdge(START, "n1_ProcessPrompt")
			// .addEdge("n1_ProcessPrompt", "n2_FilterGitQuery")
			.addConditionalEdges("n1_ProcessPrompt", impl.ce1_ChunkingFailed, [
				"n1_ProcessPrompt",
				"n2_FilterGitQuery",
			])
			.addConditionalEdges(
				"n2_FilterGitQuery",
				impl.ce2_FilterGitRelatedQuery,
				[END, "n3_RequireGitQuery", "n4_CheckForAction"],
			)
			.addEdge("n3_RequireGitQuery", "n2_FilterGitQuery")
			.addConditionalEdges("n4_CheckForAction", impl.ce3_CheckForToolCall, [
				"n5_GitToolCalls",
				"n6_RespondOnNoAction",
			])
			.addEdge("n5_GitToolCalls", "n2_FilterGitQuery")
			.addEdge("n6_RespondOnNoAction", "n2_FilterGitQuery")
	);
}

import type { NodeType } from "@langchain/langgraph";
import type { State } from "../types";

export const respond: NodeType<typeof State.spec> = async (state) => {
	const lastMessage = state.messages
		.at(-1)
		?.content.toString()
		.replace("<END>", "");

	return { finalOutput: lastMessage || "" };
};

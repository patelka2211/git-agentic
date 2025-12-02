import type { NodeType, StateType } from "@langchain/langgraph";
import { AIMessage, HumanMessage, SystemMessage } from "langchain";
import { gemini_2_5_flash } from "@/models/gemini";
import tools from "../tools";
import type { State } from "../types";

export const reason: NodeType<typeof State.spec> = async (state) => {
	const messages = [
		new SystemMessage(
			`You are Sarathi, a git assistant. Think of yourself as a charioteer for Git Agentic workflows. You have tool calling capabilities and may call tool if necessary.
You have capabilities to call tools if required.
When you finish answering the prompt just respond with '<END>'.`,
		),
		new HumanMessage(state.userPrompt),
		...state.messages,
	];

	const modelWithTools = gemini_2_5_flash().bindTools(tools);

	const response = await modelWithTools.invoke(messages);

	return { messages: [response] };
};

export const afterReason = (
	state: StateType<typeof State.spec>,
): "action" | "respond" => {
	const lastMessage = state.messages.at(-1);

	if (
		lastMessage instanceof AIMessage &&
		typeof lastMessage.content === "string" &&
		lastMessage.content.includes("<END>")
	) {
		return "respond";
	}

	if (lastMessage instanceof AIMessage && lastMessage.tool_calls) {
		return "action";
	}

	return "respond";
};

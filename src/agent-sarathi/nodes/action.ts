import type { NodeType } from "@langchain/langgraph";
import { AIMessage, type DynamicStructuredTool, ToolMessage } from "langchain";
import tools from "../tools";
import type { State } from "../types";

export const action: NodeType<typeof State.spec> = async (state) => {
	const lastMessage = state.messages.at(-1);

	if (lastMessage instanceof AIMessage) {
		const { tool_calls } = lastMessage;

		if (tool_calls && tool_calls.length > 0) {
			const call = tool_calls[0];

			if (call) {
				const tool: DynamicStructuredTool | undefined = tools.find(
					(t) => t.name === call.name,
				);

				if (tool) {
					const response = await tool.invoke(call.args);

					return {
						messages: [
							new ToolMessage({
								tool_call_id: call.id || "",
								name: call.name,
								content: response,
							}),
						],
					};
				}
			}
		}
	}

	return {};
};

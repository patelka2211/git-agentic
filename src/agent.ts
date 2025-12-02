import {
	Annotation,
	END,
	START,
	StateGraph,
	type StateType,
} from "@langchain/langgraph";
import {
	AIMessage,
	type BaseMessage,
	type DynamicStructuredTool,
	HumanMessage,
	SystemMessage,
	ToolMessage,
	tool,
} from "langchain";
import z from "zod";
import { gemini_2_5_flash } from "./models/gemini";

const State = Annotation.Root({
	userQuery: Annotation<string>,
	messages: Annotation<BaseMessage[]>({
		reducer: (left, right) => left.concat(right),
		default: () => [],
	}),
	toolResults: Annotation<string[]>,
});

const addTool = tool(
	({ num1, num2 }) => {
		return `${num1} + ${num2} = ${num1 + num2}`;
	},
	{
		name: "add_tool",
		description: "add two numbers",
		schema: z.object({ num1: z.number(), num2: z.number() }),
	},
);

const subractTool = tool(
	({ num1, num2 }) => {
		return `${num1} - ${num2} = ${num1 - num2}`;
	},
	{
		name: "subract_tool",
		description: "subract two numbers",
		schema: z.object({ num1: z.number(), num2: z.number() }),
	},
);

const tools = [addTool, subractTool];

async function reasonNode(
	state: StateType<typeof State.spec>,
): Promise<Partial<typeof State.Update>> {
	console.log("in reason node");

	// const lastMessage = state.messages.at(-1);

	// 	let messages = [];
	// 	if (lastMessage === undefined) {
	// 		messages = [
	// 			new SystemMessage(
	// 				`You are a helpful assistant. You have tool calling capability and may makes tool calls based on the request.
	// When you have enough information to answer user's query you may just reply "DONE".`,
	// 			),
	// 			new HumanMessage(state.userQuery),
	// 		];
	// 	} else {
	// 		messages = state.messages;
	// 	}

	const messages = [
		new SystemMessage(
			`You are a helpful assistant. You have tool calling capability and may makes tool calls based on the request.
When you have enough information to answer user's query you may just reply "DONE".`,
		),
		new HumanMessage(state.userQuery),
		...state.messages,
	];

	const model = gemini_2_5_flash().bindTools(tools);

	const response = await model.invoke(messages);

	console.log(`[reasoning]: ${response.content}`);
	// if (response.tool_calls === undefined) {
	// 	console.log(`[reasoning]: ${response.content}`);
	// }

	return { messages: [response] };
}

async function actNode(
	state: StateType<typeof State.spec>,
): Promise<Partial<typeof State.Update>> {
	const lastMessage = state.messages.at(-1);

	if (lastMessage instanceof AIMessage) {
		const { tool_calls } = lastMessage;

		if (tool_calls && tool_calls.length > 0) {
			const call0 = tool_calls[0];
			// for (const call0 of tool_calls) {
			const tool: DynamicStructuredTool | undefined = tools.find(
				(tool) => tool.name === call0?.name,
			);

			// if (tool === undefined) {
			// 	return {
			// 		messages: [new AIMessage(`There is no tool named "${call.name}"`)],
			// 	};
			// }

			if (tool) {
				const response = await tool.invoke(call0?.args);

				return {
					messages: [
						new ToolMessage({
							tool_call_id: call0?.id || "",
							content: response,
							name: call0?.name || "",
						}),
					],

					toolResults: [response],
				};
			}
			// }
		}
	}

	return {};
}

async function respondNode(
	state: StateType<typeof State.spec>,
): Promise<Partial<typeof State.Update>> {
	console.log("respond node");

	const model = gemini_2_5_flash();

	const response = await model.stream([
		new SystemMessage(`You are a good assistant. Summarize the things you did.

List of things you did in sequence:
${state.toolResults
	.map((thing, index) => {
		return `${index + 1}. "${thing}"`;
	})
	.join("\n")}

Create a clear, friendly summary of what you did and the final result.`),
		new HumanMessage(`please summarize what you did`),
	]);

	for await (const chunk of response.values()) {
		console.log(chunk.content);
	}

	return {};
}

function afterReason(
	state: StateType<typeof State.spec>,
): "respond" | "act" | "reason" {
	const lastMessage = state.messages.at(-1);

	if (
		lastMessage instanceof AIMessage &&
		typeof lastMessage.content === "string" &&
		(lastMessage.content === "DONE" || lastMessage.content.includes("DONE"))
	) {
		return "respond";
	}

	if (lastMessage instanceof AIMessage) {
		if (lastMessage.tool_calls) {
			return "act";
		}
	}

	return "reason";
}

const agent = new StateGraph(State)
	.addNode("reason", reasonNode)
	.addNode("act", actNode)
	.addNode("respond", respondNode)
	.addEdge(START, "reason")
	.addConditionalEdges("reason", afterReason, ["reason", "respond", "act"])
	.addEdge("act", "reason")
	.addEdge("respond", END)
	.compile();

(async () => {
	await agent.invoke({
		userQuery:
			// "what is 24+4? and then how much will be left if subracted by 10",
			"Calculate (10 + 5) - 3",
	});
})();

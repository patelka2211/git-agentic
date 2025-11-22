import type { NodeType } from "@langchain/langgraph";
import { HumanMessage } from "langchain";
import z from "zod";
import type { State } from "@/agent-sarathi/builder";
import { gemini_2_5_flash_lite } from "@/models/gemini";

async function getChunkedPrompts(prompt: string) {
	const augmentedPrompt = `Be a query decomposition expert. Break down the following prompt into simpler, sequential sub-prompts that need to be answered to fully address the original prompt.

Original Prompt: ${prompt}

Return ONLY a JSON array of sub-prompts, in this format:
\`\`\`json
["sub-prompt 1", "sub-prompt 2", "sub-prompt 3"]
\`\`\`

Sub-prompts:`;

	const schema = z
		.array(z.string().describe("a sub-prompt of many"))
		.describe("the list of sub-prompts");

	try {
		const chunkedPrompts = await gemini_2_5_flash_lite()
			.withStructuredOutput(schema)
			.invoke([new HumanMessage(augmentedPrompt)]);

		const parsed = schema.safeParse(chunkedPrompts);

		if (parsed.success) {
			return parsed.data;
		} else {
			return;
		}
	} catch (_error) {
		return;
	}
}

export default (async (state) => {
	console.log(state);

	const result = await getChunkedPrompts(state.userPrompt);

	return { promptsChunked: false };
}) as NodeType<typeof State.spec>;

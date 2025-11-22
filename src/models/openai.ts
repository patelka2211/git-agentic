import { ChatOpenAI, type ChatOpenAIFields } from "@langchain/openai";

export function Gpt(input?: ChatOpenAIFields) {
	return new ChatOpenAI({
		apiKey: process.env.OPENAI_API_KEY,
		...input,
	});
}

function GptWithSpecificModel({ model }: Pick<ChatOpenAIFields, "model">) {
	return (input?: Partial<ChatOpenAIFields>) => Gpt({ model, ...input });
}

export const gpt5nano = GptWithSpecificModel({ model: "gpt-5-nano" });

export const gpt5mini = GptWithSpecificModel({ model: "gpt-5-mini" });

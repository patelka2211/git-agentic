import { ChatOllama, type ChatOllamaInput } from "@langchain/ollama";

export function Ollama(input: ChatOllamaInput) {
	return new ChatOllama(input);
}

function OllamaWithSpecificModel({ model }: Pick<ChatOllamaInput, "model">) {
	return (input?: Partial<ChatOllamaInput>) => Ollama({ model, ...input });
}

export const gemma_3_4b = OllamaWithSpecificModel({ model: "gemma3:4b" });

export const llama3_1_8b = OllamaWithSpecificModel({ model: "llama3.1:8b" });

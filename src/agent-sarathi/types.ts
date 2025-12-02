import { Annotation } from "@langchain/langgraph";
import type { BaseMessage } from "langchain";

export const State = Annotation.Root({
	userPrompt: Annotation<string>,
	messages: Annotation<BaseMessage[]>({
		reducer: (left, right) => left.concat(right),
		default: () => [],
	}),
	finalOutput: Annotation<string>,
});

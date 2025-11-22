import type { NodeType } from "@langchain/langgraph";
import type { State } from "../../builder";

export default ((state) => {
	console.log(state);
}) as NodeType<typeof State.spec>;

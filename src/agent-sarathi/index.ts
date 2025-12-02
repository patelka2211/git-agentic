import { END, START, StateGraph } from "@langchain/langgraph";
import { action } from "./nodes/action";
import { afterReason, reason } from "./nodes/reason";
import { respond } from "./nodes/respond";
import { State } from "./types";

const Sarathi = new StateGraph(State)
	// nodes
	.addNode("reason", reason)
	.addNode("action", action)
	.addNode("respond", respond)
	// edges
	.addEdge(START, "reason")
	.addConditionalEdges("reason", afterReason, ["action", "respond"])
	.addEdge("action", "reason")
	.addEdge("respond", END)
	.compile();

export default Sarathi;

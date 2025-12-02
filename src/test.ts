import Sarathi from "./agent-sarathi";

(async () => {
	const response = await Sarathi.invoke({
		userPrompt: "hi. what can you do for me?",
	});

	console.log(response.finalOutput);
})();

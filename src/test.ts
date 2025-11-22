import { Sarathi } from "./agent-sarathi/implementation";

(async () => {
	const result = await Sarathi.invoke({
		userPrompt:
			"create a branch named 'hello-world' and then commit all the changes",
	});

	console.log(result);
})();

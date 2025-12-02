import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import chalk from "chalk";
import ora from "ora";
import Sarathi from "./agent-sarathi";

const createInputInterface = () =>
	createInterface({ input: stdin, output: stdout });

function SarathiIntro() {
	console.clear();
	console.log(
		chalk.bold(
			`Hi, I'm ${chalk.blue("Sarathi")}, your charioteer for ${chalk.blue("Git")} ${chalk.blue("A")}gentic workflows.`,
		),
	);
}

const spinner = ora("");

const spinnerMessages = [
	"Sarathi is thinking...",
	"Sarathi will be back soon...",
	"Thank you for your patience...",
	"Did you know that Sarathi is a sanskrit word that means a charioteer...",
];

const getRandomSpinnerMessageIndex = () =>
	Math.floor(Math.random() * spinnerMessages.length - 1) + 1;

let interval: NodeJS.Timeout;

function LoadSpinner() {
	spinner.start();

	spinner.color = "blue";
	spinner.text =
		spinnerMessages[getRandomSpinnerMessageIndex()] || "Sarathi is thinking...";

	interval = setInterval(() => {
		spinner.text =
			spinnerMessages[getRandomSpinnerMessageIndex()] ||
			"Sarathi is thinking...";
	}, 1000);
}

function StopSpinner() {
	spinner.stop();

	clearInterval(interval);
}

let nextQuestion: string | null = null;

async function main() {
	//

	let question: string;

	if (nextQuestion) {
		question = nextQuestion;
		nextQuestion = null;
		console.clear();
	} else {
		SarathiIntro();

		const inputInterface = createInputInterface();
		question = await inputInterface.question("\n[you]: ");
		inputInterface.close();
	}

	LoadSpinner();

	const sarathiResponse = await Sarathi.invoke({ userPrompt: question });

	StopSpinner();

	console.log(`\n[Sarathi]: ${sarathiResponse.finalOutput}`);

	console.log(
		chalk.gray(`Sarathi can make mistakes. Please double-check responses.`),
	);

	const inputInterface = createInputInterface();

	nextQuestion = await inputInterface.question(
		`\n[you] ${chalk.gray("ctrl+c to close")}: `,
	);

	inputInterface.close();

	await main();
}

main();

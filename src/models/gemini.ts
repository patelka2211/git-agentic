import {
	ChatGoogleGenerativeAI,
	type GoogleGenerativeAIChatInput,
} from "@langchain/google-genai";

export function Gemini(input: GoogleGenerativeAIChatInput) {
	return new ChatGoogleGenerativeAI({
		apiKey: process.env.GOOGLE_GEMINI_API_KEY,
		...input,
	});
}

function GeminiWithSpecificModel({
	model,
}: Pick<GoogleGenerativeAIChatInput, "model">) {
	return (input?: Partial<GoogleGenerativeAIChatInput>) =>
		Gemini({ model, ...input });
}

export const gemini_3_pro_preview = GeminiWithSpecificModel({
	model: "gemini-3-pro-preview",
});

export const gemini_2_5_pro = GeminiWithSpecificModel({
	model: "gemini-2.5-pro",
});

export const gemini_2_5_flash = GeminiWithSpecificModel({
	model: "gemini-2.5-flash",
});

export const gemini_2_5_flash_lite = GeminiWithSpecificModel({
	model: "gemini-2.5-flash-lite",
});

export const gemini_2_flash = GeminiWithSpecificModel({
	model: "gemini-2.0-flash",
});

export const gemini_2_flash_lite = GeminiWithSpecificModel({
	model: "gemini-2.0-flash-lite",
});

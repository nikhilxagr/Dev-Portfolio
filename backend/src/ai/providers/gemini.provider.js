import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { AIProvider } from "./provider.interface.js";
import { env } from "../../config/env.js";

const PRIMARY_MODEL = "gemini-2.5-flash";
const FALLBACK_MODELS = ["gemini-2.0-flash-lite", "gemini-2.0-flash"];

const GENERATION_CONFIG = {
  temperature: 0.3,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 1024,
  candidateCount: 1,
};

const SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

let _genAI = null;

const getGenAI = () => {
  if (_genAI) return _genAI;
  if (!env.geminiApiKey) {
    throw new Error(
      "[GeminiProvider] GEMINI_API_KEY is not configured. Set it in .env to enable Nikhil AI."
    );
  }
  _genAI = new GoogleGenerativeAI(env.geminiApiKey);
  return _genAI;
};

const getModelInstance = (modelName = PRIMARY_MODEL) => {
  const client = getGenAI();
  return client.getGenerativeModel({
    model: modelName,
    generationConfig: GENERATION_CONFIG,
    safetySettings: SAFETY_SETTINGS,
  });
};

export class GeminiProvider extends AIProvider {
  get name() {
    return `GeminiProvider(${PRIMARY_MODEL})`;
  }

  async streamChat({ prompt, onToken, onComplete, onError }) {
    const candidateModels = [PRIMARY_MODEL, ...FALLBACK_MODELS];
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = getModelInstance(modelName);
        const result = await model.generateContentStream(prompt);

        let hasReceivedToken = false;
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            hasReceivedToken = true;
            onToken(text);
          }
        }

        const finalResponse = await result.response;
        const finishReason = finalResponse?.candidates?.[0]?.finishReason;

        if (finishReason === "SAFETY") {
          onError(
            new Error(
              "Response was blocked by safety filters. Please rephrase your question."
            )
          );
          return;
        }

        onComplete();
        return;
      } catch (error) {
        lastError = error;
        const isQuotaError =
          error?.message?.includes("429") ||
          error?.message?.includes("QUOTA") ||
          error?.message?.includes("quota") ||
          error?.message?.includes("Too Many Requests");

        if (isQuotaError && modelName !== candidateModels[candidateModels.length - 1]) {
          console.warn(`[GeminiProvider] ${modelName} hit quota limit. Falling back to next model...`);
          continue;
        }

        break;
      }
    }

    const safeMessage = sanitizeErrorMessage(lastError);
    console.error(`[GeminiProvider] All candidate models failed: ${safeMessage}`);
    onError(new Error(safeMessage));
  }
}

const sanitizeErrorMessage = (error) => {
  if (!(error instanceof Error)) {
    return "An unexpected error occurred with the AI service.";
  }

  const msg = error.message ?? "";

  if (
    msg.includes("429") ||
    msg.includes("QUOTA_EXCEEDED") ||
    msg.includes("quota") ||
    msg.includes("Too Many Requests") ||
    msg.includes("RESOURCE_EXHAUSTED")
  ) {
    return "Nikhil AI is temporarily at capacity (free tier limit). Please wait a moment and try again.";
  }

  if (
    msg.includes("API_KEY_INVALID") ||
    msg.includes("API key not valid") ||
    msg.includes("invalid API key")
  ) {
    return "AI service configuration error. Please contact Nikhil directly.";
  }

  if (
    msg.includes("failed to fetch") ||
    msg.includes("fetch failed") ||
    msg.includes("ECONNREFUSED") ||
    msg.includes("ENOTFOUND") ||
    msg.includes("ETIMEDOUT")
  ) {
    return "Unable to reach AI service. Please check your internet connection and try again.";
  }

  return "AI service encountered an error. Please try again in a few seconds.";
};

export const geminiProvider = new GeminiProvider();

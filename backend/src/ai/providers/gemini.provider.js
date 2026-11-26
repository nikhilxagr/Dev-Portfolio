import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { AIProvider } from "./provider.interface.js";
import { env } from "../../config/env.js";

// Primary stable & high-speed models with high quota and ~1s latency
const PRIMARY_MODEL = "gemini-3.5-flash-lite";
const FALLBACK_MODELS = [
  "gemini-flash-lite-latest",
  "gemini-3.5-flash",
];

const GENERATION_CONFIG = {
  temperature: 0.4,
  topP: 0.85,
  topK: 40,
  maxOutputTokens: 2048,
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
      let hasReceivedToken = false;
      try {
        const model = getModelInstance(modelName);

        // 18-second timeout guard to prevent hung requests on stalled models
        const generateStreamPromise = model.generateContentStream(prompt);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error(`Timeout waiting for ${modelName} after 18s`)),
            18000
          )
        );

        const result = await Promise.race([generateStreamPromise, timeoutPromise]);

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
        console.warn(
          `[GeminiProvider] Model ${modelName} failed (${error?.status || error?.name || "error"}: ${error?.message}).`
        );

        // If tokens were already sent to client, do not restart with another model
        if (hasReceivedToken) {
          console.error(`[GeminiProvider] Stream was interrupted after tokens were delivered. Aborting.`);
          break;
        }

        // If fallback models remain, continue to next candidate
        if (modelName !== candidateModels[candidateModels.length - 1]) {
          console.warn(`[GeminiProvider] Falling back to next available model...`);
          continue;
        }

        break;
      }
    }

        const safeMessage = sanitizeErrorMessage(lastError);
    console.error(`[GeminiProvider] All candidate models failed: ${safeMessage}`);
    onError(new Error(safeMessage));
  }

  async transcribeAudio({ base64Audio, mimeType = "audio/webm" }) {
    const cleanMime = String(mimeType || "audio/webm")
      .split(";")[0]
      .trim()
      .toLowerCase();
    const allowedMimes = new Set([
      "audio/webm",
      "audio/mp4",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "audio/x-m4a",
      "audio/aac",
    ]);
    const finalMime = allowedMimes.has(cleanMime) ? cleanMime : "audio/webm";
    const candidateModels = [PRIMARY_MODEL, ...FALLBACK_MODELS];
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = getModelInstance(modelName);
        const transcribePromise = model.generateContent([
          {
            inlineData: {
              mimeType: finalMime,
              data: base64Audio,
            },
          },
          "Listen carefully to this spoken audio clip and transcribe the user's exact words into plain English or Hinglish text as spoken. Return ONLY the clean transcribed text without quotes, labels, timestamps, or commentary. If there is only silence or no intelligible speech, return an empty string.",
        ]);

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error(`Timeout waiting for ${modelName} transcription after 20s`)),
            20000
          )
        );

        const result = await Promise.race([transcribePromise, timeoutPromise]);
        const text = (result?.response?.text?.() || "").trim();
        return text;
      } catch (error) {
        lastError = error;
        console.warn(
          `[GeminiProvider] Audio transcription on ${modelName} failed: ${error?.message}`
        );
      }
    }

    throw new Error(sanitizeErrorMessage(lastError));
  }
}

const sanitizeErrorMessage = (error) => {
  if (!(error instanceof Error)) {
    return "An unexpected error occurred with the AI service.";
  }

  const msg = error.message ?? "";

  if (
    msg.includes("429") ||
    msg.includes("503") ||
    msg.includes("QUOTA_EXCEEDED") ||
    msg.includes("quota") ||
    msg.includes("Too Many Requests") ||
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes("high demand") ||
    msg.includes("Service Unavailable") ||
    msg.includes("ServiceUnavailable")
  ) {
    return "Nikhil AI is temporarily experiencing high traffic. Please try again in a few moments.";
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
    msg.includes("ETIMEDOUT") ||
    msg.includes("Timeout waiting")
  ) {
    return "Unable to reach AI service in time. Please check your connection and try again.";
  }

  return "AI service encountered an error. Please try again in a few seconds.";
};

export const geminiProvider = new GeminiProvider();

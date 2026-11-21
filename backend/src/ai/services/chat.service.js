import {
  buildRagPrompt,
  getTargetedKnowledgeContext,
  estimateTokenCount,
} from "../prompts/prompt.builder.js";
import { isKnowledgeReady } from "../knowledge/knowledge.index.js";
import { geminiProvider } from "../providers/gemini.provider.js";
import { grokProvider } from "../providers/grok.provider.js";

const activeProvider = geminiProvider;
const MAX_MESSAGE_LENGTH = 1500;
const MAX_HISTORY_ENTRIES = 12;

export const streamChatResponse = async ({
  message,
  history = [],
  onToken,
  onComplete,
  onError,
}) => {
  if (!isKnowledgeReady()) {
    onError(
      new Error(
        "Knowledge base is still loading. Please try again in a moment."
      )
    );
    return;
  }

  const trimmedMessage = String(message ?? "").trim();
  if (!trimmedMessage) {
    onError(new Error("Message cannot be empty."));
    return;
  }

  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    onError(
      new Error(
        `Message is too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`
      )
    );
    return;
  }

  const sanitizedHistory = Array.isArray(history)
    ? history
        .filter(
          (msg) =>
            msg &&
            typeof msg === "object" &&
            ["user", "assistant"].includes(msg.role) &&
            typeof msg.content === "string"
        )
        .slice(-MAX_HISTORY_ENTRIES)
    : [];

  let prompt;
  try {
    // Step 1: Immediately extract targeted knowledge context (0ms, avoids heavy 66KB dumps)
    const targetedContext = getTargetedKnowledgeContext(trimmedMessage);

    // Step 2: If GROK_API_KEY is configured, use Grok to read question & extract facts
    let grokExtractedContext = null;
    if (grokProvider.isConfigured()) {
      console.log("[ChatService] Grok API key active. Asking Grok to extract relevant portfolio context...");
      grokExtractedContext = await grokProvider.extractKnowledge({
        userMessage: trimmedMessage,
        knowledgeSummary: targetedContext,
      });

      if (grokExtractedContext) {
        console.log("[ChatService] Grok extraction succeeded. Passing extracted facts to Gemini for UI streaming.");
      } else {
        console.log("[ChatService] Grok extraction unavailable/no credits. Using targeted topic context for Gemini.");
      }
    }

    const effectiveContext = grokExtractedContext || targetedContext;

    // Step 3: Build high-speed prompt for Gemini
    prompt = buildRagPrompt({
      userMessage: trimmedMessage,
      ragContext: effectiveContext,
      history: sanitizedHistory,
    });

    const estimatedTokens = estimateTokenCount(prompt);
    console.log(`[ChatService] Fast prompt built: ~${estimatedTokens} tokens.`);
  } catch (error) {
    console.error(`[ChatService] Prompt build failed: ${error.message}`);
    onError(new Error("Failed to prepare your request. Please try again."));
    return;
  }

  // Step 4: Stream response directly to UI via Gemini 2.5 Flash
  await activeProvider.streamChat({ prompt, onToken, onComplete, onError });
};

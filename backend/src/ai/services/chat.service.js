import { buildPrompt, buildRagPrompt, estimateTokenCount } from "../prompts/prompt.builder.js";
import { isKnowledgeReady } from "../knowledge/knowledge.index.js";
import { geminiProvider } from "../providers/gemini.provider.js";
import { retrieveContext } from "../rag/rag.service.js";
import { isRagReady } from "../rag/rag.index.js";

const activeProvider = geminiProvider;
const MAX_MESSAGE_LENGTH = 500;
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
    if (isRagReady()) {
      // RAG path: retrieve only relevant chunks, build a small focused prompt
      const ragContext = await retrieveContext(trimmedMessage);

      if (ragContext) {
        prompt = buildRagPrompt({
          userMessage: trimmedMessage,
          ragContext,
          history: sanitizedHistory,
        });
        const estimatedTokens = estimateTokenCount(prompt);
        console.log(`[ChatService] RAG prompt built. ~${estimatedTokens} tokens (RAG active).`);
      } else {
        // RAG returned no results — fall back to full context
        prompt = buildPrompt({ userMessage: trimmedMessage, history: sanitizedHistory });
        console.log("[ChatService] RAG returned no results. Using full knowledge context.");
      }
    } else {
      // RAG not ready — use full context as before
      prompt = buildPrompt({ userMessage: trimmedMessage, history: sanitizedHistory });
      console.log("[ChatService] RAG not ready. Using full knowledge context (fallback).");
    }
  } catch (error) {
    console.error(`[ChatService] Prompt build failed: ${error.message}`);
    onError(new Error("Failed to prepare your request. Please try again."));
    return;
  }

  await activeProvider.streamChat({ prompt, onToken, onComplete, onError });
};

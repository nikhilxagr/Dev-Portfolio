import { buildPrompt } from "../prompts/prompt.builder.js";
import { isKnowledgeReady } from "../knowledge/knowledge.index.js";
import { geminiProvider } from "../providers/gemini.provider.js";

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
    prompt = buildPrompt({
      userMessage: trimmedMessage,
      history: sanitizedHistory,
    });
  } catch (error) {
    console.error(`[ChatService] Prompt build failed: ${error.message}`);
    onError(new Error("Failed to prepare your request. Please try again."));
    return;
  }

  await activeProvider.streamChat({ prompt, onToken, onComplete, onError });
};

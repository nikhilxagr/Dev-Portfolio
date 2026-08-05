import { SYSTEM_PROMPT_TEMPLATE } from "./system.prompt.js";
import { getAllKnowledge } from "../knowledge/knowledge.index.js";

const MAX_HISTORY_TURNS = 6;
const MAX_HISTORY_MESSAGE_CHARS = 1500;
const MAX_USER_MESSAGE_CHARS = 500;

// Full knowledge context — used as fallback when RAG is not ready
const buildFullKnowledgeContext = () => {
  const entries = getAllKnowledge();

  if (entries.length === 0) {
    return "_No knowledge available. Inform the user that the knowledge base is currently loading._";
  }

  return entries
    .map(
      ({ topic, content }) =>
        `### ${topic.toUpperCase()}\n\n${content}`
    )
    .join("\n\n---\n\n");
};

const buildConversationHistory = (history) => {
  if (!Array.isArray(history) || history.length === 0) {
    return "_This is the start of the conversation._";
  }

  const recentHistory = history.slice(-MAX_HISTORY_TURNS * 2);

  return recentHistory
    .map((msg) => {
      const role = msg.role === "user" ? "**Visitor**" : "**Nikhil AI**";
      const content = String(msg.content ?? "")
        .trim()
        .slice(0, MAX_HISTORY_MESSAGE_CHARS);
      return `${role}: ${content}`;
    })
    .join("\n\n");
};

/**
 * Builds a prompt using RAG-retrieved context (small, relevant chunks only).
 * This is the primary path when RAG is ready.
 */
export const buildRagPrompt = ({ userMessage, ragContext, history = [] }) => {
  const sanitizedMessage = String(userMessage ?? "")
    .trim()
    .slice(0, MAX_USER_MESSAGE_CHARS);

  if (!sanitizedMessage) {
    throw new Error("User message cannot be empty after sanitization");
  }

  const conversation = buildConversationHistory(history);

  return SYSTEM_PROMPT_TEMPLATE
    .replace("{{KNOWLEDGE_CONTEXT}}", ragContext)
    .replace("{{CONVERSATION}}", conversation)
    .replace("{{USER_MESSAGE}}", sanitizedMessage);
};

/**
 * Builds a prompt using the full knowledge base context.
 * Used as a fallback when RAG is not ready or returns no results.
 */
export const buildPrompt = ({ userMessage, history = [] }) => {
  const sanitizedMessage = String(userMessage ?? "")
    .trim()
    .slice(0, MAX_USER_MESSAGE_CHARS);

  if (!sanitizedMessage) {
    throw new Error("User message cannot be empty after sanitization");
  }

  const knowledgeContext = buildFullKnowledgeContext();
  const conversation = buildConversationHistory(history);

  return SYSTEM_PROMPT_TEMPLATE
    .replace("{{KNOWLEDGE_CONTEXT}}", knowledgeContext)
    .replace("{{CONVERSATION}}", conversation)
    .replace("{{USER_MESSAGE}}", sanitizedMessage);
};

export const estimateTokenCount = (text) => Math.ceil(text.length / 4);

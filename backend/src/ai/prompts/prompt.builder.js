import { SYSTEM_PROMPT_TEMPLATE } from "./system.prompt.js";
import { getAllKnowledge, getKnowledge } from "../knowledge/knowledge.index.js";

const MAX_HISTORY_TURNS = 6;
const MAX_HISTORY_MESSAGE_CHARS = 1500;
const MAX_USER_MESSAGE_CHARS = 500;

/**
 * Fast targeted topic extractor:
 * Immediately maps the user's intent to the 1-3 relevant knowledge topics.
 * Reduces prompt size from ~66KB to ~3-6KB, enabling ultra-fast token streaming.
 */
export const getTargetedKnowledgeContext = (userMessage) => {
  const q = String(userMessage || "").toLowerCase();
  const matchedTopics = new Set(["personality"]);

  if (
    q.includes("resume") ||
    q.includes("cv") ||
    q.includes("hire") ||
    q.includes("job") ||
    q.includes("download") ||
    q.includes("pdf")
  ) {
    matchedTopics.add("resume");
    matchedTopics.add("about");
  }

  if (
    q.includes("project") ||
    q.includes("built") ||
    q.includes("app") ||
    q.includes("work") ||
    q.includes("github") ||
    q.includes("repo") ||
    q.includes("kanoon") ||
    q.includes("intube") ||
    q.includes("snapurl") ||
    q.includes("fast feast") ||
    q.includes("clone")
  ) {
    matchedTopics.add("projects");
  }

  if (
    q.includes("skill") ||
    q.includes("tech") ||
    q.includes("stack") ||
    q.includes("language") ||
    q.includes("framework") ||
    q.includes("tool") ||
    q.includes("python") ||
    q.includes("react") ||
    q.includes("node") ||
    q.includes("mongo") ||
    q.includes("sql")
  ) {
    matchedTopics.add("skills");
  }

  if (
    q.includes("journey") ||
    q.includes("education") ||
    q.includes("college") ||
    q.includes("bbd") ||
    q.includes("bca") ||
    q.includes("study") ||
    q.includes("school") ||
    q.includes("timeline")
  ) {
    matchedTopics.add("journey");
    matchedTopics.add("about");
  }

  if (
    q.includes("experience") ||
    q.includes("intern") ||
    q.includes("assocham") ||
    q.includes("freelance") ||
    q.includes("role")
  ) {
    matchedTopics.add("experience");
    matchedTopics.add("resume");
  }

  if (
    q.includes("cert") ||
    q.includes("achievement") ||
    q.includes("award") ||
    q.includes("hackathon") ||
    q.includes("tryhackme") ||
    q.includes("rank")
  ) {
    matchedTopics.add("certificates");
  }

  if (
    q.includes("service") ||
    q.includes("price") ||
    q.includes("cost") ||
    q.includes("package") ||
    q.includes("rate") ||
    q.includes("book") ||
    q.includes("pay")
  ) {
    matchedTopics.add("services");
  }

  if (
    q.includes("blog") ||
    q.includes("article") ||
    q.includes("writeup") ||
    q.includes("post") ||
    q.includes("system design") ||
    q.includes("url shortener")
  ) {
    matchedTopics.add("blogs");
  }

  if (
    q.includes("contact") ||
    q.includes("email") ||
    q.includes("phone") ||
    q.includes("reach") ||
    q.includes("call") ||
    q.includes("whatsapp") ||
    q.includes("social") ||
    q.includes("linkedin")
  ) {
    matchedTopics.add("about");
    matchedTopics.add("faq");
  }

  // If no specific topic matched, provide the core highlights
  if (matchedTopics.size <= 1) {
    matchedTopics.add("about");
    matchedTopics.add("resume");
    matchedTopics.add("projects");
    matchedTopics.add("skills");
  }

  return [...matchedTopics]
    .map((topic) => {
      const content = getKnowledge(topic);
      return content ? `### ${topic.toUpperCase()}\n\n${content}` : null;
    })
    .filter(Boolean)
    .join("\n\n---\n\n");
};

// Full knowledge context — used when complete overview is needed
export const buildFullKnowledgeContext = () => {
  const entries = getAllKnowledge();

  if (entries.length === 0) {
    return "_No knowledge available. Inform the user that the knowledge base is currently loading._";
  }

  return entries
    .map(({ topic, content }) => `### ${topic.toUpperCase()}\n\n${content}`)
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
 * Builds a prompt using RAG-retrieved or Grok-extracted context.
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
 * Builds a prompt using targeted topic context for high-speed response.
 */
export const buildPrompt = ({ userMessage, history = [] }) => {
  const sanitizedMessage = String(userMessage ?? "")
    .trim()
    .slice(0, MAX_USER_MESSAGE_CHARS);

  if (!sanitizedMessage) {
    throw new Error("User message cannot be empty after sanitization");
  }

  const knowledgeContext = getTargetedKnowledgeContext(sanitizedMessage);
  const conversation = buildConversationHistory(history);

  return SYSTEM_PROMPT_TEMPLATE
    .replace("{{KNOWLEDGE_CONTEXT}}", knowledgeContext)
    .replace("{{CONVERSATION}}", conversation)
    .replace("{{USER_MESSAGE}}", sanitizedMessage);
};

export const estimateTokenCount = (text) => Math.ceil(text.length / 4);

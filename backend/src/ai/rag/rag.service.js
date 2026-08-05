import { embedText } from "./embedder.js";
import { search, isStoreReady } from "./vector.store.js";

const DEFAULT_TOP_K = 5;
const MAX_CONTEXT_CHARS = 8000; // ~2000 tokens — safe limit for prompt context

/**
 * Retrieves the most relevant knowledge chunks for a given user query
 * using vector similarity search.
 *
 * @param {string} userQuery - The user's raw message
 * @param {number} topK - How many chunks to retrieve
 * @returns {Promise<string>} - Concatenated relevant context string for the prompt
 */
export const retrieveContext = async (userQuery, topK = DEFAULT_TOP_K) => {
  if (!isStoreReady()) {
    return null; // signals caller to fall back to full context
  }

  let queryEmbedding;
  try {
    queryEmbedding = await embedText(userQuery);
  } catch (error) {
    console.warn(`[RagService] Embedding failed for query: ${error.message}. Using fallback.`);
    return null;
  }

  const results = search(queryEmbedding, topK);

  if (results.length === 0) {
    // No confident match — return null to trigger full-context fallback
    return null;
  }

  // Build context string from top results, capped at MAX_CONTEXT_CHARS
  let context = "";
  for (const chunk of results) {
    const entry = `### [${chunk.topic.toUpperCase()}]\n\n${chunk.text}`;
    if ((context + entry).length > MAX_CONTEXT_CHARS) break;
    context += (context ? "\n\n---\n\n" : "") + entry;
  }

  return context;
};

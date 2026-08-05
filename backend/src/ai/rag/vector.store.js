/**
 * In-memory vector store with cosine similarity search.
 * Stores all embedded chunks at startup and retrieves
 * the most relevant ones for each user query.
 */

/** @type {Array<{ id: string, topic: string, text: string, embedding: number[] }>} */
let store = [];

/**
 * Computes cosine similarity between two vectors.
 * Returns a value in [-1, 1] where 1 = identical direction.
 */
const cosineSimilarity = (a, b) => {
  if (a.length !== b.length) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
};

/**
 * Populates the vector store with pre-embedded chunks.
 * @param {Array<{ id: string, topic: string, text: string, embedding: number[] }>} chunks
 */
export const populateStore = (chunks) => {
  store = chunks;
  console.log(`[VectorStore] Loaded ${store.length} embedded chunks into memory.`);
};

/**
 * Searches for the top-K most relevant chunks for a given query embedding.
 * @param {number[]} queryEmbedding
 * @param {number} topK - Number of top results to return (default 5)
 * @param {number} minScore - Minimum similarity threshold (default 0.4)
 * @returns {Array<{ id: string, topic: string, text: string, score: number }>}
 */
export const search = (queryEmbedding, topK = 5, minScore = 0.40) => {
  if (store.length === 0) return [];

  const scored = store.map((chunk) => ({
    id: chunk.id,
    topic: chunk.topic,
    text: chunk.text,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  return scored
    .filter((c) => c.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
};

/**
 * Returns how many chunks are currently stored.
 */
export const getStoreSize = () => store.length;

/**
 * Returns true if the vector store has been populated.
 */
export const isStoreReady = () => store.length > 0;

/**
 * Returns metadata about the current store contents.
 */
export const getStoreStats = () => {
  const topicCounts = {};
  for (const chunk of store) {
    topicCounts[chunk.topic] = (topicCounts[chunk.topic] ?? 0) + 1;
  }
  return {
    totalChunks: store.length,
    topicBreakdown: topicCounts,
  };
};

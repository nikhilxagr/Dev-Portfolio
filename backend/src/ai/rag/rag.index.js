import { getAllKnowledge } from "../knowledge/knowledge.index.js";
import { chunkAllKnowledge } from "./chunker.js";
import { embedChunks } from "./embedder.js";
import { populateStore, isStoreReady, getStoreStats } from "./vector.store.js";

let _ragReady = false;

/**
 * Initializes the RAG system at server startup:
 * 1. Reads all knowledge from the in-memory knowledge store
 * 2. Chunks each file into small semantic pieces
 * 3. Embeds all chunks using text-embedding-004 (free Google API)
 * 4. Populates the in-memory vector store
 *
 * This runs once after loadKnowledge() completes.
 */
export const initializeRag = async () => {
  console.log("[RAG] Starting RAG initialization...");

  const knowledgeEntries = getAllKnowledge();

  if (knowledgeEntries.length === 0) {
    console.warn("[RAG] No knowledge entries available. RAG will not be initialized.");
    return;
  }

  // Step 1: Chunk all knowledge files
  const chunks = chunkAllKnowledge(knowledgeEntries);
  console.log(`[RAG] Chunked ${knowledgeEntries.length} knowledge files → ${chunks.length} chunks.`);

  // Step 2: Embed all chunks (batched, with rate-limit courtesy delays)
  const embeddedChunks = await embedChunks(chunks);

  // Step 3: Populate in-memory vector store
  populateStore(embeddedChunks);

  const stats = getStoreStats();
  console.log(`[RAG] Ready ✅  — ${stats.totalChunks} chunks indexed.`);
  console.log(`[RAG] Topic breakdown: ${JSON.stringify(stats.topicBreakdown)}`);

  _ragReady = true;
};

/**
 * Returns true if RAG has been successfully initialized.
 */
export const isRagReady = () => _ragReady && isStoreReady();

/**
 * Returns current RAG stats for the health endpoint.
 */
export const getRagStats = () => {
  if (!_ragReady) return null;
  return getStoreStats();
};

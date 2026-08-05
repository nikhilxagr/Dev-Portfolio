import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../config/env.js";

const EMBEDDING_MODEL = "models/gemini-embedding-001";
const BATCH_SIZE = 20; // embed 20 chunks per batch
const BATCH_DELAY_MS = 200; // short delay — embedding API has high free-tier RPM

let _embeddingClient = null;

const getEmbeddingClient = () => {
  if (_embeddingClient) return _embeddingClient;
  if (!env.geminiApiKey) {
    throw new Error("[Embedder] GEMINI_API_KEY is not set. Cannot initialize embeddings.");
  }
  const genAI = new GoogleGenerativeAI(env.geminiApiKey);
  _embeddingClient = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  return _embeddingClient;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Embeds a single text string and returns its vector.
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export const embedText = async (text) => {
  const client = getEmbeddingClient();
  const result = await client.embedContent(text);
  return result.embedding.values;
};

/**
 * Embeds an array of chunks in batches with rate-limit courtesy delays.
 * @param {Array<{ id: string, topic: string, text: string }>} chunks
 * @returns {Promise<Array<{ id: string, topic: string, text: string, embedding: number[] }>>}
 */
export const embedChunks = async (chunks) => {
  const embedded = [];
  let batchNum = 0;

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    batchNum++;

    const results = await Promise.allSettled(
      batch.map(async (chunk) => {
        const embedding = await embedText(chunk.text);
        return { ...chunk, embedding };
      })
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        embedded.push(result.value);
      } else {
        console.warn(`[Embedder] Failed to embed chunk: ${result.reason?.message}`);
      }
    }

    // Polite delay between batches to avoid rate limits on startup
    if (i + BATCH_SIZE < chunks.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  console.log(`[Embedder] Embedded ${embedded.length}/${chunks.length} chunks in ${batchNum} batch(es).`);
  return embedded;
};

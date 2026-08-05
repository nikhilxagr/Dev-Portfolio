import { streamChatResponse } from "../services/chat.service.js";
import { isKnowledgeReady, getKnowledgeStats } from "../knowledge/knowledge.index.js";
import { env } from "../../config/env.js";
import { isRagReady } from "../rag/rag.index.js";
import { getStoreStats } from "../rag/vector.store.js";

export const chatStream = async (req, res) => {
  const { message, history = [], sessionId } = req.body;

  if (!message || typeof message !== "string") {
    res.status(400).json({
      success: false,
      message: "message is required and must be a string.",
    });
    return;
  }

  // Set up SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  let streamEnded = false;

  const sendEvent = (data) => {
    if (streamEnded || res.writableEnded) return;
    try {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch {
      // Client disconnected
    }
  };

  const endStream = () => {
    if (streamEnded || res.writableEnded) return;
    streamEnded = true;
    try {
      res.end();
    } catch {
      // Already closed
    }
  };

  req.on("close", () => {
    streamEnded = true;
  });

  await streamChatResponse({
    message,
    history,
    onToken: (token) => {
      sendEvent({ token });
    },
    onComplete: () => {
      sendEvent({ done: true });
      endStream();

      if (env.nodeEnv !== "production") {
        console.log(
          `[ChatController] Stream complete. Session: ${sessionId ?? "anonymous"}`
        );
      }
    },
    onError: (error) => {
      sendEvent({
        error: error.message ?? "An unexpected error occurred.",
        code: "AI_ERROR",
      });
      endStream();
      console.error(`[ChatController] Stream error: ${error.message}`);
    },
  });
};

export const aiHealth = (req, res) => {
  const knowledgeReady = isKnowledgeReady();
  const geminiConfigured = Boolean(env.geminiApiKey);
  const ragReady = isRagReady();
  const knowledgeStats = knowledgeReady ? getKnowledgeStats() : null;
  const ragStats = ragReady ? getStoreStats() : null;

  res.status(200).json({
    success: true,
    message: "Nikhil AI health check",
    data: {
      status: knowledgeReady && geminiConfigured ? "ready" : "degraded",
      knowledgeReady,
      geminiConfigured,
      ragReady,
      ...(knowledgeStats && {
        knowledgeTopics: knowledgeStats.topics,
        knowledgeTopicCount: knowledgeStats.topicCount,
        knowledgeSizeKB: Math.round(knowledgeStats.totalBytes / 1024),
      }),
      ...(ragStats && {
        ragChunkCount: ragStats.totalChunks,
        ragTopicBreakdown: ragStats.topicBreakdown,
      }),
    },
  });
};

import { API_BASE_URL } from './api.js';

const AI_CHAT_URL = `${API_BASE_URL}/ai/chat`;
const AI_HEALTH_URL = `${API_BASE_URL}/ai/health`;

export const streamChat = ({ message, history = [], sessionId, onToken, onComplete, onError }) => {
  const controller = new AbortController();

  const run = async () => {
    try {
      const response = await fetch(AI_CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, sessionId }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        onError(errorData.message ?? `Server error: ${response.status}`);
        return;
      }

      if (!response.body) {
        onError('Streaming is not supported in this environment.');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          if (buffer.trim()) {
            processBuffer(buffer, onToken, onComplete, onError);
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;

            try {
              const event = JSON.parse(jsonStr);

              if (event.token !== undefined) {
                onToken(event.token);
              } else if (event.done === true) {
                onComplete();
                return;
              } else if (event.error) {
                onError(event.error);
                return;
              }
            } catch {
              // ignore malformed chunks
            }
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }

      if (error.message?.includes('fetch')) {
        onError('Unable to reach Nikhil AI. Please check your connection.');
      } else {
        onError('An unexpected error occurred. Please try again.');
      }
    }
  };

  run();

  return () => controller.abort();
};

const processBuffer = (buffer, onToken, onComplete, onError) => {
  const lines = buffer.split('\n');
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      try {
        const event = JSON.parse(line.slice(6).trim());
        if (event.token) onToken(event.token);
        else if (event.done) onComplete();
        else if (event.error) onError(event.error);
      } catch {
        // ignore
      }
    }
  }
};

export const checkAIHealth = async () => {
  try {
    const response = await fetch(AI_HEALTH_URL, { method: 'GET' });
    const data = await response.json();
    return {
      ready: data.data?.status === 'ready',
      topicCount: data.data?.knowledgeTopicCount ?? 0,
      topics: data.data?.knowledgeTopics ?? [],
    };
  } catch {
    return { ready: false, topicCount: 0, topics: [] };
  }
};

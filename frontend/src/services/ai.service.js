import { API_BASE_URL } from './api.js';

const AI_CHAT_URL = `${API_BASE_URL}/ai/chat`;
const AI_TRANSCRIBE_URL = `${API_BASE_URL}/ai/transcribe`;
const AI_HEALTH_URL = `${API_BASE_URL}/ai/health`;
const AI_IMAGE_URL = `${API_BASE_URL}/ai/generate-image`;
const AI_IMAGE_QUOTA_URL = `${API_BASE_URL}/ai/image-quota`;
const AI_IMAGE_MODELS_URL = `${API_BASE_URL}/ai/image-models`;
const AI_SESSIONS_URL = `${API_BASE_URL}/ai/sessions`;

const getAuthHeaders = () => {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('portfolio_user_token')
      : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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

export const transcribeVoiceAudio = async ({ audioBase64, mimeType = 'audio/webm' }) => {
  const response = await fetch(AI_TRANSCRIBE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ audio: audioBase64, mimeType }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || `Voice transcription failed (${response.status})`);
  }

  return String(data.transcript || '').trim();
};

export const getAIImageModels = async () => {
  try {
    const response = await fetch(AI_IMAGE_MODELS_URL, { method: 'GET' });
    const data = await response.json().catch(() => ({}));
    return {
      defaultModel: data.defaultModel || 'flux-2-dev',
      models: Array.isArray(data.models) ? data.models : [],
    };
  } catch {
    return {
      defaultModel: 'flux-2-dev',
      models: [],
    };
  }
};

export const generateAIImage = async ({ prompt, model = 'flux-2-dev' }) => {
  const response = await fetch(AI_IMAGE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ prompt, model }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    const error = new Error(data.message || `Image generation failed (${response.status})`);
    error.requireAuth = Boolean(data.requireAuth);
    error.quota = data.quota;
    throw error;
  }

  return data;
};

export const getAIImageQuota = async () => {
  try {
    const response = await fetch(AI_IMAGE_QUOTA_URL, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
      },
    });
    const data = await response.json().catch(() => ({}));
    return (
      data.quota || {
        limit: 10,
        used: 0,
        remaining: 10,
        canGenerate: true,
      }
    );
  } catch {
    return {
      limit: 10,
      used: 0,
      remaining: 10,
      canGenerate: true,
    };
  }
};

export const getUserChatSessions = async () => {
  try {
    const response = await fetch(AI_SESSIONS_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) return [];
    const data = await response.json().catch(() => ({}));
    return Array.isArray(data.sessions) ? data.sessions : [];
  } catch {
    return [];
  }
};

export const getUserChatSession = async (sessionId) => {
  if (!sessionId) return null;
  try {
    const response = await fetch(`${AI_SESSIONS_URL}/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) return null;
    const data = await response.json().catch(() => ({}));
    return data.session || null;
  } catch {
    return null;
  }
};

export const saveUserChatSession = async ({ sessionId, title, messages }) => {
  try {
    const response = await fetch(AI_SESSIONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ sessionId, title, messages }),
    });
    if (!response.ok) return null;
    const data = await response.json().catch(() => ({}));
    return data.session || null;
  } catch {
    return null;
  }
};

export const patchUserChatSession = async (sessionId, updateData) => {
  if (!sessionId) return null;
  try {
    const response = await fetch(`${AI_SESSIONS_URL}/${sessionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) return null;
    const data = await response.json().catch(() => ({}));
    return data.session || null;
  } catch {
    return null;
  }
};

export const deleteUserChatSession = async (sessionId) => {
  if (!sessionId) return false;
  try {
    const response = await fetch(`${AI_SESSIONS_URL}/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return response.ok;
  } catch {
    return false;
  }
};

export const clearAllUserChatSessions = async () => {
  try {
    const response = await fetch(AI_SESSIONS_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return response.ok;
  } catch {
    return false;
  }
};

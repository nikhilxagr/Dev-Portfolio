import { AIProvider } from "./provider.interface.js";
import { env } from "../../config/env.js";

const GROK_API_URL = "https://api.x.ai/v1/chat/completions";
const GROK_MODEL = "grok-2-latest";
const GROK_FALLBACK_MODEL = "grok-beta";

export class GrokProvider extends AIProvider {
  get name() {
    return `GrokProvider(${GROK_MODEL})`;
  }

  isConfigured() {
    return Boolean(env.grokApiKey && env.grokApiKey.startsWith("xai-"));
  }

  /**
   * Fast knowledge extractor:
   * Uses Grok to quickly analyze the user's question against the portfolio knowledge
   * and extract only the relevant concise facts for Gemini to render.
   */
  async extractKnowledge({ userMessage, knowledgeSummary }) {
    if (!this.isConfigured()) return null;

    try {
      const response = await fetch(GROK_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.grokApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: GROK_MODEL,
          temperature: 0.1,
          max_tokens: 1000,
          messages: [
            {
              role: "system",
              content:
                "You are an ultra-fast fact extraction engine for Nikhil Agrahari's portfolio. Extract only the exact relevant facts, URLs, skills, and metrics needed to answer the user question from the provided knowledge. Return concise markdown bullet points.",
            },
            {
              role: "user",
              content: `PORTFOLIO KNOWLEDGE:\n${knowledgeSummary}\n\nUSER QUESTION:\n${userMessage}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn(`[GrokProvider] Extraction failed (${response.status}): ${errorData.error || response.statusText}`);
        return null;
      }

      const data = await response.json();
      const extractedContent = data.choices?.[0]?.message?.content?.trim();
      return extractedContent || null;
    } catch (err) {
      console.warn(`[GrokProvider] Extraction error: ${err.message}`);
      return null;
    }
  }

  /**
   * Direct streaming via Grok:
   */
  async streamChat({ prompt, onToken, onComplete, onError }) {
    if (!this.isConfigured()) {
      onError(new Error("GROK_API_KEY is not configured."));
      return;
    }

    const candidateModels = [GROK_MODEL, GROK_FALLBACK_MODEL];
    let lastError = null;

    for (const model of candidateModels) {
      let hasReceivedToken = false;
      try {
        const response = await fetch(GROK_API_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.grokApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            stream: true,
            temperature: 0.3,
            messages: [
              {
                role: "system",
                content: prompt,
              },
            ],
          }),
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          throw new Error(errBody.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith(":")) continue;

            if (trimmed.startsWith("data: ")) {
              const dataStr = trimmed.slice(6).trim();
              if (dataStr === "[DONE]") {
                onComplete();
                return;
              }

              try {
                const parsed = JSON.parse(dataStr);
                const token = parsed.choices?.[0]?.delta?.content;
                if (token) {
                  hasReceivedToken = true;
                  onToken(token);
                }
              } catch {
                // ignore invalid chunk
              }
            }
          }
        }

        onComplete();
        return;
      } catch (err) {
        lastError = err;
        console.warn(`[GrokProvider] Model ${model} failed: ${err.message}`);

        if (hasReceivedToken) {
          break;
        }
      }
    }

    onError(lastError || new Error("Grok stream failed."));
  }
}

export const grokProvider = new GrokProvider();

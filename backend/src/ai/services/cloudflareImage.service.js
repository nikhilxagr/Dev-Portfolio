import { env } from "../../config/env.js";
import {
  getImageModelByKey,
  DEFAULT_IMAGE_MODEL_KEY,
} from "./imageModelRegistry.js";

const REQUEST_TIMEOUT_MS = 55000;

export class CloudflareImageService {
  isConfigured() {
    return Boolean(env.cloudflareAccountId && env.cloudflareApiToken);
  }

  async generateImage({ prompt, modelKey = DEFAULT_IMAGE_MODEL_KEY }) {
    if (!this.isConfigured()) {
      throw new Error(
        "Cloudflare Workers AI credentials are not configured on the server. Please set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN in backend environment."
      );
    }

    const trimmedPrompt = String(prompt || "").trim();
    if (!trimmedPrompt) {
      throw new Error("Prompt is required for image generation.");
    }

    if (trimmedPrompt.length > 500) {
      throw new Error("Prompt must be 500 characters or fewer.");
    }

    // Validate model against registry
    const modelConfig = getImageModelByKey(modelKey);
    if (!modelConfig) {
      throw new Error(
        `Invalid image model "${modelKey}". Please select a model from the allowed model list.`
      );
    }

    if (!modelConfig.enabled) {
      throw new Error(
        `Model "${modelConfig.name}" is currently disabled. Please select another model.`
      );
    }

    const url = `https://api.cloudflare.com/client/v4/accounts/${env.cloudflareAccountId}/ai/run/${modelConfig.cloudflareModelId}`;

    const headers = {
      Authorization: `Bearer ${env.cloudflareApiToken}`,
    };

    let body;

    if (modelConfig.requestFormat === "multipart") {
      const form = new FormData();
      form.append("prompt", trimmedPrompt);
      if (modelConfig.defaultParams?.steps) {
        form.append("steps", String(modelConfig.defaultParams.steps));
      }
      if (modelConfig.defaultParams?.width) {
        form.append("width", String(modelConfig.defaultParams.width));
      }
      if (modelConfig.defaultParams?.height) {
        form.append("height", String(modelConfig.defaultParams.height));
      }
      body = form;
    } else if (modelConfig.requestFormat === "json") {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify({
        prompt: trimmedPrompt,
        steps: modelConfig.defaultParams?.steps || 4,
      });
    } else if (modelConfig.requestFormat === "json-leonardo") {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify({
        prompt: trimmedPrompt,
        width: modelConfig.defaultParams?.width || 1024,
        height: modelConfig.defaultParams?.height || 1024,
        num_steps: modelConfig.defaultParams?.num_steps || 25,
        guidance: modelConfig.defaultParams?.guidance || 2.0,
      });
    } else {
      // Default to JSON
      headers["Content-Type"] = "application/json";
      body = JSON.stringify({ prompt: trimmedPrompt });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      console.log(
        `[CloudflareImageService] Generating image with ${modelConfig.name} (${modelConfig.cloudflareModelId})...`
      );
      const startTime = Date.now();

      const response = await fetch(url, {
        method: "POST",
        headers,
        body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const durationMs = Date.now() - startTime;
      console.log(
        `[CloudflareImageService] Cloudflare response: ${response.status} in ${durationMs}ms`
      );

      if (!response.ok) {
        let rawError = "";
        let errorCode = null;

        try {
          const errorJson = await response.json();
          if (Array.isArray(errorJson?.errors) && errorJson.errors.length > 0) {
            rawError = errorJson.errors.map((e) => e.message || e.code).join(", ");
            errorCode = errorJson.errors[0]?.code;
          } else if (errorJson?.messages?.length > 0) {
            rawError = errorJson.messages.join(", ");
          }
        } catch {
          rawError = await response.text().catch(() => "");
        }

        // Sanitize error message to prevent leaking tokens
        let sanitized = (rawError || `Status ${response.status}`).replace(
          new RegExp(env.cloudflareApiToken, "gi"),
          "[REDACTED]"
        );

        // Detect Cloudflare's 10,000 daily free neuron limit
        if (
          errorCode === 4006 ||
          sanitized.includes("10,000 neurons") ||
          sanitized.includes("daily free allocation")
        ) {
          throw new Error(
            "Cloudflare Workers AI daily free allocation (10,000 neurons) has been reached for today. Free quota resets automatically at midnight UTC."
          );
        }

        if (response.status === 429) {
          throw new Error(
            "Cloudflare Workers AI rate limit reached. Please wait a moment and try again."
          );
        }

        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "Cloudflare authentication failed. Please verify API token permissions."
          );
        }

        throw new Error(`Cloudflare AI generation failed: ${sanitized}`);
      }

      const contentType = response.headers.get("content-type") || "";

      // Format A: JSON with base64 image string
      if (contentType.includes("application/json")) {
        const json = await response.json();
        const rawBase64 = json?.result?.image;

        if (!rawBase64) {
          throw new Error("Cloudflare response did not contain image data.");
        }

        const dataUrl = rawBase64.startsWith("data:")
          ? rawBase64
          : `data:image/jpeg;base64,${rawBase64}`;

        return {
          success: true,
          model: {
            key: modelConfig.key,
            name: modelConfig.name,
            displayName: modelConfig.displayName,
            badge: modelConfig.badge,
          },
          prompt: trimmedPrompt,
          dataUrl,
          durationMs,
        };
      }

      // Format B: Direct binary image stream
      const arrayBuffer = await response.arrayBuffer();
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error("Received empty image data from Cloudflare.");
      }

      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const mimeType = contentType.startsWith("image/")
        ? contentType
        : "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${base64}`;

      return {
        success: true,
        model: {
          key: modelConfig.key,
          name: modelConfig.name,
          displayName: modelConfig.displayName,
          badge: modelConfig.badge,
        },
        prompt: trimmedPrompt,
        dataUrl,
        durationMs,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        throw new Error(
          "Image generation timed out after 55 seconds. Cloudflare servers may be under heavy load."
        );
      }

      console.error(`[CloudflareImageService] Error: ${error.message}`);
      throw error;
    }
  }
}

export const cloudflareImageService = new CloudflareImageService();

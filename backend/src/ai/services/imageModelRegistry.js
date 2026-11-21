/**
 * Centralized Image Generation Model Registry for Cloudflare Workers AI
 * Defines allowed models, parameters, request formats, and user-facing metadata.
 */

export const IMAGE_MODELS = {
  "flux-1-schnell": {
    key: "flux-1-schnell",
    name: "FLUX.1 Schnell",
    displayName: "FLUX.1 Schnell — Fast",
    cloudflareModelId: "@cf/black-forest-labs/flux-1-schnell",
    description: "Fast image generation for quick ideas and iterations.",
    badge: "Fast",
    category: "Fast",
    enabled: true,
    isDefault: false,
    requestFormat: "json",
    defaultParams: {
      steps: 4,
    },
    maxSteps: 8,
  },
  "flux-2-klein-4b": {
    key: "flux-2-klein-4b",
    name: "FLUX.2 Klein 4B",
    displayName: "FLUX.2 Klein 4B — Balanced",
    cloudflareModelId: "@cf/black-forest-labs/flux-2-klein-4b",
    description: "Balanced image generation with quality and speed.",
    badge: "Balanced",
    category: "Balanced",
    enabled: true,
    isDefault: false,
    requestFormat: "multipart",
    defaultParams: {
      steps: 20,
      width: 1024,
      height: 1024,
    },
    maxSteps: 30,
  },
  "flux-2-dev": {
    key: "flux-2-dev",
    name: "FLUX.2-dev",
    displayName: "FLUX.2-dev — High Detail",
    cloudflareModelId: "@cf/black-forest-labs/flux-2-dev",
    description: "Detailed image generation for complex prompts.",
    badge: "High Detail",
    category: "High Detail",
    enabled: true,
    isDefault: true,
    requestFormat: "multipart",
    defaultParams: {
      steps: 25,
      width: 1024,
      height: 1024,
    },
    maxSteps: 30,
  },
  "flux-2-klein-9b": {
    key: "flux-2-klein-9b",
    name: "FLUX.2 Klein 9B",
    displayName: "FLUX.2 Klein 9B — Advanced",
    cloudflareModelId: "@cf/black-forest-labs/flux-2-klein-9b",
    description: "Advanced generation with higher-quality output.",
    badge: "Advanced",
    category: "Advanced",
    enabled: true,
    isDefault: false,
    requestFormat: "multipart",
    defaultParams: {
      steps: 25,
      width: 1024,
      height: 1024,
    },
    maxSteps: 30,
  },
  "leonardo-phoenix": {
    key: "leonardo-phoenix",
    name: "Leonardo Phoenix",
    displayName: "Leonardo Phoenix — Artistic",
    cloudflareModelId: "@cf/leonardo/phoenix-1.0",
    description: "Artistic image generation for creative styles.",
    badge: "Artistic",
    category: "Artistic",
    enabled: true,
    isDefault: false,
    requestFormat: "json-leonardo",
    defaultParams: {
      num_steps: 25,
      guidance: 2.0,
      width: 1024,
      height: 1024,
    },
    maxSteps: 50,
  },
  "leonardo-lucid": {
    key: "leonardo-lucid",
    name: "Leonardo Lucid Origin",
    displayName: "Leonardo Lucid — Creative",
    cloudflareModelId: "@cf/leonardo/lucid-origin",
    description: "Creative and cinematic image generation.",
    badge: "Creative",
    category: "Creative",
    enabled: true,
    isDefault: false,
    requestFormat: "json-leonardo",
    defaultParams: {
      num_steps: 25,
      guidance: 4.5,
      width: 1024,
      height: 1024,
    },
    maxSteps: 40,
  },
};

export const DEFAULT_IMAGE_MODEL_KEY = "flux-2-dev";

/**
 * Get internal model definition by key
 */
export const getImageModelByKey = (key) => {
  if (!key || typeof key !== "string") return null;
  const normalizedKey = key.trim().toLowerCase();
  return IMAGE_MODELS[normalizedKey] || null;
};

/**
 * Get public list of models for frontend consumption (without sensitive Cloudflare IDs)
 */
export const getPublicImageModelsList = () => {
  return Object.values(IMAGE_MODELS).map((m) => ({
    key: m.key,
    name: m.name,
    displayName: m.displayName,
    description: m.description,
    badge: m.badge,
    category: m.category,
    enabled: m.enabled,
    isDefault: m.isDefault,
  }));
};

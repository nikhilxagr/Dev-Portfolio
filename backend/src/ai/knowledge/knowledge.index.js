const knowledgeStore = new Map();

export const getAllKnowledge = () => {
  const ORDERED_TOPICS = [
    "personality",
    "about",
    "resume",
    "projects",
    "skills",
    "journey",
    "experience",
    "certificates",
    "blogs",
    "faq",
    "services",
  ];

  const result = [];

  for (const topic of ORDERED_TOPICS) {
    if (knowledgeStore.has(topic)) {
      result.push({ topic, content: knowledgeStore.get(topic) });
    }
  }

  for (const [topic, content] of knowledgeStore) {
    if (!ORDERED_TOPICS.includes(topic)) {
      result.push({ topic, content });
    }
  }

  return result;
};

export const getKnowledge = (topic) => knowledgeStore.get(topic) ?? null;

export const setKnowledge = (topic, content) => {
  knowledgeStore.set(topic, content);
};

export const isKnowledgeReady = () => knowledgeStore.size > 0;

export const getKnowledgeStats = () => {
  const topics = [...knowledgeStore.keys()];
  const totalBytes = [...knowledgeStore.values()].reduce(
    (sum, content) => sum + Buffer.byteLength(content, "utf8"),
    0,
  );
  return { topicCount: topics.length, topics, totalBytes };
};

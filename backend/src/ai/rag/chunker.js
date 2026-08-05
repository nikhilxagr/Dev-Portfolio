/**
 * Splits knowledge markdown files into small, semantically focused chunks.
 * Each chunk is one standalone piece of knowledge ready for embedding.
 */

const MAX_CHUNK_WORDS = 600; // larger chunks = fewer embedding API calls at startup

/**
 * Splits text on markdown heading boundaries (## and ###) and --- dividers.
 * Falls back to word-count splitting for very large sections.
 */
const splitOnBoundaries = (text) => {
  // Split on --- dividers and ## / ### headings
  const boundaryPattern = /(?=\n---\n|\n## |\n### )/g;
  const sections = text.split(boundaryPattern).map((s) => s.trim()).filter(Boolean);

  const chunks = [];

  for (const section of sections) {
    const wordCount = section.split(/\s+/).length;

    if (wordCount <= MAX_CHUNK_WORDS) {
      chunks.push(section);
    } else {
      // Section too large — split further by sentences/paragraphs
      const subSections = section.split(/\n\n+/).filter(Boolean);
      let buffer = "";

      for (const sub of subSections) {
        const combined = buffer ? buffer + "\n\n" + sub : sub;
        if (combined.split(/\s+/).length <= MAX_CHUNK_WORDS) {
          buffer = combined;
        } else {
          if (buffer) chunks.push(buffer.trim());
          buffer = sub;
        }
      }

      if (buffer.trim()) chunks.push(buffer.trim());
    }
  }

  return chunks.filter((c) => c.length > 30); // drop trivially small chunks
};

/**
 * Chunks a single knowledge topic's content into an array of chunk objects.
 * @param {string} topic - The knowledge topic name (e.g. "projects")
 * @param {string} content - The full markdown content of the file
 * @returns {Array<{ id: string, topic: string, text: string }>}
 */
export const chunkKnowledge = (topic, content) => {
  const sections = splitOnBoundaries(content);

  return sections.map((text, idx) => {
    // Try to derive a meaningful slug from the first heading line
    const firstLine = text.split("\n")[0].replace(/^#+\s*/, "").trim();
    const slug = firstLine
      ? firstLine.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)
      : `chunk-${idx}`;

    return {
      id: `${topic}::${slug}`,
      topic,
      text,
    };
  });
};

/**
 * Chunks all knowledge entries from the knowledge store.
 * @param {Array<{ topic: string, content: string }>} knowledgeEntries
 * @returns {Array<{ id: string, topic: string, text: string }>}
 */
export const chunkAllKnowledge = (knowledgeEntries) => {
  const allChunks = [];

  for (const { topic, content } of knowledgeEntries) {
    const chunks = chunkKnowledge(topic, content);
    allChunks.push(...chunks);
  }

  return allChunks;
};

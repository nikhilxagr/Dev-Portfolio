import { readdir, readFile } from "fs/promises";
import { join, dirname, extname, basename } from "path";
import { fileURLToPath } from "url";
import { setKnowledge, getKnowledgeStats } from "./knowledge.index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KNOWLEDGE_DIR = join(__dirname, "..", "..", "..", "knowledge");

export const loadKnowledge = async () => {
  let files;

  try {
    const entries = await readdir(KNOWLEDGE_DIR, { withFileTypes: true });
    files = entries
      .filter((entry) => entry.isFile() && extname(entry.name) === ".md")
      .map((entry) => entry.name);
  } catch (error) {
    console.error(
      `[KnowledgeLoader] Failed to read knowledge directory at ${KNOWLEDGE_DIR}: ${error.message}`
    );
    return;
  }

  if (files.length === 0) {
    console.warn("[KnowledgeLoader] No .md files found in knowledge directory.");
    return;
  }

  const results = await Promise.allSettled(
    files.map(async (filename) => {
      const topic = basename(filename, ".md");
      const filePath = join(KNOWLEDGE_DIR, filename);
      const content = await readFile(filePath, "utf8");
      setKnowledge(topic, content.trim());
      return topic;
    })
  );

  let successCount = 0;
  for (const result of results) {
    if (result.status === "fulfilled") {
      successCount++;
    } else {
      console.warn(
        `[KnowledgeLoader] Failed to load file: ${result.reason?.message ?? result.reason}`
      );
    }
  }

  const stats = getKnowledgeStats();
  console.log(
    `[KnowledgeLoader] Loaded ${successCount}/${files.length} knowledge files (${(stats.totalBytes / 1024).toFixed(1)} KB).`
  );
};

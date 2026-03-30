import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";

import type {
  BlogPost,
  PageCopyMap,
  Practical,
  Project,
  Service,
  SiteContent,
  StatItem,
} from "@/types/content";

const contentRoot = path.join(process.cwd(), "..", "content");

async function readJsonFile<T>(fileName: string): Promise<T> {
  const filePath = path.join(contentRoot, fileName);
  const fileContents = await fs.readFile(filePath, "utf8");

  return JSON.parse(fileContents) as T;
}

export const getSiteContent = cache(async () => {
  return readJsonFile<SiteContent>("site.json");
});

export const getPageCopy = cache(async () => {
  return readJsonFile<PageCopyMap>("page-copy.json");
});

export const getStats = cache(async () => {
  return readJsonFile<StatItem[]>("stats.json");
});

export const getProjects = cache(async () => {
  return readJsonFile<Project[]>("projects.json");
});

export const getPracticals = cache(async () => {
  return readJsonFile<Practical[]>("practicals.json");
});

export const getServices = cache(async () => {
  return readJsonFile<Service[]>("services.json");
});

export const getBlogs = cache(async () => {
  return readJsonFile<BlogPost[]>("blogs.json");
});

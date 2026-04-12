/* global process */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BLOG_LINKS, SIGNATURE_PROJECTS } from "../src/constants/siteData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteUrlRaw =
  process.env.SITE_URL ||
  process.env.VITE_SITE_URL ||
  "https://nikhilxagr.vercel.app";
const siteUrl = siteUrlRaw.replace(/\/+$/, "");

const publicDir = path.resolve(__dirname, "../public");
const sitemapPath = path.resolve(publicDir, "sitemap.xml");
const robotsPath = path.resolve(publicDir, "robots.txt");

const staticPages = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/skills", changefreq: "monthly", priority: "0.8" },
  { path: "/projects", changefreq: "weekly", priority: "0.9" },
  { path: "/security", changefreq: "weekly", priority: "0.8" },
  { path: "/blog", changefreq: "weekly", priority: "0.9" },
  { path: "/services", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/refund-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  {
    path: "/terms-and-conditions",
    changefreq: "yearly",
    priority: "0.3",
  },
  { path: "/cancellation-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/delivery-policy", changefreq: "yearly", priority: "0.3" },
];

const escapeXml = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const withAbsoluteUrl = (pathname) =>
  `${siteUrl}${pathname === "/" ? "/" : pathname}`;

const buildSitemapEntries = () => {
  const today = new Date().toISOString();

  const blogEntries = BLOG_LINKS.filter((item) => item?.slug).map((blog) => ({
    path: `/blog/${blog.slug}`,
    changefreq: "monthly",
    priority: "0.7",
    lastmod: blog.updatedAt || blog.publishedAt || today,
  }));

  const projectEntries = SIGNATURE_PROJECTS.filter((item) => item?.slug).map(
    (project) => ({
      path: `/projects/${project.slug}`,
      changefreq: "monthly",
      priority: "0.7",
      lastmod: project.updatedAt || project.createdAt || today,
    }),
  );

  const staticEntries = staticPages.map((page) => ({
    ...page,
    lastmod: today,
  }));

  const deduped = new Map();

  [...staticEntries, ...blogEntries, ...projectEntries].forEach((entry) => {
    deduped.set(entry.path, entry);
  });

  return Array.from(deduped.values());
};

const createSitemapXml = (entries) => {
  const nodes = entries
    .map((entry) => {
      const loc = escapeXml(withAbsoluteUrl(entry.path));
      const lastmod = new Date(entry.lastmod).toISOString();

      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${entry.changefreq}</changefreq>`,
        `    <priority>${entry.priority}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    nodes,
    "</urlset>",
    "",
  ].join("\n");
};

const createRobotsTxt = () => {
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /api",
    "Disallow: /payment/success",
    "Disallow: /receipts",
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
  ].join("\n");
};

const run = async () => {
  await mkdir(publicDir, { recursive: true });

  const entries = buildSitemapEntries();
  const sitemapXml = createSitemapXml(entries);
  const robotsTxt = createRobotsTxt();

  await Promise.all([
    writeFile(sitemapPath, sitemapXml, "utf8"),
    writeFile(robotsPath, robotsTxt, "utf8"),
  ]);

  console.log(`[seo] Generated sitemap with ${entries.length} URLs.`);
  console.log("[seo] Generated robots.txt.");
};

run().catch((error) => {
  console.error("[seo] Failed to generate SEO assets:", error);
  process.exit(1);
});

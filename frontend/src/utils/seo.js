import { PERSON_ENTITY, SEO_DEFAULTS } from "@/constants/seoConfig";

const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");

const normalizePath = (pathname = "/") => {
  if (!pathname) {
    return "/";
  }

  return pathname.startsWith("/") ? pathname : `/${pathname}`;
};

const toSchemaArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return value ? [value] : [];
};

export const getSiteUrl = () => {
  const runtimeSiteUrl =
    import.meta.env.VITE_SITE_URL ||
    import.meta.env.SITE_URL ||
    SEO_DEFAULTS.siteUrl;
  return trimTrailingSlash(runtimeSiteUrl);
};

export const buildCanonicalUrl = (pathname = "/") => {
  const siteUrl = getSiteUrl();
  const normalizedPath = normalizePath(pathname);
  const cleanedPath =
    normalizedPath === "/" ? "/" : trimTrailingSlash(normalizedPath);
  return `${siteUrl}${cleanedPath}`;
};

export const toAbsoluteUrl = (pathOrUrl = "") => {
  if (!pathOrUrl) {
    return buildCanonicalUrl("/");
  }

  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return `${getSiteUrl()}${normalizePath(pathOrUrl)}`;
};

export const toMetaDescription = (
  text,
  fallback = SEO_DEFAULTS.defaultDescription,
) => {
  const source = (text || fallback || "").replace(/\s+/g, " ").trim();
  return source.slice(0, 160);
};

const toIsoDate = (value) => {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed.toISOString();
};

export const createPersonSchema = () => {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PERSON_ENTITY.name,
    alternateName: PERSON_ENTITY.alternateName,
    jobTitle: PERSON_ENTITY.jobTitle,
    description: PERSON_ENTITY.description,
    email: PERSON_ENTITY.email,
    telephone: PERSON_ENTITY.telephone,
    url: siteUrl,
    image: toAbsoluteUrl(SEO_DEFAULTS.defaultImage),
    knowsAbout: [
      "Full Stack Development",
      "Web Security",
      "Cybersecurity Labs",
      "MERN Stack",
      "Node.js",
      "React",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: PERSON_ENTITY.alumniOf,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: PERSON_ENTITY.addressLocality,
      addressRegion: PERSON_ENTITY.addressRegion,
      addressCountry: PERSON_ENTITY.addressCountry,
    },
    sameAs: PERSON_ENTITY.sameAs,
  };
};

export const createWebSiteSchema = () => {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SEO_DEFAULTS.siteTitle,
    alternateName: SEO_DEFAULTS.brandName,
    url: siteUrl,
    inLanguage: "en-IN",
    publisher: {
      "@type": "Person",
      name: PERSON_ENTITY.name,
    },
  };
};

export const createBreadcrumbSchema = (items = []) => {
  const cleanedItems = items.filter((item) => item?.name && item?.path);

  if (cleanedItems.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: cleanedItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildCanonicalUrl(item.path),
    })),
  };
};

export const createItemListSchema = ({
  name,
  description,
  path,
  items = [],
}) => {
  const entries = items
    .filter((item) => item?.name && item?.path)
    .map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: buildCanonicalUrl(item.path),
    }));

  if (entries.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    url: buildCanonicalUrl(path),
    itemListElement: entries,
  };
};

export const createBlogPostingSchema = (blog, pathname) => {
  if (!blog?.title) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: toMetaDescription(
      blog.excerpt || blog.subtitle || blog.content,
    ),
    image: [toAbsoluteUrl(blog.imageUrl || SEO_DEFAULTS.defaultImage)],
    datePublished: toIsoDate(blog.publishedAt || blog.createdAt),
    dateModified: toIsoDate(
      blog.updatedAt || blog.publishedAt || blog.createdAt,
    ),
    author: {
      "@type": "Person",
      name: PERSON_ENTITY.name,
    },
    publisher: {
      "@type": "Person",
      name: PERSON_ENTITY.name,
      logo: {
        "@type": "ImageObject",
        url: toAbsoluteUrl(SEO_DEFAULTS.defaultImage),
      },
    },
    keywords: Array.isArray(blog.tags) ? blog.tags.join(", ") : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": buildCanonicalUrl(pathname),
    },
  };
};

export const createProjectSchema = (project, pathname) => {
  if (!project?.title) {
    return null;
  }

  const schemaType = project.githubUrl ? "SoftwareSourceCode" : "CreativeWork";

  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: project.title,
    description: toMetaDescription(
      project.description || project.solutionSummary,
    ),
    image: toAbsoluteUrl(project.imageUrl || SEO_DEFAULTS.defaultImage),
    url: buildCanonicalUrl(pathname),
    keywords: Array.isArray(project.techStack)
      ? project.techStack.join(", ")
      : undefined,
    programmingLanguage: Array.isArray(project.techStack)
      ? project.techStack.slice(0, 8)
      : undefined,
    codeRepository: project.githubUrl || undefined,
    creator: {
      "@type": "Person",
      name: PERSON_ENTITY.name,
    },
  };
};

export const normalizeJsonLd = (jsonLd) => toSchemaArray(jsonLd);

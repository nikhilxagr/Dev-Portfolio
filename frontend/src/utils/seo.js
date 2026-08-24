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
    alternateName: [PERSON_ENTITY.alternateName, "Nikhil Agrahari Lucknow", "Nikhil Agrahari Prayagraj"],
    jobTitle: PERSON_ENTITY.jobTitle,
    description: PERSON_ENTITY.description,
    email: PERSON_ENTITY.email,
    telephone: PERSON_ENTITY.telephone,
    url: siteUrl,
    image: toAbsoluteUrl(SEO_DEFAULTS.defaultImage),
    areaServed: [
      { "@type": "AdministrativeArea", name: "Lucknow" },
      { "@type": "AdministrativeArea", name: "Prayagraj" },
      { "@type": "AdministrativeArea", name: "Uttar Pradesh" },
      { "@type": "Country", name: "India" },
    ],
    knowsAbout: [
      "Full Stack Web Development",
      "MERN Stack (MongoDB, Express, React, Node.js)",
      "Best Web Development in Lucknow",
      "Best Web Development in Prayagraj",
      "Application Security & AppSec",
      "Secure Coding & Penetration Testing",
      "AI Web Integration & Automation",
      "RESTful API & GraphQL Design",
      "Tailwind CSS & Modern UI/UX",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: PERSON_ENTITY.alumniOf,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lucknow",
        addressRegion: "Uttar Pradesh",
        addressCountry: "India",
      },
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

export const createProfessionalServiceSchema = () => {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Nikhil Agrahari - Best Full Stack Developer in Lucknow & Prayagraj",
    image: toAbsoluteUrl(SEO_DEFAULTS.defaultImage),
    url: siteUrl,
    telephone: PERSON_ENTITY.telephone,
    email: PERSON_ENTITY.email,
    priceRange: "$$",
    description:
      "Premier Full Stack & MERN Stack Web Development Services in Lucknow and Prayagraj. Offering high-performance web applications, custom API integration, cybersecurity auditing, and AI software engineering.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lucknow",
      addressRegion: "Uttar Pradesh",
      addressCountry: "India",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 26.8467,
      longitude: 80.9462,
    },
    areaServed: [
      { "@type": "City", name: "Lucknow" },
      { "@type": "City", name: "Prayagraj" },
      { "@type": "State", name: "Uttar Pradesh" },
      { "@type": "Country", name: "India" },
    ],
    knowsLanguage: ["English", "Hindi"],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "21:00",
    },
  };
};

export const createWebSiteSchema = () => {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SEO_DEFAULTS.siteTitle,
    alternateName: [
      "Nikhil Agrahari Projects",
      "Nikhil Agrahari Portfolio",
      "Nikhil Projects",
      "Nikhil Portfolio",
      "Best Full Stack Developer Lucknow",
      "Best Full Stack Developer Prayagraj",
    ],
    url: siteUrl,
    inLanguage: "en-IN",
    publisher: {
      "@type": "Person",
      name: PERSON_ENTITY.name,
    },
  };
};

export const createSiteNavigationSchema = () => {
  const siteUrl = getSiteUrl();

  const navItems = [
    {
      name: "Projects & Production Case Studies",
      url: `${siteUrl}/projects`,
      description: "Full stack MERN applications, AI tools & web engineering case studies by Nikhil Agrahari",
    },
    {
      name: "Engineering Skills & Taxonomy",
      url: `${siteUrl}/skills`,
      description: "Frontend, backend, cybersecurity, databases & tools taxonomy of Nikhil Agrahari",
    },
    {
      name: "About Nikhil Agrahari",
      url: `${siteUrl}/about`,
      description: "Full stack developer background, education at BBD University & software engineering bio",
    },
    {
      name: "Hackathons & Milestones",
      url: `${siteUrl}/journey`,
      description: "Hackathons, Nerds Hack Days, awards, certifications & education milestones",
    },
    {
      name: "Developer Blog",
      url: `${siteUrl}/blog`,
      description: "Articles on full stack web development, system architecture & security",
    },
    {
      name: "Contact Nikhil Agrahari",
      url: `${siteUrl}/contact`,
      description: "Direct contact, freelance inquiries & project collaboration",
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Site Navigation Elements",
    description: "Main site navigation sections for Nikhil Agrahari Portfolio",
    itemListElement: navItems.map((item, index) => ({
      "@type": "SiteNavigationElement",
      position: index + 1,
      name: item.name,
      description: item.description,
      url: item.url,
    })),
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

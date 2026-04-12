import { Helmet } from "react-helmet-async";
import { SEO_DEFAULTS, SEO_TARGET_KEYWORDS } from "@/constants/seoConfig";
import {
  buildCanonicalUrl,
  normalizeJsonLd,
  toAbsoluteUrl,
  toMetaDescription,
} from "@/utils/seo";

const formatTitle = (title, noTitleSuffix = false) => {
  if (!title) {
    return SEO_DEFAULTS.siteTitle;
  }

  if (
    noTitleSuffix ||
    title.toLowerCase().includes(SEO_DEFAULTS.brandName.toLowerCase())
  ) {
    return title;
  }

  return `${title} | ${SEO_DEFAULTS.brandName}`;
};

const buildKeywordContent = (keywords = []) => {
  const merged = Array.from(
    new Set([...SEO_TARGET_KEYWORDS, ...keywords].filter(Boolean)),
  );
  return merged.join(", ");
};

const SeoHead = ({
  title,
  description,
  pathname = "/",
  canonicalUrl,
  image,
  imageAlt,
  type = "website",
  robots = SEO_DEFAULTS.defaultRobots,
  keywords = [],
  jsonLd,
  publishedTime,
  modifiedTime,
  noTitleSuffix = false,
}) => {
  const canonical = canonicalUrl || buildCanonicalUrl(pathname);
  const metaTitle = formatTitle(title, noTitleSuffix);
  const metaDescription = toMetaDescription(description);
  const socialImage = toAbsoluteUrl(image || SEO_DEFAULTS.defaultImage);
  const socialImageAlt = imageAlt || SEO_DEFAULTS.defaultImageAlt;
  const keywordContent = buildKeywordContent(keywords);
  const schemas = normalizeJsonLd(jsonLd);

  return (
    <Helmet prioritizeSeoTags>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="robots" content={robots} />
      <meta name="author" content={SEO_DEFAULTS.author} />
      <meta name="keywords" content={keywordContent} />
      <meta name="geo.placename" content={SEO_DEFAULTS.locationLabel} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SEO_DEFAULTS.twitterHandle} />
      <meta name="twitter:creator" content={SEO_DEFAULTS.twitterHandle} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={socialImage} />
      <meta name="twitter:image:alt" content={socialImageAlt} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SEO_DEFAULTS.siteTitle} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={socialImage} />
      <meta property="og:image:alt" content={socialImageAlt} />
      <meta property="og:locale" content={SEO_DEFAULTS.locale} />
      <link rel="canonical" href={canonical} />
      {publishedTime ? (
        <meta property="article:published_time" content={publishedTime} />
      ) : null}
      {modifiedTime ? (
        <meta property="article:modified_time" content={modifiedTime} />
      ) : null}
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SeoHead;

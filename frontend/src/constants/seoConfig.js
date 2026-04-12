import {
  QUICK_CONTACT,
  SITE_PROFILE,
  SOCIAL_LINKS,
} from "@/constants/siteData";

const fallbackSiteUrl = "https://nikhilxagr.vercel.app";

const sameAsLinks = Array.from(
  new Set(
    [
      QUICK_CONTACT.linkedin,
      QUICK_CONTACT.github,
      QUICK_CONTACT.medium,
      QUICK_CONTACT.tryhackme,
      QUICK_CONTACT.leetcode,
      QUICK_CONTACT.gfg,
      ...SOCIAL_LINKS.map((item) => item.href),
    ].filter(Boolean),
  ),
);

export const SEO_TARGET_KEYWORDS = [
  "Nikhil Lucknow",
  "Nikhil BBD",
  "Nikhil Portfolio",
  "Nikhil developer portfolio",
  "Nikhil Agrahari",
  "BBD University developer",
  "Lucknow full stack developer",
  "Lucknow cybersecurity learner",
];

export const SEO_DEFAULTS = {
  siteUrl: fallbackSiteUrl,
  brandName: "Nikhil Portfolio",
  siteTitle: "Nikhil Agrahari Portfolio",
  defaultDescription:
    "Portfolio of Nikhil Agrahari from Lucknow, featuring full stack projects, cybersecurity practicals, and technical writing.",
  defaultImage:
    SITE_PROFILE.profileImage || "/images/profile/nikhil-upload-hero.webp",
  defaultImageAlt:
    SITE_PROFILE.profileImageAlt || "Nikhil Agrahari profile photo",
  defaultRobots: "index, follow",
  locale: "en_IN",
  author: SITE_PROFILE.fullName,
  twitterHandle: "@nikhilxagr",
  locationLabel: "Lucknow, Uttar Pradesh, India",
};

export const PERSON_ENTITY = {
  name: SITE_PROFILE.fullName,
  alternateName: SITE_PROFILE.shortName,
  jobTitle: "Full Stack Developer and Cybersecurity Learner",
  description: SITE_PROFILE.shortIntro,
  email: QUICK_CONTACT.email,
  telephone: QUICK_CONTACT.phone,
  addressLocality: "Lucknow",
  addressRegion: "Uttar Pradesh",
  addressCountry: "India",
  alumniOf: "BBD University",
  sameAs: sameAsLinks,
};

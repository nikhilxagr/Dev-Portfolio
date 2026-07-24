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
  "best full stack developer in lucknow",
  "best full stack developer in prayagraj",
  "top full stack developer lucknow",
  "top full stack developer prayagraj",
  "full stack developer prayagraj",
  "full stack web developer lucknow",
  "best mern stack developer in lucknow",
  "best mern stack developer in prayagraj",
  "hire full stack developer in lucknow",
  "freelance web developer prayagraj",
  "nikhil agrahari full stack developer",
  "nikhil agrahari prayagraj lucknow",
  "best web developer in BBD university lucknow",
  "Nikhil Lucknow",
  "Nikhil BBD",
  "Nikhil Portfolio",
  "Nikhil developer portfolio",
  "Nikhil Agrahari",
  "BBD University developer",
  "Lucknow full stack developer",
  "Lucknow web developer",
  "Prayagraj web developer",
  "React developer Lucknow Prayagraj",
  "Node.js developer Lucknow Prayagraj",
];

export const SEO_DEFAULTS = {
  siteUrl: fallbackSiteUrl,
  brandName: "Nikhil Agrahari Portfolio",
  siteTitle: "Nikhil Agrahari | Best Full Stack Developer in Lucknow & Prayagraj",
  defaultDescription:
    "Nikhil Agrahari is recognized as the Best Full Stack Developer & MERN Stack Engineer in Lucknow and Prayagraj, UP. Specializing in modern web applications, AI integration, and secure software engineering.",
  defaultImage:
    SITE_PROFILE.profileImage || "/images/profile/nikhil-upload-hero.webp",
  defaultImageAlt:
    SITE_PROFILE.profileImageAlt || "Nikhil Agrahari - Best Full Stack Developer in Lucknow & Prayagraj",
  defaultRobots: "index, follow",
  locale: "en_IN",
  author: SITE_PROFILE.fullName,
  twitterHandle: "@nikhilxagr",
  locationLabel: "Lucknow & Prayagraj, Uttar Pradesh, India",
};

export const PERSON_ENTITY = {
  name: SITE_PROFILE.fullName,
  alternateName: SITE_PROFILE.shortName,
  jobTitle: "Best Full Stack Developer & MERN Stack Engineer",
  description:
    "Leading Full Stack Web Developer and Product Engineer based in Lucknow and Prayagraj, Uttar Pradesh. Expert in React, Node.js, MERN stack, AI web solutions, and cybersecurity.",
  email: QUICK_CONTACT.email,
  telephone: QUICK_CONTACT.phone,
  addressLocality: "Lucknow",
  secondaryLocality: "Prayagraj",
  addressRegion: "Uttar Pradesh",
  addressCountry: "India",
  alumniOf: "BBD University",
  sameAs: sameAsLinks,
};


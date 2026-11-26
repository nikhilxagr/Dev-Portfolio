import {
  QUICK_CONTACT,
  SITE_PROFILE,
  SOCIAL_LINKS,
} from "@/constants/siteData";

const fallbackSiteUrl = "https://nikhilxagr.vercel.app";

const sameAsLinks = Array.from(
  new Set(
    [
      "https://github.com/nikhilxagr",
      "https://www.linkedin.com/in/nikhilxagr/",
      "https://medium.com/@nikhilxagr",
      "https://tryhackme.com/p/nikhilxagr",
      "https://leetcode.com/u/nikhilxagr/",
      "https://www.geeksforgeeks.org/profile/nikhilxagr?tab=activity",
      "https://www.instagram.com/nikhilxagr/",
      QUICK_CONTACT.linkedin,
      QUICK_CONTACT.github,
      QUICK_CONTACT.medium,
      QUICK_CONTACT.tryhackme,
      QUICK_CONTACT.leetcode,
      QUICK_CONTACT.gfg,
      ...SOCIAL_LINKS.map((item) => item.href),
    ].filter((link) => link && /^https?:\/\//i.test(link)),
  ),
);

export const SEO_TARGET_KEYWORDS = [
  "nikhil agrahari",
  "nikhil agrahari projects",
  "nikhil agrahari project",
  "nikhil projects",
  "nikhil project",
  "nikhil agrahari github",
  "nikhilxagr github",
  "nikhil agrahari linkedin",
  "nikhilxagr linkedin",
  "nikhil bbdu",
  "nikhil bbd",
  "nikhil portfolio",
  "nikhil agrahari portfolio",
  "nikhil agrahari developer portfolio",
  "nikhil agrahari @nikhilxagr",
  "nikhil agrahari bbd university lucknow",
  "nikhil agrahari case studies",
  "nikhil agrahari vistagram",
  "nikhil agrahari kanoon mate",
  "nikhil agrahari fast feast",
  "nikhil agrahari snapurl",
  "full stack developer lucknow",
  "full stack developer prayagraj",
  "mern stack developer lucknow",
  "mern stack engineer prayagraj",
  "freelance web developer prayagraj",
  "nikhil agrahari full stack developer",
  "nikhil agrahari prayagraj lucknow",
  "Nikhil Lucknow",
  "Nikhil BBD",
  "Nikhil Portfolio",
  "Nikhil developer portfolio",
  "Nikhil Agrahari",
  "BBD University developer",
  "React developer Lucknow Prayagraj",
  "Node.js developer Lucknow Prayagraj",
  "application security portfolio",
];

export const SEO_DEFAULTS = {
  siteUrl: fallbackSiteUrl,
  brandName: "Nikhil Agrahari Portfolio",
  siteTitle: "Nikhil Agrahari | Full-Stack Software Engineer (MERN & AppSec)",
  defaultDescription:
    "Nikhil Agrahari (@nikhilxagr) is a Full-Stack Engineer and BCA student at BBD University (Lucknow & Prayagraj), building web applications with React, Node.js, Express, and MongoDB alongside application security labs.",
  defaultImage:
    SITE_PROFILE.profileImage || "/images/profile/nikhil-upload-hero.webp",
  defaultImageAlt:
    SITE_PROFILE.profileImageAlt || "Nikhil Agrahari — Full-Stack Software Engineer",
  defaultRobots: "index, follow",
  locale: "en_IN",
  author: SITE_PROFILE.fullName,
  twitterHandle: "@nikhilxagr",
  locationLabel: "Lucknow & Prayagraj, Uttar Pradesh, India",
};

export const PERSON_ENTITY = {
  name: SITE_PROFILE.fullName,
  alternateName: [
    "nikhilxagr",
    "Nikhil",
    "Nikhil BBDU",
    "Nikhil BBD",
    "Nikhil Portfolio",
    "Nikhil Agrahari Lucknow",
    "Nikhil Agrahari Prayagraj",
    "Nikhil Agrahari BBD University",
  ],
  jobTitle: "Full-Stack Software Engineer (MERN & AppSec)",
  description:
    "Developer portfolio of Nikhil Agrahari (@nikhilxagr) — Full-Stack Software Engineer (React, Node.js, Express, MongoDB) and BBD University BCA student based in Lucknow & Prayagraj.",
  email: QUICK_CONTACT.email,
  telephone: QUICK_CONTACT.phone,
  addressLocality: "Lucknow",
  secondaryLocality: "Prayagraj",
  addressRegion: "Uttar Pradesh",
  addressCountry: "India",
  alumniOf: "BBD University",
  sameAs: sameAsLinks,
};


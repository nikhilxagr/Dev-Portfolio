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
  "best full stack developer in lucknow",
  "best full stack developer in prayagraj",
  "top full stack developer lucknow",
  "top mern stack developer lucknow",
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
    "Nikhil Agrahari (@nikhilxagr) is the Best Full Stack Developer & MERN Stack Engineer in Lucknow and Prayagraj, UP. BCA student at BBD University. Explore GitHub repos, LinkedIn, portfolio projects, and security tools.",
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
  jobTitle: "Best Full Stack Developer & MERN Stack Engineer",
  description:
    "Official Developer Portfolio & Profiles of Nikhil Agrahari (@nikhilxagr) — Premier Full Stack Web Developer & MERN Engineer from BBD University, Lucknow and Prayagraj.",
  email: QUICK_CONTACT.email,
  telephone: QUICK_CONTACT.phone,
  addressLocality: "Lucknow",
  secondaryLocality: "Prayagraj",
  addressRegion: "Uttar Pradesh",
  addressCountry: "India",
  alumniOf: "BBD University",
  sameAs: sameAsLinks,
};


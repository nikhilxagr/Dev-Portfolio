const getNeutralColor = (isDark) => (isDark ? "ffffff" : "0f172a");

const SKILL_LOGO_MAP = {
  React: { slug: "react", color: "61DAFB" },
  "Next.js": { slug: "nextdotjs", useNeutral: true },
  "Tailwind CSS": { slug: "tailwindcss", color: "06B6D4" },
  JavaScript: { slug: "javascript", color: "F7DF1E" },
  HTML: { slug: "html5", color: "E34F26" },
  CSS: { slug: "css3", color: "1572B6" },
  "Node.js": { slug: "nodedotjs", color: "5FA04E" },
  "Express.js": { slug: "express", useNeutral: true },
  Supabase: { slug: "supabase", color: "3ECF8E" },
  MongoDB: { slug: "mongodb", color: "47A248" },
  "MongoDB Atlas": { slug: "mongodb", color: "47A248" },
  Mongoose: { slug: "mongoose", color: "880000" },
  SQL: { slug: "postgresql", color: "4169E1" },
  "SQL Querying": { slug: "postgresql", color: "4169E1" },
  "Supabase Postgres": { slug: "postgresql", color: "4169E1" },
  Python: { slug: "python", color: "3776AB" },
  C: { slug: "c", color: "A8B9CC" },
  "Kali Linux": { slug: "kalilinux", color: "557C94" },
  Nmap: { slug: "nmap", color: "2D8CFF" },
  "Burp Suite": { slug: "burpsuite", color: "FF7139" },
  Wireshark: { slug: "wireshark", color: "1679A7" },
  Metasploit: { slug: "metasploit", color: "2596CD" },
  Git: { slug: "git", color: "F05032" },
  GitHub: { slug: "github", useNeutral: true },
  Postman: { slug: "postman", color: "FF6C37" },
  Linux: { slug: "linux", useNeutral: true },
  Vercel: { slug: "vercel", useNeutral: true },
  Render: { slug: "render", color: "46E3B7" },
  TryHackMe: { slug: "tryhackme", color: "E11D48" },
  LinkedIn: {
    url: "/images/brand/linkedin.svg",
  },
  LeetCode: { slug: "leetcode", color: "FFA116" },
  GeeksforGeeks: { slug: "geeksforgeeks", color: "2F8D46" },
};

export const getSkillLogoUrl = (skillName, isDark) => {
  const config = SKILL_LOGO_MAP[skillName];

  if (!config) {
    return null;
  }

  if (config.url) {
    return config.url;
  }

  const color = config.useNeutral
    ? getNeutralColor(isDark)
    : config.color || getNeutralColor(isDark);
  return `https://cdn.simpleicons.org/${config.slug}/${color}`;
};

/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Award,
  BookOpen,
  Briefcase,
  Code2,
  Cpu,
  GitBranch,
  Rocket,
  Shield,
  Trophy,
} from "lucide-react";
import {
  ABOUT_STORY,
  FOCUS_AREAS,
  QUICK_CONTACT,
  SITE_PROFILE,
  SKILL_GROUPS,
  STATS_METRICS,
} from "@/constants/siteData";
import { SERVICE_OFFERINGS } from "@/data/servicesData";
import { journeyData as STATIC_JOURNEY_DATA } from "@/data/journeyData";
import { getSiteContent } from "@/services/siteContent.service";
import { getJourneyEntries } from "@/services/journey.service";

const CMS_CHANNEL_NAME = "portfolio_cms_sync";

const JOURNEY_CATEGORY_ICONS = {
  "Academic Programs": BookOpen,
  "Open Source": GitBranch,
  Certifications: Award,
  Internships: Briefcase,
  Workshops: Cpu,
  "Startup Events": Rocket,
  Hackathons: Trophy,
  Achievements: Shield,
  Projects: Code2,
};

export const DEFAULT_SITE_SECTIONS = {
  profile: {
    brandName: SITE_PROFILE.brandName || "Nikhil",
    fullName: SITE_PROFILE.fullName || "Nikhil Agrahari",
    headlineFirst: "Nikhil",
    headlineAccent: "Agrahari",
    roleTitle: SITE_PROFILE.roleTitle || "Full-Stack Developer & Security Researcher",
    educationLine: "BCA at BBDU Lucknow, India",
    location: SITE_PROFILE.location || "Lucknow, Uttar Pradesh, India",
    welcomeBadge: "Welcome to my portfolio",
    availabilityPill: "Open for Internships & Freelance",
    availableBadge: "Available",
    introText: SITE_PROFILE.intro || "",
    profileImage: SITE_PROFILE.profileImage || "/images/profile/nikhil-upload-hero.png",
    resumeFullStack: QUICK_CONTACT.resumeFullStack || "/images/resume/WebDev_Resume.pdf",
    resumeSecurity: QUICK_CONTACT.resumeSecurity || "/images/resume/CyberSecurity_Resume.pdf",
    bannerEnabled: true,
    bannerTitle: "Open to opportunities",
    bannerSubtitle: "Internships, freelance and collaborations",
    bannerCta: "Let's talk",
    footerBio:
      "Full-stack developer and application security practitioner focused on clean architecture, tested APIs, and dependable delivery.",
    footerRoleLine: "Full-Stack Developer & Security Researcher",
  },
  about: {
    heroBadge: "Engineering Identity & Background",
    heroHeadline: "About &",
    heroAccent: "Background",
    heroBio:
      "Third-year BCA student at Babu Banarasi Das University, Lucknow and Full-Stack Developer focused on MERN architectures, real-time messaging, and application security.",
    storyParagraphs: ABOUT_STORY,
    focusAreas: FOCUS_AREAS,
  },
  skills: {
    heroHeadline: "Skills &",
    heroAccent: "Technical Stack",
    heroBio:
      "Production tools, frameworks, databases, and offensive/defensive security utilities used across shipped applications and lab environments.",
    skillGroups: SKILL_GROUPS,
  },
  contact: {
    email: QUICK_CONTACT.email,
    billingEmail: QUICK_CONTACT.billingEmail,
    supportEmail: QUICK_CONTACT.supportEmail,
    phone: QUICK_CONTACT.phone,
    whatsapp: QUICK_CONTACT.whatsapp,
    instagram: QUICK_CONTACT.instagram,
    linkedin: QUICK_CONTACT.linkedin,
    github: QUICK_CONTACT.github,
    leetcode: QUICK_CONTACT.leetcode,
    gfg: QUICK_CONTACT.gfg,
    tryhackme: QUICK_CONTACT.tryhackme,
    medium: QUICK_CONTACT.medium,
    location: SITE_PROFILE.location || "Lucknow, Uttar Pradesh, India",
    responseSla: "Within 12-24h",
  },
  services: {
    heroHeadline: "Services &",
    heroAccent: "Packages",
    heroBio:
      "Transparent deliverables, clear turnaround times, and secure checkout built for founders, teams, and individuals who want reliable technical execution.",
    offerings: SERVICE_OFFERINGS,
  },
};

const mergeJourneyList = (staticItems, dbItems = []) => {
  if (!Array.isArray(dbItems) || dbItems.length === 0) {
    return staticItems;
  }

  const map = new Map();
  staticItems.forEach((item) => {
    map.set(item.id, item);
  });

  dbItems.forEach((doc) => {
    const key = doc.entryId || doc.id || String(doc._id);
    const existing = map.get(key) || {};
    if (doc.status === "draft") {
      map.delete(key);
      return;
    }
    const merged = {
      ...existing,
      ...doc,
      id: key,
      icon:
        existing.icon ||
        JOURNEY_CATEGORY_ICONS[doc.category] ||
        Award,
      details:
        doc.details && Object.keys(doc.details).length > 0
          ? { ...(existing.details || {}), ...doc.details }
          : existing.details,
    };
    map.set(key, merged);
  });

  return Array.from(map.values()).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return String(a.duration || "").localeCompare(String(b.duration || ""));
  });
};

const mergeSectionsWithDefaults = (rawSections = {}) => {
  const merged = {};
  Object.keys(DEFAULT_SITE_SECTIONS).forEach((sectionKey) => {
    const base = DEFAULT_SITE_SECTIONS[sectionKey];
    const override = rawSections?.[sectionKey];
    if (override && typeof override === "object") {
      merged[sectionKey] = { ...base, ...override };
    } else {
      merged[sectionKey] = base;
    }
  });
  return merged;
};

const SiteContentContext = createContext({
  sections: DEFAULT_SITE_SECTIONS,
  profile: DEFAULT_SITE_SECTIONS.profile,
  about: DEFAULT_SITE_SECTIONS.about,
  skills: DEFAULT_SITE_SECTIONS.skills,
  contact: DEFAULT_SITE_SECTIONS.contact,
  services: DEFAULT_SITE_SECTIONS.services,
  statsMetrics: STATS_METRICS,
  journeyItems: STATIC_JOURNEY_DATA,
  loading: false,
  refreshSiteContent: async () => {},
});

export const broadcastSiteContentSync = () => {
  if (typeof window === "undefined") return;
  try {
    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel(CMS_CHANNEL_NAME);
      channel.postMessage({ type: "CMS_UPDATED", at: Date.now() });
      channel.close();
    }
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent("portfolio:cms-updated"));
};

export const SiteContentProvider = ({ children }) => {
  const [sections, setSections] = useState(DEFAULT_SITE_SECTIONS);
  const [journeyItems, setJourneyItems] = useState(STATIC_JOURNEY_DATA);
  const [loading, setLoading] = useState(false);

  const refreshSiteContent = useCallback(async () => {
    setLoading(true);
    try {
      const [siteRes, journeyRes] = await Promise.allSettled([
        getSiteContent(),
        getJourneyEntries(),
      ]);

      if (siteRes.status === "fulfilled" && siteRes.value?.data?.sections) {
        setSections(mergeSectionsWithDefaults(siteRes.value.data.sections));
      }

      if (journeyRes.status === "fulfilled" && Array.isArray(journeyRes.value?.data)) {
        setJourneyItems(mergeJourneyList(STATIC_JOURNEY_DATA, journeyRes.value.data));
      }
    } catch {
      // keep fallback defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSiteContent();

    const handleSyncEvent = () => {
      refreshSiteContent();
    };

    let channel = null;
    if (typeof window !== "undefined") {
      window.addEventListener("portfolio:cms-updated", handleSyncEvent);
      if ("BroadcastChannel" in window) {
        try {
          channel = new BroadcastChannel(CMS_CHANNEL_NAME);
          channel.onmessage = () => refreshSiteContent();
        } catch {
          channel = null;
        }
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("portfolio:cms-updated", handleSyncEvent);
      }
      if (channel) {
        channel.close();
      }
    };
  }, [refreshSiteContent]);

  const value = useMemo(
    () => ({
      sections,
      profile: sections.profile,
      about: sections.about,
      skills: sections.skills,
      contact: sections.contact,
      services: sections.services,
      statsMetrics: STATS_METRICS,
      journeyItems,
      loading,
      refreshSiteContent,
    }),
    [sections, journeyItems, loading, refreshSiteContent],
  );

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => useContext(SiteContentContext);

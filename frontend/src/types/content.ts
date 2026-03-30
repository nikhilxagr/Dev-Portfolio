export type PageKey =
  | "home"
  | "about"
  | "skills"
  | "projects"
  | "practicals"
  | "services"
  | "blog"
  | "contact";

export interface SiteContent {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  headline: string;
  role: string;
  education: string;
  availability: string;
  shortIntro: string;
  about: string[];
  focusAreas: string[];
  location: {
    city: string;
    country: string;
    showPublicly: boolean;
  };
  profileImage: {
    path: string;
    publicPath: string;
    alt: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: {
      label: string;
      href: string;
    };
    secondaryCta: {
      label: string;
      href: string;
    };
  };
  sections?: {
    testimonialsEnabled?: boolean;
  };
  contact: {
    email: string;
    linkedin: string;
    github: string;
    whatsapp: string;
    resume: string;
    medium: string;
  };
}

export interface PageCopy {
  title?: string;
  intro?: string;
  statsTitle?: string;
  projectsTitle?: string;
  practicalsTitle?: string;
  servicesTitle?: string;
  testimonialsTitle?: string;
  contactTitle?: string;
  ethicsNote?: string;
  process?: string[];
}

export type PageCopyMap = Record<PageKey, PageCopy>;

export interface StatItem {
  id: string;
  label: string;
  value: string;
  detail?: string;
  link: string;
  status: string;
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  problem: string;
  outcome: string;
  stack: string[];
  highlights: string[];
  featured: boolean;
  image: string;
  githubUrl: string;
  liveUrl: string | null;
}

export interface Practical {
  slug: string;
  title: string;
  summary: string;
  focus: string;
  tools: string[];
  level: string;
  status: string;
  writeupStatus: string;
  image: string;
}

export interface Service {
  slug: string;
  name: string;
  category: string;
  priceLabel: string;
  pricingModel: string;
  summary: string;
  deliverables: string[];
  turnaround: string;
  paymentMode: string;
  requiresApproval: boolean;
  receiptEnabled: boolean;
  legalNote?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  source: string;
  externalUrl: string;
  excerpt: string;
  status: string;
  featured: boolean;
  tags: string[];
}

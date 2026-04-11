const SERVICE_CATALOG = [
  {
    slug: "mentorship-call",
    name: "1:1 Mentorship",
    amountInr: 99,
    amountPaise: 9900,
    currency: "INR",
  },
  {
    slug: "resume-review-help",
    name: "Resume Review and Help",
    amountInr: 149,
    amountPaise: 14900,
    currency: "INR",
  },
  {
    slug: "portfolio-guidance",
    name: "Portfolio Guidance",
    amountInr: 99,
    amountPaise: 9900,
    currency: "INR",
  },
  {
    slug: "frontend-development",
    name: "Frontend Development",
    amountInr: 1499,
    amountPaise: 149900,
    currency: "INR",
  },
  {
    slug: "backend-development",
    name: "Backend Development",
    amountInr: 1799,
    amountPaise: 179900,
    currency: "INR",
  },
  {
    slug: "full-stack-development",
    name: "Full Stack Development",
    amountInr: 3499,
    amountPaise: 349900,
    currency: "INR",
  },
  {
    slug: "website-security-review",
    name: "Website Security Review",
    amountInr: 4999,
    amountPaise: 499900,
    currency: "INR",
  },
];

const serviceMap = new Map(
  SERVICE_CATALOG.map((service) => [service.slug, service]),
);

export const getServiceBySlug = (slug) => serviceMap.get(slug) || null;

export const getServiceSlugs = () =>
  SERVICE_CATALOG.map((service) => service.slug);

export { SERVICE_CATALOG };

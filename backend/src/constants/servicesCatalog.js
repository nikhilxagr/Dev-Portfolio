const SERVICE_CATALOG = [
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
    slug: "security-software-project",
    name: "Security Software & Project",
    amountInr: 2499,
    amountPaise: 249900,
    currency: "INR",
  },
];

export const SUPPORT_PAYMENT_CONFIG = Object.freeze({
  slug: "support-me",
  name: "Support Contribution",
  currency: "INR",
  minAmountInr: 1,
  maxAmountInr: 50000,
});

const serviceMap = new Map(
  SERVICE_CATALOG.map((service) => [service.slug, service]),
);

export const getServiceBySlug = (slug) => serviceMap.get(slug) || null;

export const getServiceSlugs = () =>
  SERVICE_CATALOG.map((service) => service.slug);

export { SERVICE_CATALOG };

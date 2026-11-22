import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import clsx from "clsx";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  HeartHandshake,
  Zap,
  ChevronDown,
  ChevronUp,
  Lock,
  Code2,
  Clock,
  HelpCircle,
  Monitor,
  Server,
  Layers,
  ShieldAlert,
} from "lucide-react";
import Button from "@/components/ui/Button";
import SeoHead from "@/components/seo/SeoHead";
import PaymentTrustPanel from "@/components/ui/PaymentTrustPanel";

const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;
import {
  createPaymentOrder,
  prewarmBackendForCheckout,
  persistLatestReceipt,
} from "@/services/payment.service";
import { getErrorMessage } from "@/services/api";
import { loadCashfreeCheckout } from "@/utils/loadCashfree";
import { createBreadcrumbSchema } from "@/utils/seo";
import { useUserAuth } from "@/context/UserAuthContext";
import { getGoogleAuthUrl } from "@/services/userAuth.service";
import { SERVICE_OFFERINGS } from "@/data/servicesData";

// # Google Sign‑In Icon
const GoogleIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

const CATEGORY_CONFIG = {
  Frontend: {
    icon: Monitor,
    cardBorder: "border-black/[0.08] dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16]",
    badge: "border-emerald-600/25 bg-emerald-500/[0.08] text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400",
    bullet: "text-emerald-700 dark:text-emerald-400",
    iconBox: "border-black/[0.08] bg-slate-50 text-emerald-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-emerald-400",
  },
  Backend: {
    icon: Server,
    cardBorder: "border-black/[0.08] dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16]",
    badge: "border-black/[0.08] bg-slate-50 text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]",
    bullet: "text-emerald-700 dark:text-emerald-400",
    iconBox: "border-black/[0.08] bg-slate-50 text-emerald-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-emerald-400",
  },
  "Full Stack": {
    icon: Layers,
    cardBorder: "border-black/[0.08] dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16]",
    badge: "border-emerald-600/25 bg-emerald-500/[0.08] text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400",
    bullet: "text-emerald-700 dark:text-emerald-400",
    iconBox: "border-black/[0.08] bg-slate-50 text-emerald-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-emerald-400",
  },
  Security: {
    icon: ShieldAlert,
    cardBorder: "border-black/[0.08] dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16]",
    badge: "border-black/[0.08] bg-slate-50 text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]",
    bullet: "text-emerald-700 dark:text-emerald-400",
    iconBox: "border-black/[0.08] bg-slate-50 text-emerald-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-emerald-400",
  },
};

// # Expanded detail content per service
const SERVICE_DETAILS = {
  "frontend-development": {
    idealFor: "Founders, startups, and creators needing responsive, ultra-fast React or Next.js web applications.",
    engagementModel: "Figma-to-Code / Concept Build + Reusable UI Architecture",
    deliverables: [
      "100% mobile & tablet responsive interface built with React/Next & Tailwind",
      "Ultra-fast page loads with smooth micro-animations & dark mode support",
      "Clean, component-driven codebase with complete Git repository delivery",
    ],
    stack: ["React.js", "Next.js", "Tailwind CSS", "Framer Motion", "Vite"],
  },
  "backend-development": {
    idealFor: "Applications needing secure RESTful APIs, JWT user authentication, and robust database controllers.",
    engagementModel: "Schema Modeling + Controller Logic + Postman API Docs",
    deliverables: [
      "Secure REST API endpoints with input validation & rate limiting",
      "Database schema modeling (MongoDB / PostgreSQL) with error handling",
      "Complete Postman API collection & integration documentation",
    ],
    stack: ["Node.js", "Express.js", "MongoDB", "JWT Auth", "Postman"],
  },
  "full-stack-development": {
    idealFor: "Clients requiring turnkey full-stack web applications from idea to live production deployment.",
    engagementModel: "Full-Cycle Build: Design + Frontend + Backend + Payment Gateway",
    deliverables: [
      "Full-stack MERN / Next.js web application with modern dashboard UI",
      "Payment gateway setup (Razorpay/Cashfree) & role-based authentication",
      "Production deployment on Vercel/Render with SSL & environment config",
    ],
    stack: ["React / Next.js", "Node.js & Express", "MongoDB Atlas", "Payment Gateways", "Vercel / Render"],
  },
  "security-software-project": {
    idealFor: "Founders, enterprises, and developers needing tailored security software, OWASP vulnerability audits, or custom technical project scopes.",
    engagementModel: "Security Discovery + Custom Scope Architecture + Phased Delivery",
    deliverables: [
      "OWASP security architecture review & API defense assessment",
      "Tailored software build or security modules with rate-limiting & auth hardening",
      "Direct 1-on-1 scope discussion, tailored roadmap & complete Git handover",
    ],
    stack: ["Node.js / Express", "React / Next.js", "Python / Fastify", "OWASP Standards", "Burp Suite"],
  },
};

// # FAQ data
const FAQS = [
  {
    q: "How does the payment and booking process work?",
    a: "Select your desired service, click 'Book Now', enter your details, and complete payment via Cashfree's secure 256-bit encrypted gateway (UPI, Cards, NetBanking). You will receive an instant digital receipt and booking confirmation.",
  },
  {
    q: "What happens after I complete my payment?",
    a: "You are automatically redirected to your receipt portal page where you can download your official PDF invoice. Nikhil will reach out directly to your registered email/phone within 2–4 hours to begin onboarding.",
  },
  {
    q: "Can I request a custom scope beyond the listed packages?",
    a: "Yes! If your project requires custom features, custom API integrations, or larger full-stack architecture, click 'Discuss Custom Project' to send a direct message.",
  },
  {
    q: "Is payment safe and eligible for refunds?",
    a: "All payments are processed securely through Cashfree. Every booking comes with transparent terms and a 7-day refund guarantee if work has not commenced according to agreed scope.",
  },
];

// # Main Component
const ServicesPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUserAuth();
  const [activeServiceSlug, setActiveServiceSlug] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [buyerForm, setBuyerForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });
  const [processingSlug, setProcessingSlug] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentInfo, setPaymentInfo] = useState("");
  const [detailsOpenSlug, setDetailsOpenSlug] = useState("");

  const toggleDetails = (slug) => {
    setDetailsOpenSlug((prev) => (prev === slug ? "" : slug));
  };

  useEffect(() => {
    if (user) {
      setBuyerForm((prev) => ({
        ...prev,
        customerName: user.name || prev.customerName,
        customerEmail: user.email || prev.customerEmail,
      }));
    }
  }, [user]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      prewarmBackendForCheckout().catch(() => undefined);
    }, 350);
    return () => window.clearTimeout(timerId);
  }, []);

  const updateBuyerForm = (field, value) => {
    setBuyerForm((previous) => ({ ...previous, [field]: value }));
  };

  const generateIdempotencyKey = (prefix = "svc") => {
    if (typeof window !== "undefined" && window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const validateBuyerForm = () => {
    if (buyerForm.customerName.trim().length < 2) return "Please enter a valid name before checkout.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerForm.customerEmail.trim())) return "Please enter a valid email for payment confirmation.";
    const normalizedPhone = buyerForm.customerPhone.replace(/\D/g, "");
    if (!/^\d{10}$/.test(normalizedPhone)) return "Enter a valid 10-digit phone number for Cashfree checkout.";
    return "";
  };

  const handlePayAndBook = async (service) => {
    setPaymentError("");
    setPaymentInfo("");

    if (!isLoggedIn) {
      const returnUrl = window.location.pathname + window.location.search;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("auth_return_url", returnUrl);
      }
      window.location.href = getGoogleAuthUrl(returnUrl);
      return;
    }

    const validationError = validateBuyerForm();
    if (validationError) { setPaymentError(validationError); return; }

    setProcessingSlug(service.slug);

    try {
      const orderPayload = {
        serviceSlug: service.slug,
        customerName: buyerForm.customerName.trim(),
        customerEmail: buyerForm.customerEmail.trim(),
        customerPhone: buyerForm.customerPhone.replace(/\D/g, ""),
        idempotencyKey: generateIdempotencyKey(),
        notes: `Services page checkout for ${service.name}`,
      };

      setPaymentInfo("Preparing secure checkout session...");

      const [orderResponse, scriptLoaded] = await Promise.all([
        createPaymentOrder(orderPayload),
        loadCashfreeCheckout(),
      ]);

      const alreadyPaidReceipt = orderResponse?.data?.receipt;
      if (orderResponse?.data?.alreadyPaid && alreadyPaidReceipt) {
        persistLatestReceipt({ receipt: alreadyPaidReceipt, serviceSlug: service.slug });
        navigate("/payment/success");
        return;
      }

      if (!scriptLoaded || typeof window.Cashfree !== "function") {
        throw new Error("Unable to load Cashfree checkout. Please try again.");
      }

      const checkout = orderResponse?.data?.checkout;
      if (!checkout?.orderId || !checkout?.paymentSessionId) {
        throw new Error("Checkout initialization failed. Please retry.");
      }

      const cashfree = window.Cashfree({ mode: checkout.environment === "production" ? "production" : "sandbox" });
      setPaymentInfo("Redirecting to secure Cashfree payment portal...");

      const result = await cashfree.checkout({ paymentSessionId: checkout.paymentSessionId, redirectTarget: "_self" });

      if (result?.error) {
        throw new Error(result.error?.message || "Cashfree checkout could not be opened. Please retry.");
      }

      if (!result?.redirect) {
        navigate(`/payment/success?order_id=${encodeURIComponent(checkout.orderId)}`);
      }
    } catch (error) {
      setPaymentError(getErrorMessage(error, "Could not initialize payment gateway."));
      setProcessingSlug("");
    }
  };

  const categories = ["All", "Frontend", "Backend", "Full Stack", "Security"];

  const filteredOfferings = SERVICE_OFFERINGS.filter((service) =>
    selectedCategory === "All" ? true : service.category === selectedCategory
  );

  return (
    <>
      <SeoHead
        title="Professional Development Services | Nikhil Agrahari"
        description="Hire Nikhil Agrahari for professional frontend, backend, and full-stack web development, MERN stack solutions, scalable REST APIs, and production deployment."
        pathname="/services"
        keywords={["Nikhil Agrahari services", "freelance frontend developer", "freelance backend developer", "full stack developer", "MERN stack development", "REST API development", "software engineering services"]}
        jsonLd={createBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])}
      />

      <section className="section-wrap pt-6 sm:pt-8 pb-24">

        {/* Centered Hero Header */}
        <div className="relative text-center max-w-5xl mx-auto pb-12 sm:pb-16">
          <div className="relative">
            {/* Eyebrow Badge */}
            <MotionDiv
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-500/[0.08] px-4 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400">
                Available for Freelance &amp; Contract Work
              </span>
            </MotionDiv>

            {/* Proportional Heading */}
            <MotionH1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.08] tracking-tight text-slate-900 dark:text-[#eef0f5]"
            >
              Services &amp;{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                Packages
              </span>
            </MotionH1>

            {/* Subtitle Details */}
            <MotionP
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8] sm:text-base"
            >
              Transparent deliverables, clear turnaround times, and secure checkout, built for founders, teams, and individuals who want reliable technical execution.
            </MotionP>

            {/* Quick Action CTA Buttons */}
            <MotionDiv
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 flex flex-wrap items-center justify-center gap-3"
            >
              <Button to="/contact" className="min-w-[190px]">
                <HeartHandshake size={16} strokeWidth={1.5} /> Discuss Custom Project
              </Button>
              <Button to="/support" variant="secondary" className="min-w-[160px]">
                <ShieldCheck size={16} strokeWidth={1.5} /> Trust &amp; Refund Policy
              </Button>
            </MotionDiv>

            {/* Core Stats Capsule */}
            <MotionDiv
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-10 max-w-4xl rounded-2xl border border-black/[0.08] bg-white p-4 sm:p-6 dark:border-white/[0.08] dark:bg-[#11141c]"
            >
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 md:divide-x md:divide-black/[0.08] dark:md:divide-white/[0.08]">
                {[
                  { label: "Available Packages", value: "04 Core", color: "text-slate-900 dark:text-[#eef0f5]" },
                  { label: "Turnaround Time", value: "3–7 Days", color: "text-emerald-600 dark:text-emerald-400" },
                  { label: "Security Standard", value: "OWASP Hardened", color: "text-slate-900 dark:text-[#eef0f5]" },
                  { label: "Checkout Model", value: "100% Secure", color: "text-emerald-600 dark:text-emerald-400" },
                ].map(({ label, value, color }, i) => (
                  <div key={label} className={`flex flex-col items-center justify-center text-center ${i > 0 ? "md:pl-4" : ""}`}>
                    <span className="mb-1 text-xs font-medium text-slate-500 dark:text-[#7a8296]">
                      {label}
                    </span>
                    <span className={`text-base sm:text-lg font-semibold tracking-tight tabular-nums ${color}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </MotionDiv>
          </div>
        </div>

        {/* # Trust / Payment Panel */}
        <PaymentTrustPanel includeHighlights />

        {/* # Status Alerts */}
        {paymentError && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-400/40 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400">
            <Zap size={16} className="mt-0.5 shrink-0" />
            <span>{paymentError}</span>
          </div>
        )}
        {paymentInfo && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-600/25 bg-emerald-500/[0.08] px-5 py-4 text-sm font-medium text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
            <CheckCircle2 size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" />
            <span>{paymentInfo}</span>
          </div>
        )}

        {/* # Section Header + Category Filters */}
        <div className="mt-16 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-white/[0.08]">
            <div>
              <span className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400 block mb-1">
                Service Catalog
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-[#eef0f5] tracking-tight">
                Available Packages &amp; Deliverables
              </h2>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-[#a3a9b8] leading-relaxed">
                Choose a package, inspect deliverables, and book securely.
              </p>
            </div>

            {/* Category pills styled like Blog Page */}
            <div
              className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full"
              style={{ scrollbarWidth: "none" }}
            >
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count = cat === "All"
                  ? SERVICE_OFFERINGS.length
                  : SERVICE_OFFERINGS.filter((s) => s.category === cat).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={clsx(
                      "shrink-0 rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 flex items-center gap-2",
                      isSelected
                        ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-slate-950"
                        : "border-black/[0.08] bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8] dark:hover:border-white/[0.16] dark:hover:text-[#eef0f5]"
                    )}
                  >
                    {cat}
                    <span className={clsx(
                      "rounded-full px-1.5 py-0.5 text-[9px] font-medium tabular-nums",
                      isSelected ? "bg-black/15 text-white" : "bg-black/[0.06] text-slate-500 dark:bg-white/[0.08] dark:text-[#7a8296]"
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* # Service Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredOfferings.map((service) => {
            const cfg = CATEGORY_CONFIG[service.category] || CATEGORY_CONFIG["Full Stack"];
            const CategoryIcon = cfg.icon;
            const isActive = activeServiceSlug === service.slug;
            const isDetailsOpen = detailsOpenSlug === service.slug;
            const isProcessing = processingSlug === service.slug;
            const details = SERVICE_DETAILS[service.slug] || SERVICE_DETAILS["frontend-development"];

            return (
              <article
                key={service.slug}
                className={clsx(
                  "flex flex-col justify-between rounded-2xl border bg-white dark:bg-[#11141c] transition-colors duration-150",
                  cfg.cardBorder,
                  isActive && "ring-2 ring-emerald-500/40"
                )}
              >
                <div className="p-6 sm:p-7">
                  {/* Service Identity Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={clsx("flex h-10 w-10 items-center justify-center rounded-xl border", cfg.iconBox)}>
                        <CategoryIcon size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-display text-base sm:text-lg font-semibold text-slate-900 dark:text-[#eef0f5] leading-tight">
                          {service.name}
                        </h3>
                        <span className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                          {service.category}
                        </span>
                      </div>
                    </div>

                    {/* Badge */}
                    <span className={clsx(
                      "shrink-0 rounded-md border px-2.5 py-1 font-mono text-xs font-medium",
                      cfg.badge
                    )}>
                      {service.badge}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-5 flex items-end justify-between gap-2 border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
                    <div>
                      <p className="font-mono text-xs text-slate-500 dark:text-[#7a8296] mb-1">
                        Starting from
                      </p>
                      <p className="font-display text-2xl sm:text-3xl font-semibold tabular-nums text-slate-900 dark:text-[#eef0f5]">
                        {service.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="flex items-center gap-1 font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        <Clock size={12} strokeWidth={1.5} /> {service.turnaround}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="mt-4 text-sm text-slate-600 dark:text-[#a3a9b8] leading-relaxed">
                    {service.summary}
                  </p>

                  {/* What's Included bullets */}
                  {service.bullets && (
                    <ul className="mt-4 space-y-2">
                      {service.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-[#d1d5df]">
                          <CheckCircle2 size={15} strokeWidth={1.5} className={clsx("mt-0.5 shrink-0", cfg.bullet)} />
                          <span className="leading-snug">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Expected Outcome */}
                  {service.expectedOutcome && (
                    <div className="mt-5 rounded-xl border border-black/[0.06] bg-slate-50 p-3.5 dark:border-white/[0.06] dark:bg-[#1a1e28]">
                      <p className="font-mono text-xs font-medium mb-1 text-emerald-700 dark:text-emerald-400">
                        Expected outcome
                      </p>
                      <p className="text-xs text-slate-600 dark:text-[#a3a9b8] leading-relaxed">
                        {service.expectedOutcome}
                      </p>
                    </div>
                  )}

                  {/* # Expandable Details Drawer */}
                  {isDetailsOpen && (
                    <div className="mt-5 space-y-4 rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-slate-50 dark:bg-[#1a1e28] p-4 text-xs">
                      <div>
                        <p className="font-mono text-xs text-slate-500 dark:text-[#7a8296] mb-1.5">
                          Best for
                        </p>
                        <p className="text-slate-700 dark:text-[#d1d5df] leading-relaxed">{details.idealFor}</p>
                      </div>
                      <div className="h-px bg-black/[0.06] dark:bg-white/[0.06]" />
                      <div>
                        <p className="font-mono text-xs text-slate-500 dark:text-[#7a8296] mb-2">
                          Deliverables
                        </p>
                        <ul className="space-y-1.5">
                          {details.deliverables.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-slate-700 dark:text-[#d1d5df]">
                              <CheckCircle2 size={14} strokeWidth={1.5} className="mt-0.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="h-px bg-black/[0.06] dark:bg-white/[0.06]" />
                      <div>
                        <p className="font-mono text-xs text-slate-500 dark:text-[#7a8296] mb-2">
                          Tech stack &amp; tools
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {details.stack.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-md border border-black/[0.08] bg-white px-2 py-0.5 font-mono text-xs text-slate-700 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* # Checkout Drawer */}
                  {isActive && (
                    <div className="mt-5 rounded-xl border border-emerald-600/25 bg-emerald-500/[0.06] dark:border-emerald-500/25 dark:bg-emerald-500/[0.06] p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                            <Lock size={13} strokeWidth={1.5} /> Secure Checkout
                          </p>
                          <p className="mt-0.5 text-xs text-slate-600 dark:text-[#a3a9b8]">
                            Powered by Cashfree · 256-bit encrypted
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveServiceSlug("")}
                          className="rounded-lg p-1.5 text-slate-500 hover:text-slate-800 dark:text-[#7a8296] dark:hover:text-[#eef0f5] hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-150"
                        >
                          <ChevronUp size={16} strokeWidth={1.5} />
                        </button>
                      </div>

                      {!isLoggedIn ? (
                        <div className="rounded-xl border border-black/[0.08] bg-white dark:border-white/[0.08] dark:bg-[#11141c] p-5 text-center">
                          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-[#1a1e28]">
                            <GoogleIcon />
                          </div>
                          <p className="font-display text-sm font-semibold text-slate-900 dark:text-[#eef0f5]">Sign In Required</p>
                          <p className="mt-1 text-xs text-slate-600 dark:text-[#a3a9b8] leading-relaxed max-w-xs mx-auto">
                            Please sign in with Google to lock in your booking and generate your official receipt.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              if (typeof window !== "undefined") {
                                sessionStorage.setItem("auth_return_url", window.location.pathname + window.location.search);
                              }
                              window.location.href = getGoogleAuthUrl();
                            }}
                            className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-black/[0.10] bg-slate-900 text-white dark:border-white/[0.10] dark:bg-[#eef0f5] dark:text-[#090a0f] px-4 text-xs font-medium transition-colors duration-150"
                          >
                            <GoogleIcon /> Continue with Google
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <label className="text-xs font-medium text-slate-700 dark:text-[#d1d5df]">
                              Full Name
                              <input
                                type="text"
                                value={buyerForm.customerName}
                                onChange={(e) => updateBuyerForm("customerName", e.target.value)}
                                className="mt-1.5 h-10 w-full rounded-lg border border-black/[0.10] bg-white px-3.5 text-xs text-slate-900 outline-none focus:border-emerald-600 dark:border-white/[0.10] dark:bg-[#11141c] dark:text-[#eef0f5] transition-colors duration-150 placeholder:text-slate-400 dark:placeholder:text-[#7a8296]"
                                placeholder="Your full name"
                              />
                            </label>

                            <label className="text-xs font-medium text-slate-700 dark:text-[#d1d5df]">
                              Email
                              <span className="ml-1 text-[11px] font-normal text-emerald-700 dark:text-emerald-400">(locked to sign-in)</span>
                              <input
                                type="email"
                                readOnly
                                value={buyerForm.customerEmail}
                                className="mt-1.5 h-10 w-full rounded-lg border border-black/[0.08] bg-slate-100 px-3.5 text-xs text-slate-500 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#7a8296] cursor-not-allowed outline-none"
                                placeholder="you@example.com"
                              />
                            </label>

                            <label className="text-xs font-medium text-slate-700 dark:text-[#d1d5df] sm:col-span-2">
                              Phone Number
                              <span className="ml-1 text-[11px] font-normal text-slate-500 dark:text-[#7a8296]">(required for Cashfree OTP)</span>
                              <input
                                type="text"
                                value={buyerForm.customerPhone}
                                onChange={(e) => updateBuyerForm("customerPhone", e.target.value)}
                                className="mt-1.5 h-10 w-full rounded-lg border border-black/[0.10] bg-white px-3.5 text-xs text-slate-900 outline-none focus:border-emerald-600 dark:border-white/[0.10] dark:bg-[#11141c] dark:text-[#eef0f5] transition-colors duration-150 placeholder:text-slate-400 dark:placeholder:text-[#7a8296]"
                                placeholder="e.g. 9876543210"
                              />
                            </label>
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] dark:border-white/[0.06] pt-3 text-xs text-slate-600 dark:text-[#a3a9b8]">
                            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                              <ShieldCheck size={14} strokeWidth={1.5} /> 256-bit SSL Encrypted
                            </span>
                            <span>7-Day Refund Policy</span>
                          </div>

                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handlePayAndBook(service)}
                            className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 text-sm font-medium text-white transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <CreditCard size={15} strokeWidth={1.5} />
                            {isProcessing ? "Opening Cashfree Gateway..." : `Complete Payment · INR ${service.amountInr}`}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* # Card Footer */}
                <div className="border-t border-black/[0.06] dark:border-white/[0.08] px-6 sm:px-7 py-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => toggleDetails(service.slug)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-[#a3a9b8] dark:hover:text-[#eef0f5] transition-colors duration-150"
                  >
                    {isDetailsOpen ? "Hide Details" : "View Details"}
                    <ArrowRight size={13} strokeWidth={1.5} className={clsx("transition-transform", isDetailsOpen && "rotate-90")} />
                  </button>

                  <div className="flex items-center gap-3">
                    <Link
                      to="/contact"
                      className="text-xs font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-150"
                    >
                      Custom Scope
                    </Link>

                    <button
                      type="button"
                      disabled={Boolean(processingSlug && processingSlug !== service.slug)}
                      onClick={() => {
                        setPaymentError("");
                        setPaymentInfo("");
                        if (isActive) {
                          handlePayAndBook(service);
                        } else {
                          setActiveServiceSlug(service.slug);
                        }
                      }}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 px-4 text-xs font-medium text-white transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* # FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-[#eef0f5]">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-[#a3a9b8]">
              Details about payments, deliverables, and custom scopes.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-xl border border-black/[0.08] bg-white dark:border-white/[0.08] dark:bg-[#11141c] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-slate-900 dark:text-[#eef0f5] hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors duration-150"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle size={16} strokeWidth={1.5} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
                      {faq.q}
                    </span>
                    {isOpen
                      ? <ChevronUp size={16} strokeWidth={1.5} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
                      : <ChevronDown size={16} strokeWidth={1.5} className="text-slate-400 dark:text-[#7a8296] shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-2 text-sm text-slate-600 dark:text-[#a3a9b8] leading-relaxed border-t border-black/[0.06] dark:border-white/[0.06]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* # Bottom CTA Banner */}
        <div className="mt-20 rounded-2xl border border-black/[0.08] bg-white dark:border-white/[0.08] dark:bg-[#11141c] p-8 sm:p-10 text-center">
          <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Custom Scope &amp; Retainer Work
          </p>

          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-[#eef0f5] tracking-tight">
            Have a Specific Technical Scope?
          </h2>

          <p className="mt-3 text-sm text-slate-600 dark:text-[#a3a9b8] max-w-xl mx-auto leading-relaxed">
            Need custom full-stack architecture, API security reviews, or ongoing engineering support? Reach out to discuss requirements directly.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button to="/contact" className="min-w-[190px]">
              <HeartHandshake size={16} strokeWidth={1.5} /> Contact Nikhil
            </Button>
            <Button to="/support" variant="secondary" className="min-w-[170px]">
              <ShieldCheck size={16} strokeWidth={1.5} /> Trust &amp; Refund Policy
            </Button>
          </div>
        </div>

      </section>
    </>
  );
};

export default ServicesPage;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  HeartHandshake,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
  Lock,
  Star,
  Award,
  BadgeCheck,
  Globe,
  Code2,
  Clock,
  HelpCircle,
  FileCheck2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import SeoHead from "@/components/seo/SeoHead";
import PaymentTrustPanel from "@/components/ui/PaymentTrustPanel";
import FadeInUp from "@/components/animations/FadeInUp";
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

const GoogleIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const categoryBadgeStyle = {
  Frontend:
    "border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  Backend:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  "Full Stack":
    "border-lime-500/30 bg-lime-500/10 text-lime-700 dark:text-lime-300",
  "Build and Delivery":
    "border-lime-500/30 bg-lime-500/10 text-lime-700 dark:text-lime-300",
};

const serviceCardAccent = {
  Frontend: {
    card: "border-slate-200 dark:border-cyan-500/30 hover:border-cyan-400 dark:hover:border-cyan-400",
    glow: "bg-cyan-400/10",
    line: "bg-cyan-500/40",
    panel:
      "border-slate-200 bg-slate-50/90 dark:border-cyan-500/20 dark:bg-[#020803]/80",
    bullet: "text-cyan-600 dark:text-cyan-400",
  },
  Backend: {
    card: "border-slate-200 dark:border-emerald-500/30 hover:border-emerald-400 dark:hover:border-emerald-400",
    glow: "bg-emerald-400/10",
    line: "bg-emerald-500/40",
    panel:
      "border-slate-200 bg-slate-50/90 dark:border-emerald-500/20 dark:bg-[#020803]/80",
    bullet: "text-emerald-600 dark:text-emerald-400",
  },
  "Full Stack": {
    card: "border-slate-200 dark:border-lime-500/30 hover:border-lime-400 dark:hover:border-lime-400",
    glow: "bg-lime-400/10",
    line: "bg-lime-500/40",
    panel:
      "border-slate-200 bg-slate-50/90 dark:border-lime-500/20 dark:bg-[#020803]/80",
    bullet: "text-lime-600 dark:text-lime-400",
  },
  "Build and Delivery": {
    card: "border-slate-200 dark:border-lime-500/30 hover:border-lime-400 dark:hover:border-lime-400",
    glow: "bg-lime-400/10",
    line: "bg-lime-500/40",
    panel:
      "border-slate-200 bg-slate-50/90 dark:border-lime-500/20 dark:bg-[#020803]/80",
    bullet: "text-lime-600 dark:text-lime-400",
  },
};

const serviceBadgeMap = {
  "frontend-development": {
    text: "🎨 PIXEL PERFECT",
    color: "border-cyan-400/40 bg-cyan-400/10 text-cyan-600 dark:text-cyan-300",
  },
  "backend-development": {
    text: "⚙️ SCALABLE APIS",
    color: "border-emerald-400/40 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300",
  },
  "full-stack-development": {
    text: "🔥 MOST POPULAR",
    color: "border-lime-400/40 bg-lime-400/10 text-lime-700 dark:text-lime-300 font-extrabold",
  },
};

const defaultServiceDetails = {
  idealFor:
    "Individuals and teams seeking reliable technical execution with transparent communication.",
  engagementModel: "Scope Discovery + Phased Build Execution + Handoff Notes",
  deliverables: [
    "Clear milestones & upfront scope agreement",
    "Daily / milestone progress updates",
    "Complete source code handoff & deployment checklist",
  ],
  stack: ["React.js", "Node.js", "Tailwind CSS", "Git"],
};

const serviceDetailMap = {
  "frontend-development": {
    idealFor:
      "Founders, startups, and creators needing responsive, ultra-fast React or Next.js web applications.",
    engagementModel: "Figma-to-Code / Concept Build + Reusable UI Architecture",
    deliverables: [
      "100% Mobile & tablet responsive interface built with React/Next & Tailwind",
      "Ultra-fast page loads with smooth micro-animations & dark mode",
      "Clean, component-driven codebase with complete Git repository delivery",
    ],
    stack: ["React.js", "Next.js", "Tailwind CSS", "Framer Motion", "Vite"],
  },
  "backend-development": {
    idealFor:
      "Applications needing secure RESTful APIs, JWT user authentication, and robust database controllers.",
    engagementModel: "Schema Modeling + Controller Logic + Postman API Docs",
    deliverables: [
      "Secure REST API endpoints with input validation & rate limiting",
      "Database schema modeling (MongoDB / PostgreSQL) with error handling",
      "Complete Postman API collection & integration documentation",
    ],
    stack: ["Node.js", "Express.js", "MongoDB", "JWT Auth", "Postman"],
  },
  "full-stack-development": {
    idealFor:
      "Clients requiring turnkey full-stack web applications from idea to live production deployment.",
    engagementModel: "Full-Cycle Build: Design + Frontend + Backend + Payment Gateway",
    deliverables: [
      "Full-stack MERN / Next.js web application with modern dashboard UI",
      "Payment gateway setup (Razorpay/Cashfree) & role-based authentication",
      "Production deployment on Vercel/Render with SSL & environment config",
    ],
    stack: ["React / Next.js", "Node.js & Express", "MongoDB Atlas", "Payment Gateways", "Vercel / Render"],
  },
};


const FAQS = [
  {
    q: "How does the payment and booking process work?",
    a: "Select your desired service, click 'Pay and Book', enter your details, and complete payment via Cashfree's secure 256-bit encrypted gateway (UPI, Cards, NetBanking). You will receive an instant digital receipt and booking confirmation.",
  },
  {
    q: "What happens after I complete my payment?",
    a: "You are automatically redirected to your receipt portal page where you can download your official PDF invoice. Nikhil will reach out directly to your registered email/phone within 2-4 hours to begin onboarding.",
  },
  {
    q: "Can I request a custom scope beyond the listed packages?",
    a: "Yes! If your project requires custom features, custom API integrations, or larger full-stack architecture, click 'Custom Scope' or 'Discuss Custom Scope' to send a direct message.",
  },
  {
    q: "Is payment safe and eligible for refunds?",
    a: "All payments are processed securely through Cashfree. Every booking comes with transparent terms and a 7-day refund guarantee if work has not commenced according to agreed scope.",
  },
];

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

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  const updateBuyerForm = (field, value) => {
    setBuyerForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const generateIdempotencyKey = (prefix = "svc") => {
    if (typeof window !== "undefined" && window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const validateCustomerDetails = (formValues) => {
    if (formValues.customerName.trim().length < 2) {
      return "Please enter a valid name before checkout.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.customerEmail.trim())) {
      return "Please enter a valid email for payment confirmation.";
    }

    const normalizedPhone = formValues.customerPhone.replace(/\D/g, "");
    if (!/^\d{10}$/.test(normalizedPhone)) {
      return "Enter a valid 10-digit phone number for Cashfree checkout.";
    }

    return "";
  };

  const validateBuyerForm = () => {
    return validateCustomerDetails(buyerForm);
  };

  const handlePayAndBook = async (service) => {
    setPaymentError("");
    setPaymentInfo("");

    if (!isLoggedIn) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "auth_return_url",
          window.location.pathname + window.location.search
        );
      }
      window.location.href = getGoogleAuthUrl();
      return;
    }

    const validationError = validateBuyerForm();
    if (validationError) {
      setPaymentError(validationError);
      return;
    }

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
        persistLatestReceipt({
          receipt: alreadyPaidReceipt,
          serviceSlug: service.slug,
        });
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

      const cashfree = window.Cashfree({
        mode: checkout.environment === "production" ? "production" : "sandbox",
      });

      setPaymentInfo("Redirecting to secure Cashfree payment portal...");

      const result = await cashfree.checkout({
        paymentSessionId: checkout.paymentSessionId,
        redirectTarget: "_self",
      });

      if (result?.error) {
        throw new Error(
          result.error?.message ||
            "Cashfree checkout could not be opened. Please retry."
        );
      }

      if (!result?.redirect) {
        navigate(
          `/payment/success?order_id=${encodeURIComponent(checkout.orderId)}`
        );
      }
    } catch (error) {
      setPaymentError(
        getErrorMessage(error, "Could not initialize payment gateway.")
      );
      setProcessingSlug("");
    }
  };

  const categories = ["All", "Frontend", "Backend", "Full Stack"];

  const filteredOfferings = SERVICE_OFFERINGS.filter((service) => {
    if (selectedCategory === "All") return true;
    return service.category === selectedCategory;
  });

  return (
    <>
      <SeoHead
        title="Professional Development Services | Nikhil Agrahari"
        description="Hire Nikhil Agrahari for professional frontend, backend, and full-stack web development, MERN stack solutions, scalable REST APIs, and production deployment."
        pathname="/services"
        keywords={[
          "Nikhil Agrahari services",
          "freelance frontend developer",
          "freelance backend developer",
          "full stack developer",
          "MERN stack development",
          "REST API development",
          "software engineering services",
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />

      <section className="section-wrap pt-4 sm:pt-6 pb-24">
        
        {/* Header Hero Section */}
        <FadeInUp>
          <div className="text-center max-w-4xl mx-auto mb-12">

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-[1.05]">
              PREMIUM DEVELOPMENT &amp; <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">SERVICES</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Transparent development tracks, guaranteed turnaround times, and instant 256-bit secure checkout for custom web builds.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button to="/contact" className="min-w-[190px]">
                <HeartHandshake size={16} /> Discuss Custom Project
              </Button>
              <Button to="/support" variant="secondary" className="min-w-[170px]">
                <ShieldCheck size={16} /> Support &amp; Policy
              </Button>
            </div>
          </div>
        </FadeInUp>

        {/* Unified Payment & Delivery Promise Card */}
        <PaymentTrustPanel includeHighlights />

        {/* Notification Alerts */}
        {paymentError ? (
          <p className="mt-5 rounded-2xl border border-rose-300/40 bg-rose-500/10 px-5 py-3.5 text-xs sm:text-sm font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <Zap size={16} className="shrink-0" />
            {paymentError}
          </p>
        ) : null}
        {paymentInfo ? (
          <p className="mt-5 rounded-2xl border border-emerald-300/40 bg-emerald-500/10 px-5 py-3.5 text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <Sparkles size={16} className="shrink-0 animate-spin-slow" />
            {paymentInfo}
          </p>
        ) : null}

        {/* Catalog Section Header & Category Filters */}
        <div className="mt-16 mb-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Service Packages &amp; Deliverables
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto mt-2">
            Select a service package below to inspect deliverables, turnaround timelines, and initiate secure booking.
          </p>

          {/* Filter Pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count =
                cat === "All"
                  ? SERVICE_OFFERINGS.length
                  : SERVICE_OFFERINGS.filter((s) => s.category === cat).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold transition-all duration-200 ${
                    isSelected
                      ? "bg-lime-400 text-slate-950 shadow-[0_0_15px_rgba(163,230,53,0.5)] scale-105"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isSelected
                        ? "bg-slate-950 text-lime-400"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Service Catalog Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredOfferings.map((service, index) => {
            const isActiveService = activeServiceSlug === service.slug;
            const isProcessing = processingSlug === service.slug;
            const accent =
              serviceCardAccent[service.category] || serviceCardAccent["Full Stack"];
            const details =
              serviceDetailMap[service.slug] || defaultServiceDetails;
            const badge = serviceBadgeMap[service.slug] || { text: "PREMIUM", color: "border-slate-400/40 bg-slate-400/10 text-slate-300" };

            return (
              <article
                key={service.slug}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-white/95 p-6 sm:p-7 shadow-xl backdrop-blur-xl transition-all duration-300 dark:bg-[#030d07]/95 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] ${
                  accent.card
                } ${
                  isActiveService
                    ? "border-lime-400 dark:border-lime-400 shadow-[0_0_35px_rgba(163,230,53,0.35)] ring-2 ring-lime-400/40"
                    : ""
                } ${index === 2 ? "md:col-span-2 lg:col-span-1 max-w-xl md:mx-auto lg:max-w-none w-full" : ""}`}
              >
                {/* Top Accent Line */}
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-[3px] ${accent.line}`}
                />
                
                {/* Background Ambient Glow */}
                <div
                  className={`pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full blur-3xl transition-opacity duration-300 ${
                    accent.glow
                  } ${isActiveService ? "opacity-100" : "opacity-40"}`}
                />

                {/* Card Header: Number, Category, Badge & Title */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      PLAN #{String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] font-extrabold ${
                        categoryBadgeStyle[service.category]
                      }`}
                    >
                      {service.category}
                    </span>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${badge.color}`}
                  >
                    {badge.text}
                  </span>
                </div>

                <h3 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {service.name}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {service.summary}
                </p>

                {/* Price, Turnaround & Engagement Grid */}
                <div className="mt-6 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {/* Price Box */}
                  <div className={`rounded-2xl border p-4 ${accent.panel}`}>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        Price
                      </p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase">
                        <Lock size={10} /> 100% Fixed
                      </span>
                    </div>
                    <p className="mt-1 font-outfit text-3xl font-black text-slate-900 dark:text-white">
                      {service.price}
                    </p>
                    <p className="mt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-300 flex items-center gap-1">
                      <BadgeCheck size={13} /> Immediate Enrollment
                    </p>
                  </div>

                  {/* Turnaround & Engagement Box */}
                  <div className="grid gap-3">
                    <div className={`rounded-2xl border p-3 flex items-center gap-3 ${accent.panel}`}>
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <Clock size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                          Turnaround
                        </p>
                        <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                          {service.turnaround}
                        </p>
                      </div>
                    </div>

                    <div className={`rounded-2xl border p-3 ${accent.panel}`}>
                      <p className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        Engagement Model
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                        {details.engagementModel}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Target Audience / Ideal For */}
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/90 p-4 dark:border-emerald-500/20 dark:bg-[#020803]/80">
                  <p className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Award size={13} className="text-emerald-500" /> Ideal For
                  </p>
                  <p className="mt-1 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                    {details.idealFor}
                  </p>
                </div>

                {/* Deliverables Checklist */}
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/90 p-4 dark:border-emerald-500/20 dark:bg-[#020803]/80">
                  <p className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <FileCheck2 size={13} className="text-emerald-500" /> What You Get &amp; Deliverables
                  </p>
                  <ul className="mt-2.5 space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium">
                    {details.deliverables.map((item) => (
                      <li
                        key={`${service.slug}-${item}`}
                        className="flex items-start gap-2.5"
                      >
                        <CheckCircle2
                          size={16}
                          className={`mt-0.5 shrink-0 ${accent.bullet}`}
                        />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Stack & Method Pills */}
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-400 mr-1">
                    STACK:
                  </span>
                  {details.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] font-bold text-slate-700 dark:border-emerald-500/20 dark:bg-slate-900/60 dark:text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <Button
                    type="button"
                    disabled={Boolean(
                      processingSlug && processingSlug !== service.slug
                    )}
                    onClick={() => {
                      setPaymentError("");
                      setPaymentInfo("");

                      if (!isActiveService) {
                        setActiveServiceSlug(service.slug);
                        return;
                      }

                      handlePayAndBook(service);
                    }}
                    className="flex-1 min-w-[190px]"
                  >
                    <CreditCard size={15} />
                    {isActiveService
                      ? isProcessing
                        ? "Opening Cashfree Checkout..."
                        : "Proceed to Secure Checkout"
                      : `Pay & Book (INR ${service.amountInr})`}
                  </Button>

                  <Button
                    to="/contact"
                    variant="secondary"
                    className="flex-1 min-w-[150px]"
                  >
                    Custom Scope <ArrowRight size={15} />
                  </Button>
                </div>

                {/* Expanded Checkout Drawer inside Card */}
                {isActiveService ? (
                  <div className="mt-5 rounded-2xl border border-lime-400/40 bg-lime-400/10 p-5 backdrop-blur-xl animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-lime-400/20 pb-3">
                      <div>
                        <p className="text-xs font-mono font-extrabold uppercase tracking-widest text-lime-700 dark:text-lime-300 flex items-center gap-1.5">
                          <Lock size={13} /> Step 2: Secure Checkout Verification
                        </p>
                        <p className="mt-0.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          Verify details below. Cashfree payment gateway opens in-place with instant receipt generation.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveServiceSlug("")}
                        className="rounded-full p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      >
                        <ChevronUp size={18} />
                      </button>
                    </div>

                    {!isLoggedIn ? (
                      <div className="mt-4 rounded-2xl border border-emerald-500/40 bg-white/90 dark:bg-slate-900/90 p-5 text-center shadow-md">
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/20">
                          <GoogleIcon />
                        </div>
                        <p className="mt-2 text-sm font-extrabold text-slate-900 dark:text-white">
                          Sign In Required to Enroll
                        </p>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                          Please sign in with Google first to lock in your enrollment and generate your official payment receipt.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              sessionStorage.setItem(
                                "auth_return_url",
                                window.location.pathname + window.location.search
                              );
                            }
                            window.location.href = getGoogleAuthUrl();
                          }}
                          className="mt-4 inline-flex items-center justify-center gap-2.5 rounded-xl bg-slate-900 dark:bg-white px-6 py-2.5 text-xs font-black text-white dark:text-slate-900 shadow-md hover:scale-[1.02] transition"
                        >
                          <GoogleIcon />
                          <span>Continue with Google</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                            Full Name
                            <input
                              type="text"
                              value={buyerForm.customerName}
                              onChange={(event) =>
                                updateBuyerForm("customerName", event.target.value)
                              }
                              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-lime-500 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white"
                              placeholder="Your full name"
                            />
                          </label>

                          <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                            Email <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold ml-1">(Signed-in Email 🔒)</span>
                            <input
                              type="email"
                              readOnly
                              value={buyerForm.customerEmail}
                              className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-not-allowed font-semibold outline-none"
                              placeholder="you@example.com"
                            />
                          </label>

                          <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 sm:col-span-2">
                            Phone Number (required for Cashfree OTP &amp; WhatsApp Receipt)
                            <input
                              type="text"
                              value={buyerForm.customerPhone}
                              onChange={(event) =>
                                updateBuyerForm("customerPhone", event.target.value)
                              }
                              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-lime-500 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white"
                              placeholder="e.g. 9876543210"
                            />
                          </label>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-lime-400/20 pt-3 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                            <ShieldCheck size={14} /> 256-bit SSL Encrypted
                          </span>
                          <span>7-Day Refund Policy Applies</span>
                        </div>

                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handlePayAndBook(service)}
                          className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 py-3 text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_4px_20px_rgba(163,230,53,0.4)] hover:shadow-[0_6px_28px_rgba(163,230,53,0.6)] hover:scale-[1.01] transition-all"
                        >
                          <CreditCard size={16} />
                          {isProcessing
                            ? "Opening Cashfree Gateway..."
                            : `Complete Payment (INR ${service.amountInr})`}
                        </button>
                      </>
                    )}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        {/* Frequently Asked Questions (FAQ Accordion) */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
              Everything you need to know about payments, deliverables, and custom project scopes.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-slate-200 bg-white/90 dark:border-emerald-500/20 dark:bg-[#030d07]/90 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-4 p-4 text-left font-extrabold text-sm sm:text-base text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle size={18} className="text-emerald-500 shrink-0" />
                      {faq.q}
                    </span>
                    {isOpen ? <ChevronUp size={18} className="text-emerald-500 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                  </button>

                  {isOpen ? (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-emerald-500/10">
                      {faq.a}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Custom Scope CTA Banner */}
        <div className="mt-16 rounded-3xl border border-slate-200 bg-white dark:border-emerald-500/40 dark:bg-[#030d07] p-8 sm:p-10 text-center text-slate-900 dark:text-white shadow-xl dark:shadow-2xl relative overflow-hidden cta-enterprise-banner">
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-emerald-500/10 blur-3xl" />
          
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-100 text-emerald-900 dark:border-emerald-400/50 dark:bg-emerald-400/15 dark:text-emerald-300 px-4 py-1.5 text-xs font-black mb-4 shadow-xs">
            <Globe size={14} /> CUSTOM ENTERPRISE BUILD &amp; AUDITING
          </span>

          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Have a Specific Enterprise Scope or Unique Requirement?
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-200 font-bold max-w-xl mx-auto leading-relaxed">
            Need custom full-stack architecture, API security penetration testing, or long-term retainer support? Let's discuss your custom scope directly.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button to="/contact" className="min-w-[200px] !bg-emerald-500 hover:!bg-emerald-600 !text-slate-950 dark:!bg-emerald-400 dark:hover:!bg-emerald-300 font-black shadow-lg">
              <HeartHandshake size={16} /> Contact Nikhil Directly
            </Button>
            <Button to="/support" variant="secondary" className="min-w-[180px] !border-slate-300 !bg-slate-100 !text-slate-900 hover:!bg-slate-200 dark:!border-emerald-400/50 dark:!bg-emerald-500/20 dark:!text-white dark:hover:!bg-emerald-500/30 font-black shadow-sm">
              <ShieldCheck size={16} /> Read Trust &amp; Refund Policy
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Layers,
  TimerReset,
  CreditCard,
  HeartHandshake,
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
import { SERVICE_OFFERINGS } from "@/constants/siteData";

const categoryStyle = {
  Guidance: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  "Career Support": "border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  "Build and Delivery": "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
};

const serviceCardAccent = {
  Guidance: {
    card: "border-slate-200 dark:border-emerald-500/30 hover:border-emerald-400 dark:hover:border-emerald-400",
    glow: "bg-emerald-400/10",
    line: "bg-emerald-500/40",
    panel: "border-slate-200 bg-slate-50/90 dark:border-emerald-500/20 dark:bg-[#020803]/80",
    bullet: "text-emerald-600 dark:text-emerald-400",
  },
  "Career Support": {
    card: "border-slate-200 dark:border-cyan-500/30 hover:border-cyan-400 dark:hover:border-cyan-400",
    glow: "bg-cyan-400/10",
    line: "bg-cyan-500/40",
    panel: "border-slate-200 bg-slate-50/90 dark:border-cyan-500/20 dark:bg-[#020803]/80",
    bullet: "text-cyan-600 dark:text-cyan-400",
  },
  "Build and Delivery": {
    card: "border-slate-200 dark:border-violet-500/30 hover:border-violet-400 dark:hover:border-violet-400",
    glow: "bg-violet-400/10",
    line: "bg-violet-500/40",
    panel: "border-slate-200 bg-slate-50/90 dark:border-violet-500/20 dark:bg-[#020803]/80",
    bullet: "text-violet-600 dark:text-violet-400",
  },
};

const defaultServiceDetails = {
  idealFor:
    "Individuals and teams seeking reliable delivery with clear communication.",
  engagementModel: "Discovery call + scoped execution + transparent updates",
  deliverables: [
    "Clear scope and expectations",
    "Progress updates across milestones",
    "Actionable outcomes with handover clarity",
  ],
};

const serviceDetailMap = {
  "mentorship-call": {
    idealFor:
      "Students who need practical roadmap direction and next-step clarity.",
    engagementModel: "One focused mentorship session + practical action notes",
    deliverables: [
      "Learning roadmap aligned to current level",
      "Project direction and execution advice",
      "Career/portfolio improvement recommendations",
    ],
  },
  "resume-review-help": {
    idealFor:
      "Students and freshers aiming for stronger interview-ready resumes.",
    engagementModel: "Resume audit + revision guidance + positioning feedback",
    deliverables: [
      "Cleaner structure and stronger readability",
      "Impact-focused project and skills phrasing",
      "Role-targeted improvement suggestions",
    ],
  },
  "portfolio-guidance": {
    idealFor: "Learners who want portfolio pages that look credible and clear.",
    engagementModel: "Portfolio walkthrough + section-wise recommendations",
    deliverables: [
      "Homepage and project section refinement",
      "Stronger content hierarchy and storytelling",
      "Trust-signal and presentation improvements",
    ],
  },
  "frontend-development": {
    idealFor:
      "Founders and students needing responsive, polished frontend delivery.",
    engagementModel: "Design-to-build execution with iterative feedback",
    deliverables: [
      "Responsive pages with consistent UI language",
      "Reusable component architecture",
      "Usability-first interactions and handover",
    ],
  },
  "backend-development": {
    idealFor:
      "Products needing stable APIs, validation, and clean server logic.",
    engagementModel: "Requirement scoping + API implementation + testing",
    deliverables: [
      "REST endpoints with structured validation",
      "Error-safe and maintainable backend flow",
      "Integration-ready documentation support",
    ],
  },
  "full-stack-development": {
    idealFor:
      "End-to-end builds requiring both frontend and backend execution.",
    engagementModel:
      "Product planning + full implementation + deployment guidance",
    deliverables: [
      "Frontend + backend delivery in one flow",
      "Database integration and core business logic",
      "Production-ready launch checklist support",
    ],
  },
};

const serviceHighlights = [
  {
    title: "Execution-First Delivery",
    summary:
      "Clean scope definition, milestone updates, and practical implementation quality.",
    icon: Layers,
  },
  {
    title: "Security-Aware Thinking",
    summary:
      "Build decisions are made with reliability, validation, and defensive patterns in mind.",
    icon: ShieldCheck,
  },
  {
    title: "Fast Communication Loop",
    summary:
      "Quick responses and transparent progress updates to keep your timeline moving.",
    icon: TimerReset,
  },
];

const ServicesPage = () => {
  const navigate = useNavigate();
  const [activeServiceSlug, setActiveServiceSlug] = useState("");
  const [buyerForm, setBuyerForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });
  const [processingSlug, setProcessingSlug] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentInfo, setPaymentInfo] = useState("");

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
      return "Enter a valid 10-digit phone number for checkout.";
    }

    return "";
  };

  const validateBuyerForm = () => {
    return validateCustomerDetails(buyerForm);
  };

  const handlePayAndBook = async (service) => {
    setPaymentError("");
    setPaymentInfo("");

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

      setPaymentInfo("Preparing secure checkout...");

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

      setPaymentInfo("Redirecting to secure Cashfree checkout...");

      const result = await cashfree.checkout({
        paymentSessionId: checkout.paymentSessionId,
        redirectTarget: "_self",
      });

      if (result?.error) {
        throw new Error(
          result.error?.message ||
            "Cashfree checkout could not be opened. Please retry.",
        );
      }

      if (!result?.redirect) {
        navigate(
          `/payment/success?order_id=${encodeURIComponent(checkout.orderId)}`,
        );
      }
    } catch (error) {
      setPaymentError(
        getErrorMessage(error, "Could not initialize payment gateway."),
      );
      setProcessingSlug("");
    }
  };

  return (
    <>
      <SeoHead
        title="Engineering Services & Advisory | Nikhil Agrahari"
        description="Hire Nikhil Agrahari for professional web app development, MERN stack solutions, custom APIs, AI integration, and security auditing."
        pathname="/services"
        keywords={[
          "Nikhil Agrahari services",
          "freelance web developer",
          "MERN stack development",
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />

      <section className="section-wrap pt-4 sm:pt-6 pb-20">
        
        {/* Centered Hero Header */}
        <FadeInUp>
          <div className="text-center max-w-4xl mx-auto mb-10">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-wider text-slate-900 dark:text-white drop-shadow-sm">
              ENGINEERING &amp; <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">SERVICES</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Service tracks, clear transparent pricing, and instant checkout readiness for mentorship and custom builds.
            </p>
          </div>
        </FadeInUp>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-4 lg:space-y-5">
            <div className="flex flex-wrap gap-3">
              <Button to="/support" className="min-w-[180px]">
                <HeartHandshake size={16} /> Open Support Page
              </Button>
              <Button
                to="/contact"
                variant="secondary"
                className="min-w-[180px]"
              >
                Discuss Custom Scope
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {serviceHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-md backdrop-blur-xl dark:border-emerald-500/20 dark:bg-[#030d07]/90"
                  >
                    <Icon size={20} className="text-emerald-600 dark:text-emerald-400" />
                    <h2 className="mt-3 text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                      {item.summary}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          <PaymentTrustPanel />
        </div>

        {paymentError ? (
          <p className="mt-4 rounded-xl border border-rose-300/40 bg-rose-500/10 px-4 py-3 text-xs sm:text-sm font-bold text-rose-700 dark:text-rose-300">
            {paymentError}
          </p>
        ) : null}
        {paymentInfo ? (
          <p className="mt-4 rounded-xl border border-emerald-300/40 bg-emerald-500/10 px-4 py-3 text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300">
            {paymentInfo}
          </p>
        ) : null}

        {/* Service Catalog Header */}
        <div className="mt-14 mb-8 text-center">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">// SERVICE CATALOG</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Service Plans &amp; Scope
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto mt-1">
            Compare deliverables, starting prices, and turn-around timelines.
          </p>
        </div>

        {/* Service Catalog Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {SERVICE_OFFERINGS.map((service, index) => {
            const isActiveService = activeServiceSlug === service.slug;
            const isProcessing = processingSlug === service.slug;
            const accent =
              serviceCardAccent[service.category] || serviceCardAccent.Guidance;
            const details =
              serviceDetailMap[service.slug] || defaultServiceDetails;

            return (
              <article
                key={service.slug}
                className={`group relative overflow-hidden rounded-3xl border bg-white/95 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 dark:bg-[#030d07]/95 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] ${accent.card} ${
                  isActiveService
                    ? "border-emerald-400 dark:border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.3)]"
                    : ""
                }`}
              >
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${accent.line}`}
                />
                <div
                  className={`pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full blur-3xl transition-opacity duration-300 ${accent.glow} ${
                    isActiveService ? "opacity-100" : "opacity-40"
                  }`}
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      SERVICE {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                      {service.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${categoryStyle[service.category]}`}
                    >
                      {service.category}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <div className={`rounded-2xl border p-4 ${accent.panel}`}>
                    <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Starting Price
                    </p>
                    <p className="mt-1 font-outfit text-3xl font-black text-slate-900 dark:text-white">
                      {service.price}
                    </p>

                    <p className="mt-3 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Payable Now
                    </p>
                    <p className="mt-1 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
                      INR {service.amountInr}
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <div className={`rounded-2xl border p-3 ${accent.panel}`}>
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        Timeline
                      </p>
                      <p className="mt-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                        {service.turnaround}
                      </p>
                    </div>

                    <div className={`rounded-2xl border p-3 ${accent.panel}`}>
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        Engagement Model
                      </p>
                      <p className="mt-1 text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug">
                        {details.engagementModel}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-emerald-500/20 dark:bg-[#020803]/80">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Ideal For
                  </p>
                  <p className="mt-1 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                    {details.idealFor}
                  </p>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-emerald-500/20 dark:bg-[#020803]/80">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    What You Get
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    {details.deliverables.map((item) => (
                      <li
                        key={`${service.slug}-${item}`}
                        className="flex items-start gap-2"
                      >
                        <CheckCircle2
                          size={14}
                          className={`mt-0.5 shrink-0 ${accent.bullet}`}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-700 dark:border-emerald-500/20 dark:bg-[#020803]/80 dark:text-slate-300 font-medium leading-relaxed">
                  {service.summary}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    disabled={Boolean(
                      processingSlug && processingSlug !== service.slug,
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
                    className="flex-1 min-w-[180px]"
                  >
                    <CreditCard size={15} />
                    {isActiveService
                      ? isProcessing
                        ? "Opening Checkout..."
                        : "Proceed to Secure Checkout"
                      : "Pay and Book"}
                  </Button>

                  <Button
                    to="/contact"
                    variant="secondary"
                    className="flex-1 min-w-[160px]"
                  >
                    Custom Scope <ArrowRight size={15} />
                  </Button>
                </div>

                {isActiveService ? (
                  <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <p className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
                      Step 2: Secure Checkout Details
                    </p>
                    <p className="mt-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      Enter your details once. Cashfree opens after this with secure verification.
                    </p>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-300">
                        Full Name
                        <input
                          type="text"
                          value={buyerForm.customerName}
                          onChange={(event) =>
                            updateBuyerForm("customerName", event.target.value)
                          }
                          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white"
                          placeholder="Your full name"
                        />
                      </label>

                      <label className="text-xs font-bold text-slate-800 dark:text-slate-300">
                        Email
                        <input
                          type="email"
                          value={buyerForm.customerEmail}
                          onChange={(event) =>
                            updateBuyerForm("customerEmail", event.target.value)
                          }
                          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white"
                          placeholder="you@example.com"
                        />
                      </label>

                      <label className="text-xs font-bold text-slate-800 dark:text-slate-300 sm:col-span-2">
                        Phone (required for Cashfree)
                        <input
                          type="text"
                          value={buyerForm.customerPhone}
                          onChange={(event) =>
                            updateBuyerForm("customerPhone", event.target.value)
                          }
                          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white"
                          placeholder="9876543210"
                        />
                      </label>
                    </div>

                    <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
                      By continuing, you agree to transparent service terms and the 7-day refund policy.
                    </p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default ServicesPage;

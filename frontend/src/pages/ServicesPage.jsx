import { useState } from "react";
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
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import SeoHead from "@/components/seo/SeoHead";
import PaymentTrustPanel from "@/components/ui/PaymentTrustPanel";
import {
  createPaymentOrder,
  persistLatestReceipt,
} from "@/services/payment.service";
import { getErrorMessage } from "@/services/api";
import { loadCashfreeCheckout } from "@/utils/loadCashfree";
import { createBreadcrumbSchema } from "@/utils/seo";
import { SERVICE_OFFERINGS } from "@/constants/siteData";

const categoryStyle = {
  Guidance: "border-emerald-300/45 bg-emerald-300/10 text-emerald-200",
  "Career Support": "border-cyan-300/45 bg-cyan-300/10 text-cyan-200",
  "Build and Delivery": "border-violet-300/45 bg-violet-300/10 text-violet-200",
};

const serviceCardAccent = {
  Guidance: {
    card: "border-emerald-300/28 hover:border-emerald-300/52 hover:shadow-[0_26px_44px_-30px_rgba(52,211,153,0.75)]",
    glow: "bg-emerald-300/18",
    line: "bg-emerald-300/55",
    panel: "border-emerald-300/28 bg-emerald-300/10",
    bullet: "text-emerald-200",
  },
  "Career Support": {
    card: "border-cyan-300/28 hover:border-cyan-300/52 hover:shadow-[0_26px_44px_-30px_rgba(34,211,238,0.75)]",
    glow: "bg-cyan-300/18",
    line: "bg-cyan-300/55",
    panel: "border-cyan-300/28 bg-cyan-300/10",
    bullet: "text-cyan-200",
  },
  "Build and Delivery": {
    card: "border-violet-300/28 hover:border-violet-300/52 hover:shadow-[0_26px_44px_-30px_rgba(167,139,250,0.72)]",
    glow: "bg-violet-300/18",
    line: "bg-violet-300/55",
    panel: "border-violet-300/28 bg-violet-300/10",
    bullet: "text-violet-200",
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
      const scriptLoaded = await loadCashfreeCheckout();

      if (!scriptLoaded || typeof window.Cashfree !== "function") {
        throw new Error("Unable to load Cashfree checkout. Please try again.");
      }

      const orderResponse = await createPaymentOrder({
        serviceSlug: service.slug,
        customerName: buyerForm.customerName.trim(),
        customerEmail: buyerForm.customerEmail.trim(),
        customerPhone: buyerForm.customerPhone.replace(/\D/g, ""),
        idempotencyKey: generateIdempotencyKey(),
        notes: `Services page checkout for ${service.name}`,
      });

      const alreadyPaidReceipt = orderResponse?.data?.receipt;
      if (orderResponse?.data?.alreadyPaid && alreadyPaidReceipt) {
        persistLatestReceipt({
          receipt: alreadyPaidReceipt,
          serviceSlug: service.slug,
        });
        navigate("/payment/success");
        return;
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
        title="Services"
        description="Services by Nikhil Agrahari including mentorship, resume review, frontend/backend development, and full stack delivery."
        pathname="/services"
        keywords={[
          "Nikhil services",
          "Nikhil Lucknow mentorship",
          "Nikhil portfolio services",
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />

      <section className="section-wrap pt-12 sm:pt-20">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-4 lg:space-y-5">
            <SectionTitle
              eyebrow="Verified Services"
              title="Development and Guidance Services"
              description="Service categories, transparent pricing, and Cashfree checkout status."
            />

            <div className="flex flex-wrap gap-3">
              <Button to="/support" className="min-w-[200px]">
                <HeartHandshake size={16} /> Open Support Page
              </Button>
              <Button
                to="/contact"
                variant="secondary"
                className="min-w-[200px]"
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
                    className="card-surface rounded-2xl p-5"
                  >
                    <Icon size={20} className="text-cyan-200" />
                    <h2 className="mt-3 text-lg font-semibold text-cyan-100">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-300">
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
          <p className="mt-4 rounded-xl border border-rose-300/35 bg-rose-300/10 px-4 py-3 text-sm text-rose-200">
            {paymentError}
          </p>
        ) : null}
        {paymentInfo ? (
          <p className="mt-4 rounded-xl border border-emerald-300/35 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-200">
            {paymentInfo}
          </p>
        ) : null}
      </section>

      <section className="section-wrap section-divider pt-10">
        <SectionTitle
          eyebrow="Service Catalog"
          title="All Services"
          description="Compare services by category, price, and timeline."
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
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
                className={`card-surface group relative overflow-hidden rounded-[1.7rem] border bg-gradient-to-br from-slate-950/96 via-slate-950/92 to-[#051326] p-5 transition-all duration-300 motion-safe:hover:-translate-y-1.5 ${accent.card} ${
                  isActiveService
                    ? "border-cyan-200/58 shadow-[0_28px_44px_-32px_rgba(34,211,238,0.76)]"
                    : ""
                }`}
              >
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-px ${accent.line}`}
                />
                <div
                  className={`pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-100 ${accent.glow} ${
                    isActiveService ? "opacity-100" : "opacity-55"
                  }`}
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                      Service {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold leading-tight text-cyan-100 sm:text-[2rem]">
                      {service.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs ${categoryStyle[service.category] || "border-cyan-300/45 bg-cyan-300/10 text-cyan-200"}`}
                    >
                      {service.category}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-[1.05fr_0.95fr]">
                  <div className={`rounded-2xl border p-4 ${accent.panel}`}>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                      Starting Price
                    </p>
                    <p className="mt-1 font-display text-4xl leading-none text-cyan-100">
                      {service.price}
                    </p>

                    <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-slate-400">
                      Payable Now
                    </p>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-[0.13em] text-emerald-200">
                      INR {service.amountInr}
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <div
                      className={`rounded-xl border px-3 py-3 ${accent.panel}`}
                    >
                      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                        Timeline
                      </p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200">
                        {service.turnaround}
                      </p>
                    </div>

                    <div
                      className={`rounded-xl border px-3 py-3 ${accent.panel}`}
                    >
                      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                        Engagement Model
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-200">
                        {details.engagementModel}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-cyan-300/25 bg-slate-900/72 p-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                    Ideal For
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-200">
                    {details.idealFor}
                  </p>
                </div>

                <div className="mt-4 rounded-xl border border-cyan-300/25 bg-slate-900/72 p-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                    What You Get
                  </p>
                  <ul className="mt-2 space-y-2">
                    {details.deliverables.map((item) => (
                      <li
                        key={`${service.slug}-${item}`}
                        className="flex items-start gap-2 text-sm text-slate-200"
                      >
                        <CheckCircle2
                          size={15}
                          className={`mt-0.5 shrink-0 ${accent.bullet}`}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={`mt-4 rounded-xl border p-3 text-sm leading-6 ${accent.panel}`}
                >
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
                    className="flex-1 min-w-[180px] shadow-[0_14px_30px_-20px_rgba(34,211,238,0.86)] transition-all duration-300 group-hover:shadow-[0_20px_34px_-20px_rgba(34,211,238,0.95)]"
                  >
                    <CreditCard size={16} />
                    {isActiveService
                      ? isProcessing
                        ? "Opening Checkout..."
                        : "Proceed to Secure Checkout"
                      : "Pay and Book"}
                  </Button>

                  <Button
                    to="/contact"
                    variant="secondary"
                    className="flex-1 min-w-[160px] transition-all duration-300 group-hover:border-cyan-200/65"
                  >
                    Custom Scope <ArrowRight size={16} />
                  </Button>
                </div>

                {isActiveService ? (
                  <div className="mt-4 rounded-xl border border-cyan-300/28 bg-slate-900/76 p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-cyan-200">
                      Step 2: Secure Checkout Details
                    </p>
                    <p className="mt-1 text-sm text-slate-300">
                      Enter your details once. Cashfree opens after this with
                      secure verification.
                    </p>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <label className="text-xs text-slate-300">
                        Full Name
                        <input
                          type="text"
                          value={buyerForm.customerName}
                          onChange={(event) =>
                            updateBuyerForm("customerName", event.target.value)
                          }
                          className="mt-1 w-full rounded-xl border border-cyan-300/25 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300"
                          placeholder="Your full name"
                        />
                      </label>

                      <label className="text-xs text-slate-300">
                        Email
                        <input
                          type="email"
                          value={buyerForm.customerEmail}
                          onChange={(event) =>
                            updateBuyerForm("customerEmail", event.target.value)
                          }
                          className="mt-1 w-full rounded-xl border border-cyan-300/25 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300"
                          placeholder="you@example.com"
                        />
                      </label>

                      <label className="text-xs text-slate-300 sm:col-span-2">
                        Phone (required for Cashfree)
                        <input
                          type="text"
                          value={buyerForm.customerPhone}
                          onChange={(event) =>
                            updateBuyerForm("customerPhone", event.target.value)
                          }
                          className="mt-1 w-full rounded-xl border border-cyan-300/25 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300"
                          placeholder="9876543210"
                        />
                      </label>
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                      By continuing, you agree to transparent service terms and
                      the 7-day refund policy.
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

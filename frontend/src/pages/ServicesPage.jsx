import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  ShieldCheck,
  Layers,
  TimerReset,
  CreditCard,
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import PaymentTrustPanel from "@/components/ui/PaymentTrustPanel";
import {
  createPaymentOrder,
  persistLatestReceipt,
  verifyServicePayment,
} from "@/services/payment.service";
import { getErrorMessage } from "@/services/api";
import { loadRazorpayCheckout } from "@/utils/loadRazorpay";
import { QUICK_CONTACT, SERVICE_OFFERINGS } from "@/constants/siteData";

const categoryStyle = {
  Guidance: "border-emerald-300/45 bg-emerald-300/10 text-emerald-200",
  "Career Support": "border-cyan-300/45 bg-cyan-300/10 text-cyan-200",
  "Build and Delivery": "border-violet-300/45 bg-violet-300/10 text-violet-200",
  "Cyber Security": "border-amber-300/45 bg-amber-300/10 text-amber-200",
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

  const generateIdempotencyKey = () => {
    if (typeof window !== "undefined" && window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }

    return `svc-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const validateBuyerForm = () => {
    if (buyerForm.customerName.trim().length < 2) {
      return "Please enter a valid name before checkout.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerForm.customerEmail.trim())) {
      return "Please enter a valid email for payment confirmation.";
    }

    if (
      buyerForm.customerPhone.trim() &&
      !/^[0-9+\-\s]{8,18}$/.test(buyerForm.customerPhone.trim())
    ) {
      return "Phone number must be 8-18 characters and use valid symbols.";
    }

    return "";
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
      const scriptLoaded = await loadRazorpayCheckout();

      if (!scriptLoaded || typeof window.Razorpay === "undefined") {
        throw new Error("Unable to load Razorpay checkout. Please try again.");
      }

      const orderResponse = await createPaymentOrder({
        serviceSlug: service.slug,
        customerName: buyerForm.customerName.trim(),
        customerEmail: buyerForm.customerEmail.trim(),
        customerPhone: buyerForm.customerPhone.trim(),
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

      if (!checkout?.orderId || !checkout?.key) {
        throw new Error("Checkout initialization failed. Please retry.");
      }

      const razorpay = new window.Razorpay({
        key: checkout.key,
        amount: checkout.amount,
        currency: checkout.currency,
        name: checkout.name,
        description: checkout.description,
        order_id: checkout.orderId,
        prefill: checkout.prefill,
        notes: checkout.notes,
        theme: {
          color: "#22d3ee",
        },
        handler: async (response) => {
          setPaymentInfo("Payment received. Verifying transaction...");

          try {
            const verifyResponse = await verifyServicePayment(response);
            const receipt = verifyResponse?.data?.receipt;

            if (!receipt) {
              throw new Error(
                "Payment verified but receipt was not generated.",
              );
            }

            persistLatestReceipt({
              receipt,
              serviceSlug: service.slug,
              serviceName: service.name,
            });

            navigate("/payment/success");
          } catch (verificationError) {
            setPaymentError(
              getErrorMessage(
                verificationError,
                "Payment was completed but verification failed. Contact support with payment ID.",
              ),
            );
            setProcessingSlug("");
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentInfo("Payment popup closed. You can retry anytime.");
            setProcessingSlug("");
          },
        },
      });

      razorpay.on("payment.failed", (event) => {
        setPaymentError(
          event?.error?.description ||
            "Payment failed at gateway. Please retry or use support contact.",
        );
        setProcessingSlug("");
      });

      razorpay.open();
    } catch (error) {
      setPaymentError(
        getErrorMessage(error, "Could not initialize payment gateway."),
      );
      setProcessingSlug("");
    }
  };

  return (
    <>
      <Helmet>
        <title>Services | Nikhil Portfolio</title>
        <meta
          name="description"
          content="All services by Nikhil Agrahari including mentorship, resume review, full stack development, and authorized security review."
        />
      </Helmet>

      <section className="section-wrap pt-12 sm:pt-20">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <SectionTitle
            eyebrow="Verified Services"
            title="Build and Security Services in One Place"
            description="Transparent pricing, focused outcomes, and secure Razorpay checkout with verifiable receipt confirmation."
          />

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
        <div className="grid gap-4 md:grid-cols-3">
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
                <p className="mt-2 text-sm text-slate-300">{item.summary}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-wrap section-divider pt-10">
        <SectionTitle
          eyebrow="Service Catalog"
          title="All Services"
          description="Everything listed in one place for easy comparison by category, pricing, and turnaround expectation."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {SERVICE_OFFERINGS.map((service) => {
            const isActiveService = activeServiceSlug === service.slug;
            const isProcessing = processingSlug === service.slug;

            return (
              <article
                key={service.slug}
                className="card-surface rounded-2xl p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-2xl font-semibold text-cyan-100">
                    {service.name}
                  </h3>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs ${categoryStyle[service.category] || "border-cyan-300/45 bg-cyan-300/10 text-cyan-200"}`}
                  >
                    {service.category}
                  </span>
                </div>

                <p className="mt-3 font-display text-3xl text-cyan-100">
                  {service.price}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.15em] text-slate-500">
                  Timeline: {service.turnaround}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.15em] text-emerald-200">
                  Payable now: INR {service.amountInr}
                </p>

                <div className="mt-4 rounded-xl border border-emerald-300/30 bg-emerald-300/10 p-3 text-sm text-emerald-100">
                  {service.summary}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-md border border-cyan-300/25 bg-slate-900/70 px-2 py-1 text-xs text-slate-300">
                    Detailed scope via discussion
                  </span>
                  <span className="rounded-md border border-cyan-300/25 bg-slate-900/70 px-2 py-1 text-xs text-slate-300">
                    Transparent delivery updates
                  </span>
                  <span className="rounded-md border border-cyan-300/25 bg-slate-900/70 px-2 py-1 text-xs text-slate-300">
                    Student-friendly collaboration
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    disabled={Boolean(
                      processingSlug && processingSlug !== service.slug,
                    )}
                    className="flex-1 min-w-[180px]"
                    onClick={() => {
                      setPaymentError("");
                      setPaymentInfo("");

                      if (!isActiveService) {
                        setActiveServiceSlug(service.slug);
                        return;
                      }

                      handlePayAndBook(service);
                    }}
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
                    className="flex-1 min-w-[160px]"
                  >
                    Custom Scope <ArrowRight size={16} />
                  </Button>
                  <Button
                    href={QUICK_CONTACT.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    variant="ghost"
                    className="flex-1 min-w-[160px]"
                  >
                    WhatsApp Discussion
                  </Button>
                </div>

                {isActiveService ? (
                  <div className="mt-4 rounded-xl border border-cyan-300/25 bg-slate-900/70 p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-cyan-200">
                      Secure Checkout Details
                    </p>
                    <p className="mt-1 text-sm text-slate-300">
                      Enter your details once. Razorpay opens after this with
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
                        Phone (optional)
                        <input
                          type="text"
                          value={buyerForm.customerPhone}
                          onChange={(event) =>
                            updateBuyerForm("customerPhone", event.target.value)
                          }
                          className="mt-1 w-full rounded-xl border border-cyan-300/25 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300"
                          placeholder="+91 XXXXX XXXXX"
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

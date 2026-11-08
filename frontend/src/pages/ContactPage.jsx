import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Mail,
  MapPin,
  PhoneCall,
  Send,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Globe,
} from "lucide-react";
import Button from "@/components/ui/Button";
import SeoHead from "@/components/seo/SeoHead";
import { sendContactMessage } from "@/services/contact.service";
import { getErrorMessage } from "@/services/api";
import { createBreadcrumbSchema } from "@/utils/seo";
import {
  QUICK_CONTACT,
  SITE_PROFILE,
  SOCIAL_LINKS,
} from "@/constants/siteData";
import { SERVICE_OFFERINGS } from "@/data/servicesData";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

const ContactPage = () => {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [copiedField, setCopiedField] = useState("");

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const selectService = (serviceName) => {
    setFormData((previous) => ({
      ...previous,
      service: previous.service === serviceName ? "" : serviceName,
    }));
  };

  const handleCopy = (text, fieldName) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(""), 2000);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (formData.name.trim().length < 2) {
      setFormError("Please enter a valid name (at least 2 characters).");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (formData.phone && !/^[0-9+\-\s]{8,18}$/.test(formData.phone.trim())) {
      setFormError("Please enter a valid phone number (8-18 digits).");
      return;
    }

    if (formData.message.trim().length < 10) {
      setFormError("Message should be at least 10 characters long.");
      return;
    }

    setSubmitting(true);

    try {
      await sendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service: formData.service.trim(),
        message: formData.message.trim(),
      });
      setFormSuccess("Thank you! Your message has been sent successfully. I will get back to you within 12-24 hours.");
      setFormData(initialForm);
    } catch (error) {
      setFormError(
        getErrorMessage(
          error,
          "Could not send your message. Please try again or reach out directly via email.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SeoHead
        title="Contact Nikhil Agrahari | Best Full Stack Developer in Lucknow & Prayagraj"
        description="Get in touch with Nikhil Agrahari — premier Full Stack Developer & MERN Stack Engineer in Lucknow & Prayagraj. Available for web projects, freelance work, and technical collaborations."
        pathname="/contact"
        image={SITE_PROFILE.profileImage}
        imageAlt="Contact Nikhil Agrahari - Full Stack Developer Lucknow Prayagraj"
        keywords={[
          "contact best full stack developer in lucknow",
          "contact best full stack developer in prayagraj",
          "contact Nikhil Agrahari",
          "hire developer Lucknow Prayagraj",
          "freelance web developer contact",
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <section className="section-wrap pt-4 sm:pt-8 pb-24">
        {/* Centered Hero Header (Styled to align with Blog & Services Scale) */}
        <div className="relative text-center max-w-5xl mx-auto pt-6 sm:pt-10 pb-12 sm:pb-16">
          {/* Ambient Radial Lighting */}
          <div className="pointer-events-none absolute inset-0 -top-12 flex items-center justify-center">
            <div className="h-72 w-[34rem] rounded-full bg-lime-400/[0.07] dark:bg-lime-400/[0.12] blur-[130px]" />
          </div>

          <div className="relative">
            {/* Eyebrow Badge with Pulse */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-lime-500/30 dark:border-lime-300/20 bg-lime-500/[0.06] dark:bg-lime-300/[0.04] px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-lime-600 dark:text-lime-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-500 dark:bg-lime-300" />
                Available for Projects &amp; Collaborations
              </span>
            </motion.div>

            {/* Proportional Heading (Matching Blog & Services Page Scale) */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="mt-4 font-display text-[8.2vw] sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.05] tracking-tight text-zinc-900 dark:text-white"
            >
              GET IN
              <br />
              <span className="bg-gradient-to-r from-lime-300 to-lime-500 bg-clip-text text-transparent">
                TOUCH
              </span>
            </motion.h1>

            {/* Subtitle Details */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-zinc-500 dark:text-zinc-400 sm:text-base font-normal"
            >
              Direct contact channels, project brief submissions, and rapid turnaround SLAs for full-stack web engineering, custom SaaS solutions, and technical collaborations.
            </motion.p>

            {/* Quick Action CTA Pill Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.25 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <a
                href={`mailto:${QUICK_CONTACT.email}`}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60 px-4 py-2 text-xs font-bold text-zinc-800 dark:text-zinc-200 shadow-sm backdrop-blur-md hover:border-lime-400 hover:text-zinc-950 dark:hover:text-white transition-all"
              >
                <Mail size={14} className="text-lime-500 dark:text-lime-400" />
                Direct Email
              </a>
              {QUICK_CONTACT.whatsapp ? (
                <a
                  href={QUICK_CONTACT.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60 px-4 py-2 text-xs font-bold text-zinc-800 dark:text-zinc-200 shadow-sm backdrop-blur-md hover:border-lime-400 hover:text-zinc-950 dark:hover:text-white transition-all"
                >
                  <MessageSquare size={14} className="text-emerald-500 dark:text-emerald-400" />
                  Quick WhatsApp
                </a>
              ) : null}
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-xl border border-lime-500/30 bg-lime-500/[0.08] dark:bg-lime-400/[0.06] px-4 py-2 text-xs font-bold text-lime-700 dark:text-lime-300 shadow-sm backdrop-blur-md hover:border-lime-400 hover:bg-lime-500/15 transition-all"
              >
                <Sparkles size={14} />
                Explore Packages &rarr;
              </Link>
            </motion.div>

            {/* Core Stats Capsule (Matching Blog & Services Structure) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3 }}
              className="mx-auto mt-12 max-w-4xl rounded-[2rem] border border-zinc-200 dark:border-white/[0.08] bg-white/80 dark:bg-zinc-950/40 p-6 backdrop-blur-xl shadow-sm dark:shadow-none"
            >
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:divide-x md:divide-zinc-200 dark:md:divide-white/[0.08]">
                {[
                  { label: "Response SLA", value: "Within 12-24h", color: "text-lime-500 dark:text-lime-300" },
                  { label: "Direct Channels", value: "Email & Phone", color: "text-zinc-900 dark:text-white" },
                  { label: "Work Location", value: "Lucknow / Remote", color: "text-zinc-900 dark:text-white" },
                  { label: "Availability", value: "OPEN FOR WORK", color: "text-amber-600 dark:text-amber-500" },
                ].map(({ label, value, color }, i) => (
                  <div key={label} className={`flex flex-col items-center justify-center ${i > 0 ? "md:pl-4" : ""}`}>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-600 mb-1">
                      {label}
                    </span>
                    <span className={`text-xl font-black tracking-tight ${color}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content Layout Grid (Inquiry Brief + Direct Channels Hub) */}
        <div className="grid gap-6 lg:grid-cols-3 items-start">
          
          {/* Main Inquiry Brief Form (2 Columns) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 rounded-[2rem] border border-zinc-200 dark:border-white/[0.08] bg-white/80 dark:bg-zinc-950/40 p-6 sm:p-9 shadow-sm dark:shadow-none backdrop-blur-xl relative overflow-hidden"
          >
            {/* Subtle glow orb */}
            <div className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-lime-400/[0.06] dark:bg-lime-400/[0.08] blur-3xl" />

            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col justify-between h-full">
              <div>
                {/* Form Header */}
                <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 dark:border-white/[0.08] pb-5">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-lime-600 dark:text-lime-400">
                      // PROJECT BRIEF
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mt-1">
                      Tell Me About Your Project
                    </h2>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-lime-500/30 bg-lime-500/[0.08] dark:bg-lime-400/[0.06] px-3.5 py-1.5 text-xs font-bold text-lime-700 dark:text-lime-300">
                    <Clock size={13} /> Guaranteed 12–24h Reply
                  </div>
                </div>

                {/* Form Input Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Your Name <span className="text-lime-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-zinc-900/60 px-4 py-3 text-xs sm:text-sm font-medium text-zinc-900 dark:text-white outline-none focus:border-lime-500 dark:focus:border-lime-400 focus:ring-2 focus:ring-lime-500/20 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition"
                      placeholder="e.g. Alex Rivera"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Email Address <span className="text-lime-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-zinc-900/60 px-4 py-3 text-xs sm:text-sm font-medium text-zinc-900 dark:text-white outline-none focus:border-lime-500 dark:focus:border-lime-400 focus:ring-2 focus:ring-lime-500/20 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition"
                      placeholder="alex@company.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Phone Number <span className="text-zinc-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-zinc-900/60 px-4 py-3 text-xs sm:text-sm font-medium text-zinc-900 dark:text-white outline-none focus:border-lime-500 dark:focus:border-lime-400 focus:ring-2 focus:ring-lime-500/20 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition"
                      placeholder="e.g. +91 9876543210"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Required Service <span className="text-zinc-400 font-normal">(Optional)</span>
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-zinc-900/60 px-4 py-3 text-xs sm:text-sm font-medium text-zinc-900 dark:text-white outline-none focus:border-lime-500 dark:focus:border-lime-400 focus:ring-2 focus:ring-lime-500/20 transition"
                    >
                      <option value="" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">
                        Select a category
                      </option>
                      {SERVICE_OFFERINGS.map((item) => (
                        <option key={item.slug} value={item.name} className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">
                          {item.name}
                        </option>
                      ))}
                      <option value="Custom Project Scope" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">
                        Custom Project Scope
                      </option>
                    </select>
                  </div>
                </div>

                {/* Quick Service Selection Pills */}
                <div className="mt-4">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                    Or select service topic:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_OFFERINGS.map((item) => {
                      const isSelected = formData.service === item.name;
                      return (
                        <button
                          key={item.slug}
                          type="button"
                          onClick={() => selectService(item.name)}
                          className={`rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
                            isSelected
                              ? "border-lime-500 bg-lime-400 text-zinc-950 shadow-[0_0_12px_rgba(163,230,53,0.3)]"
                              : "border-zinc-200 bg-zinc-100/70 text-zinc-700 hover:border-lime-400/50 hover:text-zinc-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:border-lime-400/50 dark:hover:text-white"
                          }`}
                        >
                          {item.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="mt-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Project Message &amp; Goals <span className="text-lime-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={(e) => {
                      handleChange(e);
                      e.target.style.height = "auto";
                      e.target.style.height = `${Math.max(120, e.target.scrollHeight)}px`;
                    }}
                    rows={4}
                    placeholder="Outline your project scope, core features, budget, target launch date, or questions..."
                    className="w-full resize-none min-h-[120px] overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-zinc-900/60 px-4 py-3.5 text-xs sm:text-sm font-medium text-zinc-900 dark:text-white outline-none focus:border-lime-500 dark:focus:border-lime-400 focus:ring-2 focus:ring-lime-500/20 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-[height] duration-150"
                    required
                  />
                </div>

                {/* Alert Messages */}
                {formError ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-bold text-rose-600 dark:text-rose-400"
                  >
                    {formError}
                  </motion.div>
                ) : null}

                {formSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center gap-2.5 rounded-2xl border border-lime-500/40 bg-lime-500/10 p-4 text-xs font-bold text-lime-700 dark:text-lime-300"
                  >
                    <CheckCircle2 size={18} className="shrink-0 text-lime-500 dark:text-lime-400" />
                    <span>{formSuccess}</span>
                  </motion.div>
                ) : null}
              </div>

              {/* Form Action Footer */}
              <div className="mt-7 pt-5 border-t border-zinc-200 dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  🔒 Confidential inquiry. Zero spam guaranteed.
                </span>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto min-w-[180px]"
                >
                  {submitting ? "Sending..." : "Submit Inquiry"} <Send size={15} />
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Right Column: Direct Channels & Expectations Hub */}
          <div className="space-y-6">
            
            {/* Direct Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-[2rem] border border-zinc-200 dark:border-white/[0.08] bg-white/80 dark:bg-zinc-950/40 p-6 sm:p-7 shadow-sm dark:shadow-none backdrop-blur-xl"
            >
              <div className="mb-5 pb-4 border-b border-zinc-200 dark:border-white/[0.08]">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-lime-600 dark:text-lime-400">
                  // DIRECT CHANNELS
                </span>
                <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white mt-1">
                  Connect Directly
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Have an urgent project timeline or prefer direct messaging?
                </p>
              </div>

              {/* Direct Communication Action Rows */}
              <div className="space-y-3">
                {/* Email Item */}
                <div className="group rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/50 p-3.5 transition-all duration-200 hover:border-lime-400/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      <Mail size={13} className="text-lime-500 dark:text-lime-400" /> Primary Email
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(QUICK_CONTACT.email, "email")}
                      className="text-[11px] font-bold text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1"
                      title="Copy email to clipboard"
                    >
                      {copiedField === "email" ? (
                        <>
                          <Check size={12} /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={12} /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <a
                    href={`mailto:${QUICK_CONTACT.email}`}
                    className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white hover:text-lime-600 dark:hover:text-lime-300 truncate block"
                  >
                    {QUICK_CONTACT.email}
                  </a>
                </div>

                {/* Phone / WhatsApp Item */}
                <div className="group rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/50 p-3.5 transition-all duration-200 hover:border-lime-400/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      <PhoneCall size={13} className="text-emerald-500 dark:text-emerald-400" /> Phone &amp; WhatsApp
                    </span>
                    {QUICK_CONTACT.whatsapp ? (
                      <a
                        href={QUICK_CONTACT.whatsapp}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        WhatsApp <ExternalLink size={11} />
                      </a>
                    ) : null}
                  </div>
                  <a
                    href={`tel:${QUICK_CONTACT.phone.replace(/\s+/g, "")}`}
                    className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white hover:text-lime-600 dark:hover:text-lime-300 block"
                  >
                    {QUICK_CONTACT.phone}
                  </a>
                </div>

                {/* Location Item */}
                <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/50 p-3.5">
                  <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                    <MapPin size={13} className="text-amber-500 dark:text-amber-400" /> Location &amp; Timezone
                  </span>
                  <p className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white">
                    {SITE_PROFILE.location} <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">• IST (UTC+5:30)</span>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* "What Happens Next" 3-Step Process Card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-[2rem] border border-zinc-200 dark:border-white/[0.08] bg-white/80 dark:bg-zinc-950/40 p-6 sm:p-7 shadow-sm dark:shadow-none backdrop-blur-xl"
            >
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-lime-600 dark:text-lime-400">
                // WHAT TO EXPECT
              </span>
              <h3 className="text-lg font-black text-zinc-900 dark:text-white mt-1 mb-4">
                Transparent Next Steps
              </h3>

              <div className="space-y-3.5">
                {[
                  {
                    step: "01",
                    title: "Inquiry Review",
                    desc: "I review your requirements, technical needs, and timeline within 12 hours.",
                  },
                  {
                    step: "02",
                    title: "Quick Discovery Chat",
                    desc: "We discuss key deliverables, architecture, and milestones via email or call.",
                  },
                  {
                    step: "03",
                    title: "Clear Proposal & Launch",
                    desc: "Fixed timeline, upfront transparent pricing, and immediate sprint kickoff.",
                  },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-3 items-start">
                    <span className="shrink-0 flex items-center justify-center h-6 w-6 rounded-lg font-mono text-[11px] font-black bg-lime-500/10 text-lime-700 dark:text-lime-300 border border-lime-500/30">
                      {step}
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-zinc-900 dark:text-white">
                        {title}
                      </h4>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed mt-0.5">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Callout to Services Page */}
              <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-white/[0.08]">
                <p className="text-xs text-zinc-600 dark:text-zinc-300 mb-3 leading-relaxed">
                  Looking for fixed-price packages with instant checkout?
                </p>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-lime-600 dark:text-lime-400 hover:text-lime-500 dark:hover:text-lime-300 hover:underline"
                >
                  View Services &amp; Packages <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>

          </div>

        </div>
      </section>
    </>
  );
};

export default ContactPage;

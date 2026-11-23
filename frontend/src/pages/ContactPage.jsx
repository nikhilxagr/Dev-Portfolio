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
  Lock,
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

const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;

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
        title="Contact Nikhil Agrahari | Full-Stack Engineer"
        description="Get in touch with Nikhil Agrahari — Full-Stack Engineer (React, Node.js, MongoDB) based in Lucknow & Prayagraj. Open to software engineering internships, freelance builds, and collaborations."
        pathname="/contact"
        image={SITE_PROFILE.profileImage}
        imageAlt="Contact Nikhil Agrahari — Full-Stack Engineer"
        keywords={[
          "contact Nikhil Agrahari",
          "full stack engineer lucknow",
          "full stack developer prayagraj",
          "hire developer Lucknow Prayagraj",
          "freelance web developer contact",
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
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
                Available for Projects &amp; Collaborations
              </span>
            </MotionDiv>

            {/* Proportional Heading */}
            <MotionH1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.08] tracking-tight text-slate-900 dark:text-[#eef0f5]"
            >
              Get In{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                Touch
              </span>
            </MotionH1>

            {/* Subtitle Details */}
            <MotionP
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8] sm:text-base"
            >
              Direct contact channels, project brief submissions, and rapid turnaround SLAs for full-stack web engineering, custom SaaS solutions, and technical collaborations.
            </MotionP>

            {/* Quick Action CTA Pill Buttons */}
            <MotionDiv
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 flex flex-wrap items-center justify-center gap-3"
            >
              <a
                href={`mailto:${QUICK_CONTACT.email}`}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-black/[0.08] bg-white px-4 text-xs font-medium text-slate-800 hover:border-slate-300 hover:text-slate-950 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#d1d5df] dark:hover:border-white/[0.16] dark:hover:text-[#eef0f5] transition-colors duration-150"
              >
                <Mail size={15} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
                Direct Email
              </a>
              {QUICK_CONTACT.whatsapp ? (
                <a
                  href={QUICK_CONTACT.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-black/[0.08] bg-white px-4 text-xs font-medium text-slate-800 hover:border-slate-300 hover:text-slate-950 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#d1d5df] dark:hover:border-white/[0.16] dark:hover:text-[#eef0f5] transition-colors duration-150"
                >
                  <MessageSquare size={15} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
                  Quick WhatsApp
                </a>
              ) : null}
              <Link
                to="/services"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-emerald-600/30 bg-emerald-500/10 px-4 text-xs font-medium text-emerald-700 hover:bg-emerald-500/15 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/20 transition-colors duration-150"
              >
                Explore Packages <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
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
                  { label: "Response SLA", value: "Within 12-24h", color: "text-emerald-600 dark:text-emerald-400" },
                  { label: "Direct Channels", value: "Email & Phone", color: "text-slate-900 dark:text-[#eef0f5]" },
                  { label: "Work Location", value: "Lucknow / Remote", color: "text-slate-900 dark:text-[#eef0f5]" },
                  { label: "Availability", value: "Open for Work", color: "text-emerald-600 dark:text-emerald-400" },
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

        {/* Content Layout Grid (Inquiry Brief + Direct Channels Hub) */}
        <div className="grid gap-6 lg:grid-cols-3 items-start">
          
          {/* Main Inquiry Brief Form (2 Columns) */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-2 rounded-2xl border border-black/[0.08] bg-white p-6 sm:p-9 dark:border-white/[0.08] dark:bg-[#11141c]"
          >
            <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full">
              <div>
                {/* Form Header */}
                <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.08] dark:border-white/[0.08] pb-5">
                  <div>
                    <span className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      Project Brief
                    </span>
                    <h2 className="mt-1 font-display text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-[#eef0f5]">
                      Tell Me About Your Project
                    </h2>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-500/[0.08] px-3.5 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <Clock size={14} strokeWidth={1.5} /> Guaranteed 12–24h Reply
                  </div>
                </div>

                {/* Form Input Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#d1d5df]">
                      Your Name <span className="text-emerald-600 dark:text-emerald-400">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="h-10 w-full rounded-lg border border-black/[0.08] bg-[#f8fafc] px-3.5 text-sm text-slate-900 outline-none transition-colors duration-150 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 placeholder:text-slate-400 dark:border-white/[0.08] dark:bg-[#090a0f] dark:text-[#eef0f5] dark:placeholder:text-[#7a8296] dark:focus:border-emerald-500"
                      placeholder="e.g. Alex Rivera"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#d1d5df]">
                      Email Address <span className="text-emerald-600 dark:text-emerald-400">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-10 w-full rounded-lg border border-black/[0.08] bg-[#f8fafc] px-3.5 text-sm text-slate-900 outline-none transition-colors duration-150 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 placeholder:text-slate-400 dark:border-white/[0.08] dark:bg-[#090a0f] dark:text-[#eef0f5] dark:placeholder:text-[#7a8296] dark:focus:border-emerald-500"
                      placeholder="alex@company.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#d1d5df]">
                      Phone Number <span className="text-slate-400 font-normal dark:text-[#7a8296]">(Optional)</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="h-10 w-full rounded-lg border border-black/[0.08] bg-[#f8fafc] px-3.5 text-sm text-slate-900 outline-none transition-colors duration-150 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 placeholder:text-slate-400 dark:border-white/[0.08] dark:bg-[#090a0f] dark:text-[#eef0f5] dark:placeholder:text-[#7a8296] dark:focus:border-emerald-500"
                      placeholder="e.g. +91 9876543210"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-service" className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#d1d5df]">
                      Required Service <span className="text-slate-400 font-normal dark:text-[#7a8296]">(Optional)</span>
                    </label>
                    <select
                      id="contact-service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="h-10 w-full rounded-lg border border-black/[0.08] bg-[#f8fafc] px-3.5 text-sm text-slate-900 outline-none transition-colors duration-150 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 dark:border-white/[0.08] dark:bg-[#090a0f] dark:text-[#eef0f5] dark:focus:border-emerald-500"
                    >
                      <option value="" className="bg-white text-slate-900 dark:bg-[#11141c] dark:text-[#eef0f5]">
                        Select a category
                      </option>
                      {SERVICE_OFFERINGS.map((item) => (
                        <option key={item.slug} value={item.name} className="bg-white text-slate-900 dark:bg-[#11141c] dark:text-[#eef0f5]">
                          {item.name}
                        </option>
                      ))}
                      <option value="Custom Project Scope" className="bg-white text-slate-900 dark:bg-[#11141c] dark:text-[#eef0f5]">
                        Custom Project Scope
                      </option>
                    </select>
                  </div>
                </div>

                {/* Quick Service Selection Pills */}
                <div className="mt-5">
                  <span className="mb-2 block text-xs font-medium text-slate-500 dark:text-[#7a8296]">
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
                          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-slate-950"
                              : "border-black/[0.08] bg-[#f8fafc] text-slate-700 hover:border-slate-300 hover:text-slate-950 dark:border-white/[0.08] dark:bg-[#090a0f] dark:text-[#a3a9b8] dark:hover:border-white/[0.16] dark:hover:text-[#eef0f5]"
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
                  <label htmlFor="contact-message" className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#d1d5df]">
                    Project Message &amp; Goals <span className="text-emerald-600 dark:text-emerald-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={(e) => {
                      handleChange(e);
                      e.target.style.height = "auto";
                      e.target.style.height = `${Math.max(120, e.target.scrollHeight)}px`;
                    }}
                    rows={4}
                    placeholder="Outline your project scope, core features, budget, target launch date, or questions..."
                    className="w-full resize-none min-h-[120px] overflow-hidden rounded-lg border border-black/[0.08] bg-[#f8fafc] px-3.5 py-3 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 placeholder:text-slate-400 dark:border-white/[0.08] dark:bg-[#090a0f] dark:text-[#eef0f5] dark:placeholder:text-[#7a8296] dark:focus:border-emerald-500 transition-[height] duration-150"
                    required
                  />
                </div>

                {/* Alert Messages */}
                {formError ? (
                  <MotionDiv
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-medium text-rose-700 dark:text-rose-400"
                  >
                    {formError}
                  </MotionDiv>
                ) : null}

                {formSuccess ? (
                  <MotionDiv
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-500/35 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-700 dark:text-emerald-300"
                  >
                    <CheckCircle2 size={18} strokeWidth={1.5} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>{formSuccess}</span>
                  </MotionDiv>
                ) : null}
              </div>

              {/* Form Action Footer */}
              <div className="mt-7 pt-5 border-t border-black/[0.08] dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#7a8296]">
                  <Lock size={14} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
                  Confidential inquiry. Zero spam guaranteed.
                </span>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto min-w-[180px]"
                >
                  {submitting ? "Sending..." : "Submit Inquiry"} <Send size={15} strokeWidth={1.5} />
                </Button>
              </div>
            </form>
          </MotionDiv>

          {/* Right Column: Direct Channels & Expectations Hub */}
          <div className="space-y-6">
            
            {/* Direct Contact Card */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="rounded-2xl border border-black/[0.08] bg-white p-6 sm:p-7 dark:border-white/[0.08] dark:bg-[#11141c]"
            >
              <div className="mb-5 pb-4 border-b border-black/[0.08] dark:border-white/[0.08]">
                <span className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  Direct Channels
                </span>
                <h3 className="mt-1 font-display text-lg sm:text-xl font-semibold tracking-tight text-slate-900 dark:text-[#eef0f5]">
                  Connect Directly
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-[#a3a9b8] leading-relaxed">
                  Have an urgent project timeline or prefer direct messaging?
                </p>
              </div>

              {/* Direct Communication Action Rows */}
              <div className="space-y-3">
                {/* Email Item */}
                <div className="group rounded-xl border border-black/[0.08] bg-[#f8fafc] p-3.5 transition-colors duration-150 hover:border-emerald-600/40 dark:border-white/[0.08] dark:bg-[#090a0f] dark:hover:border-emerald-500/40">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-[#7a8296]">
                      <Mail size={14} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" /> Primary Email
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(QUICK_CONTACT.email, "email")}
                      className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      title="Copy email to clipboard"
                    >
                      {copiedField === "email" ? (
                        <>
                          <Check size={12} strokeWidth={1.5} /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={12} strokeWidth={1.5} /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <a
                    href={`mailto:${QUICK_CONTACT.email}`}
                    className="text-sm font-medium text-slate-900 dark:text-[#eef0f5] hover:text-emerald-600 dark:hover:text-emerald-400 truncate block"
                  >
                    {QUICK_CONTACT.email}
                  </a>
                </div>

                {/* Phone / WhatsApp Item */}
                <div className="group rounded-xl border border-black/[0.08] bg-[#f8fafc] p-3.5 transition-colors duration-150 hover:border-emerald-600/40 dark:border-white/[0.08] dark:bg-[#090a0f] dark:hover:border-emerald-500/40">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-[#7a8296]">
                      <PhoneCall size={14} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" /> Phone &amp; WhatsApp
                    </span>
                    {QUICK_CONTACT.whatsapp ? (
                      <a
                        href={QUICK_CONTACT.whatsapp}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        WhatsApp <ExternalLink size={12} strokeWidth={1.5} />
                      </a>
                    ) : null}
                  </div>
                  <a
                    href={`tel:${QUICK_CONTACT.phone.replace(/\s+/g, "")}`}
                    className="text-sm font-medium text-slate-900 dark:text-[#eef0f5] hover:text-emerald-600 dark:hover:text-emerald-400 block tabular-nums"
                  >
                    {QUICK_CONTACT.phone}
                  </a>
                </div>

                {/* Location Item */}
                <div className="rounded-xl border border-black/[0.08] bg-[#f8fafc] p-3.5 dark:border-white/[0.08] dark:bg-[#090a0f]">
                  <span className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-[#7a8296] mb-1">
                    <MapPin size={14} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" /> Location &amp; Timezone
                  </span>
                  <p className="text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
                    {SITE_PROFILE.location} <span className="text-xs font-normal text-slate-500 dark:text-[#7a8296]">· IST (UTC+5:30)</span>
                  </p>
                </div>
              </div>
            </MotionDiv>

            {/* "What Happens Next" 3-Step Process Card */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="rounded-2xl border border-black/[0.08] bg-white p-6 sm:p-7 dark:border-white/[0.08] dark:bg-[#11141c]"
            >
              <span className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                What to Expect
              </span>
              <h3 className="mt-1 mb-4 font-display text-lg font-semibold tracking-tight text-slate-900 dark:text-[#eef0f5]">
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
                    <span className="shrink-0 flex items-center justify-center h-6 w-6 rounded-md font-mono text-xs font-semibold tabular-nums bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                      {step}
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-[#eef0f5]">
                        {title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-[#a3a9b8] leading-relaxed mt-0.5">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Callout to Services Page */}
              <div className="mt-6 pt-5 border-t border-black/[0.08] dark:border-white/[0.08]">
                <p className="text-xs text-slate-600 dark:text-[#a3a9b8] mb-3 leading-relaxed">
                  Looking for fixed-price packages with instant checkout?
                </p>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  View Services &amp; Packages <ArrowRight size={14} strokeWidth={1.5} />
                </Link>
              </div>
            </MotionDiv>

          </div>

        </div>
      </section>
    </>
  );
};

export default ContactPage;

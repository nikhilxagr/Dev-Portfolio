import { useState } from "react";
import { ExternalLink, Mail, MapPin, PhoneCall, Send, CheckCircle2, Clock } from "lucide-react";
import Button from "@/components/ui/Button";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import { sendContactMessage } from "@/services/contact.service";
import { getErrorMessage } from "@/services/api";
import { createBreadcrumbSchema } from "@/utils/seo";
import {
  QUICK_CONTACT,
  SERVICE_OFFERINGS,
  SITE_PROFILE,
} from "@/constants/siteData";

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

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const selectService = (serviceName) => {
    setFormData((previous) => ({
      ...previous,
      service: serviceName,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (formData.name.trim().length < 2) {
      setFormError("Please enter a valid name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (formData.phone && !/^[0-9+\-\s]{8,18}$/.test(formData.phone.trim())) {
      setFormError("Please enter a valid phone number.");
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
      setFormSuccess("Message sent successfully. I will get back to you within 12-24 hours.");
      setFormData(initialForm);
    } catch (error) {
      setFormError(
        getErrorMessage(
          error,
          "Could not send your message. Please try again.",
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
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      {/* Contact Page Content */}
      <section className="section-wrap pt-4 sm:pt-6 pb-20">
        
        {/* Hero Header */}
        <FadeInUp>
          <div className="text-center max-w-4xl mx-auto mb-10">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-wider text-slate-900 dark:text-white drop-shadow-sm">
              GET IN <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">TOUCH</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Direct contact channels, enquiry form, and response SLAs for web engineering projects, freelance work, and technical collaborations.
            </p>
          </div>
        </FadeInUp>

        {/* Content Layout Grid */}
        <div className="grid gap-6 lg:grid-cols-3 items-start">
          
          {/* Contact Form */}
          <form
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/95 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] lg:col-span-2 flex flex-col justify-between"
            onSubmit={handleSubmit}
          >
            <div className="pointer-events-none absolute -top-14 -right-12 h-36 w-36 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 blur-3xl" />

            <div>
              {/* Form Header */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5 dark:border-slate-800/80">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    // SEND AN ENQUIRY
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                    Project &amp; Collaboration Brief
                  </h2>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <Clock size={14} /> SLA: Response within 12-24h
                </div>
              </div>

              {/* Form Inputs */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Name <span className="text-emerald-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 transition"
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address <span className="text-emerald-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 transition"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 transition"
                    placeholder="e.g. +91 9876543210"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Required Service <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white transition"
                  >
                    <option value="" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Select a service category</option>
                    {SERVICE_OFFERINGS.map((item) => (
                      <option key={item.slug} value={item.name} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Service Selection Pills */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {SERVICE_OFFERINGS.slice(0, 6).map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => selectService(item.name)}
                    className={`rounded-xl border px-3 py-1 text-[11px] font-bold transition-all duration-200 ${
                      formData.service === item.name
                        ? "border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 dark:border-emerald-400 dark:bg-emerald-500/20 shadow-sm"
                        : "border-slate-200 bg-slate-100/70 text-slate-700 hover:border-emerald-400 dark:border-emerald-500/20 dark:bg-[#020803]/60 dark:text-slate-300 dark:hover:border-emerald-400"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {/* Message Input */}
              <div className="mt-4">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Project Message &amp; Goals <span className="text-emerald-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={(e) => {
                    handleChange(e);
                    e.target.style.height = "auto";
                    e.target.style.height = `${Math.max(100, e.target.scrollHeight)}px`;
                  }}
                  rows={3}
                  placeholder="Describe your project, timeline, budget range, or inquiry details..."
                  className="w-full resize-none min-h-[100px] overflow-hidden rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-[height] duration-150"
                  required
                />
              </div>

              {/* Form Status Messages */}
              {formError ? (
                <div className="mt-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-bold text-rose-600 dark:text-rose-400">
                  {formError}
                </div>
              ) : null}
              {formSuccess ? (
                <div className="mt-3 flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 size={16} /> {formSuccess}
                </div>
              ) : null}
            </div>

            {/* Form Footer / Action */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-4">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
                🔒 Your contact info is kept strictly confidential.
              </span>
              <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                {submitting ? "Sending..." : "Send Inquiry"} <Send size={15} />
              </Button>
            </div>
          </form>

          {/* Contact Info Sidebar - Focused cleanly on Direct Contact Channels (Matching User Specification) */}
          <aside className="rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/95 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)]">
            <div className="mb-5 pb-4 border-b border-slate-200 dark:border-slate-800/80">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                // CONTACT HUB
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                All Contact Channels
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                Open to freelance projects, custom web development, and collaboration.
              </p>
            </div>

            {/* Direct Channels (Only the channels requested) */}
            <div className="space-y-3">
              <a
                href={`mailto:${QUICK_CONTACT.email}`}
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-50/50 hover:shadow-sm dark:border-emerald-500/20 dark:bg-[#020803]/80 dark:hover:border-emerald-400 dark:hover:bg-emerald-500/10"
              >
                <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  <Mail size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">{QUICK_CONTACT.email}</span>
                </span>
                <ExternalLink size={14} className="shrink-0 text-slate-400 transition group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href={`tel:${QUICK_CONTACT.phone.replace(/\s+/g, "")}`}
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-50/50 hover:shadow-sm dark:border-emerald-500/20 dark:bg-[#020803]/80 dark:hover:border-emerald-400 dark:hover:bg-emerald-500/10"
              >
                <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  <PhoneCall size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">{QUICK_CONTACT.phone}</span>
                </span>
                <ExternalLink size={14} className="shrink-0 text-slate-400 transition group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-xs sm:text-sm font-bold text-slate-800 dark:border-emerald-500/20 dark:bg-[#020803]/80 dark:text-slate-200">
                <MapPin size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{SITE_PROFILE.location}</span>
              </div>
            </div>
          </aside>

        </div>
      </section>
    </>
  );
};

export default ContactPage;

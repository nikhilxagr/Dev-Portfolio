import { useState } from "react";
import { ExternalLink, Mail, MapPin, PhoneCall, Send, CheckCircle2, Clock } from "lucide-react";
import Button from "@/components/ui/Button";
import SeoHead from "@/components/seo/SeoHead";
import FadeInUp from "@/components/animations/FadeInUp";
import { useTheme } from "@/context/ThemeContext";
import { sendContactMessage } from "@/services/contact.service";
import { getErrorMessage } from "@/services/api";
import { createBreadcrumbSchema } from "@/utils/seo";
import {
  QUICK_CONTACT,
  SERVICE_OFFERINGS,
  SITE_PROFILE,
  SOCIAL_LINKS,
} from "@/constants/siteData";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

const getContactPlatforms = (isDark) => {
  const neutralBrand = isDark ? "ffffff" : "0f172a";

  const contactPlatformMap = {
    GitHub: {
      href: QUICK_CONTACT.github,
      logo: `https://cdn.simpleicons.org/github/${neutralBrand}`,
    },
    LinkedIn: {
      href: QUICK_CONTACT.linkedin,
      logo: "/images/brand/linkedin.svg",
    },
    Instagram: {
      href: "https://www.instagram.com/nikhilxagr/",
      logo: "https://cdn.simpleicons.org/instagram/E4405F",
    },
    Medium: {
      href: QUICK_CONTACT.medium,
      logo: `https://cdn.simpleicons.org/medium/${neutralBrand}`,
    },
    TryHackMe: {
      href: QUICK_CONTACT.tryhackme,
      logo: "https://cdn.simpleicons.org/tryhackme/E11D48",
    },
    WhatsApp: {
      href: QUICK_CONTACT.whatsapp,
      logo: "https://cdn.simpleicons.org/whatsapp/25D366",
    },
  };

  return [
    ...SOCIAL_LINKS.map((item) => ({
      label: item.label,
      href: item.href,
      ...(contactPlatformMap[item.label] || {}),
    })),
    {
      label: "LeetCode",
      href: QUICK_CONTACT.leetcode,
      logo: "https://cdn.simpleicons.org/leetcode/FFA116",
    },
    {
      label: "GeeksforGeeks",
      href: QUICK_CONTACT.gfg,
      logo: "https://cdn.simpleicons.org/geeksforgeeks/2F8D46",
    },
  ];
};

const ContactPage = () => {
  const { isDark } = useTheme();
  const allContactPlatforms = getContactPlatforms(isDark);

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
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Contact Form */}
          <form
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/95 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] lg:col-span-2 flex flex-col justify-between"
            onSubmit={handleSubmit}
          >
            <div className="pointer-events-none absolute -top-14 -right-12 h-36 w-36 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 blur-3xl" />

            <div>
              {/* Form Header */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5 dark:border-slate-800/80">
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
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white"
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
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white"
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
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white"
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
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white"
                  >
                    <option value="">Select a service category</option>
                    {SERVICE_OFFERINGS.map((item) => (
                      <option key={item.slug} value={item.name}>
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
                        ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-500/20 dark:text-emerald-300 shadow-sm"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-400 dark:border-emerald-500/20 dark:bg-[#020803]/60 dark:text-slate-300 dark:hover:border-emerald-400"
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
                  className="w-full resize-none min-h-[100px] overflow-hidden rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-emerald-500/30 dark:bg-[#020803] dark:text-white transition-[height] duration-150"
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
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
                🔒 Your contact info is kept strictly confidential.
              </span>
              <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                {submitting ? "Sending..." : "Send Inquiry"} <Send size={15} />
              </Button>
            </div>
          </form>

          {/* Contact Info Sidebar */}
          <aside className="rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-xl dark:border-emerald-500/30 dark:bg-[#030d07]/95 dark:shadow-[0_16px_50px_rgba(0,10,2,0.7)] flex flex-col justify-between">
            <div>
              <div className="mb-5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  // CONTACT HUB
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  All Contact Channels
                </h2>
                <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                  {SITE_PROFILE.availability}
                </p>
              </div>

              {/* Direct Channels */}
              <div className="space-y-2.5">
                <a
                  href={`mailto:${QUICK_CONTACT.email}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 transition-all duration-200 hover:border-emerald-500 dark:border-emerald-500/20 dark:bg-[#020803]/80 dark:hover:border-emerald-400"
                >
                  <span className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    <Mail size={16} className="text-emerald-600 dark:text-emerald-400" />
                    {QUICK_CONTACT.email}
                  </span>
                  <ExternalLink size={14} className="text-slate-400 dark:text-slate-500" />
                </a>

                <a
                  href={`tel:${QUICK_CONTACT.phone.replace(/\s+/g, "")}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 transition-all duration-200 hover:border-emerald-500 dark:border-emerald-500/20 dark:bg-[#020803]/80 dark:hover:border-emerald-400"
                >
                  <span className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    <PhoneCall size={16} className="text-emerald-600 dark:text-emerald-400" />
                    {QUICK_CONTACT.phone}
                  </span>
                  <ExternalLink size={14} className="text-slate-400 dark:text-slate-500" />
                </a>

                <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs sm:text-sm font-bold text-slate-800 dark:border-emerald-500/20 dark:bg-[#020803]/80 dark:text-slate-200">
                  <MapPin size={16} className="text-emerald-600 dark:text-emerald-400" />
                  {SITE_PROFILE.location}
                </div>
              </div>

              {/* Social & Coding Profiles */}
              <div className="mt-6">
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2.5">
                  Official Profiles &amp; Networks
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {allContactPlatforms.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 transition-all duration-200 hover:border-emerald-500 dark:border-emerald-500/20 dark:bg-[#020803]/80 dark:text-slate-200 dark:hover:border-emerald-400"
                    >
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white dark:border-emerald-500/20 dark:bg-slate-900">
                          {item.label === "LinkedIn" ? (
                            <svg
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="h-[14px] w-[14px]"
                            >
                              <path
                                fill="#0A66C2"
                                d="M20.447 20.452h-3.554v-5.569c0-1.328-.026-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                              />
                            </svg>
                          ) : (
                            <img
                              src={item.logo}
                              alt={`${item.label} logo`}
                              loading="lazy"
                              decoding="async"
                              className="h-[14px] w-[14px] object-contain"
                            />
                          )}
                        </span>
                        {item.label}
                      </span>
                      <ExternalLink
                        size={13}
                        className="text-slate-400 transition group-hover:text-emerald-500"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
              <Button
                href={QUICK_CONTACT.resume}
                target="_blank"
                rel="noreferrer"
                variant="ghost"
                className="w-full justify-center"
              >
                Download Resume
              </Button>
              <Button href={`mailto:${QUICK_CONTACT.email}`} className="w-full justify-center">
                Start Email <Send size={14} />
              </Button>
            </div>
          </aside>

        </div>
      </section>
    </>
  );
};

export default ContactPage;

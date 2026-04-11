import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ExternalLink, Mail, MapPin, PhoneCall } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { sendContactMessage } from "@/services/contact.service";
import { getErrorMessage } from "@/services/api";
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
      setFormSuccess("Message sent successfully. I will get back to you soon.");
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
      <Helmet>
        <title>Contact | Nikhil Portfolio</title>
        <meta
          name="description"
          content="Contact Nikhil Agrahari for projects, freelance collaboration, mentorship, and developer support through one unified contact hub."
        />
      </Helmet>

      <section className="section-wrap pt-12 sm:pt-20">
        <SectionTitle
          eyebrow="Contact Hub"
          title="One Route for Collaboration and Direct Contact"
          description="This page combines project inquiry and direct channels in one place. Share your brief or reach out instantly through your preferred platform."
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <form
            className="card-surface relative overflow-hidden rounded-3xl p-6 lg:col-span-2"
            onSubmit={handleSubmit}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

            <div className="mb-5 rounded-xl border border-cyan-300/25 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">
                Collaboration Brief
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Share your scope, timelines, and goal clearly. You will get a
                practical response with next steps and realistic delivery
                direction.
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-500">
                Typical response time: within 12-24 hours
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-slate-200">
                Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-cyan-300/25 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-300"
                />
              </label>

              <label className="text-sm text-slate-200">
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-cyan-300/25 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-300"
                />
              </label>

              <label className="text-sm text-slate-200">
                Phone
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-cyan-300/25 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-300"
                />
              </label>

              <label className="text-sm text-slate-200">
                Service
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-cyan-300/25 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-300"
                >
                  <option value="">Select a service (optional)</option>
                  {SERVICE_OFFERINGS.map((item) => (
                    <option key={item.slug} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {SERVICE_OFFERINGS.slice(0, 6).map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => selectService(item.name)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${
                    formData.service === item.name
                      ? "border-cyan-300 bg-cyan-300/15 text-cyan-100"
                      : "border-cyan-300/20 text-slate-300 hover:border-cyan-300/55 hover:text-cyan-100"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <label className="mt-4 block text-sm text-slate-200">
              Message
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="mt-1 w-full resize-none rounded-xl border border-cyan-300/25 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-300"
              />
            </label>

            {formError ? (
              <p className="mt-3 text-sm text-rose-300">{formError}</p>
            ) : null}
            {formSuccess ? (
              <p className="mt-3 text-sm text-emerald-300">{formSuccess}</p>
            ) : null}

            <div className="mt-5">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Sending..." : "Send Inquiry"}
              </Button>
            </div>
          </form>

          <aside className="card-surface relative overflow-hidden rounded-3xl p-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/65 to-transparent" />
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">
              Contact Hub
            </p>
            <h3 className="mt-2 text-lg font-semibold text-cyan-100">
              All Contact Channels in One Place
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              {SITE_PROFILE.availability}
            </p>

            <div className="mt-4 space-y-2 text-sm text-slate-200">
              <a
                href={`mailto:${QUICK_CONTACT.email}`}
                className="flex items-center justify-between rounded-xl border border-cyan-300/20 bg-slate-900/65 px-3 py-2.5 transition hover:border-cyan-300/55 hover:text-cyan-100"
              >
                <span className="inline-flex items-center gap-2">
                  <Mail size={16} className="text-cyan-200" />
                  {QUICK_CONTACT.email}
                </span>
                <ExternalLink size={14} className="text-slate-500" />
              </a>

              <a
                href={`tel:${QUICK_CONTACT.phone.replace(/\s+/g, "")}`}
                className="flex items-center justify-between rounded-xl border border-cyan-300/20 bg-slate-900/65 px-3 py-2.5 transition hover:border-cyan-300/55 hover:text-cyan-100"
              >
                <span className="inline-flex items-center gap-2">
                  <PhoneCall size={16} className="text-cyan-200" />
                  {QUICK_CONTACT.phone}
                </span>
                <ExternalLink size={14} className="text-slate-500" />
              </a>

              <div className="flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-slate-900/65 px-3 py-2.5 text-slate-300">
                <MapPin size={16} className="text-cyan-200" />
                {SITE_PROFILE.location}
              </div>
            </div>

            <h4 className="mt-5 text-xs uppercase tracking-[0.16em] text-slate-500">
              Official Social and Coding Profiles
            </h4>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {allContactPlatforms.map((item) => {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between rounded-xl border border-cyan-300/20 bg-slate-900/65 px-3 py-2.5 text-sm text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-300/60 hover:text-cyan-100"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-300/20 bg-slate-950/80">
                        {item.label === "LinkedIn" ? (
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="h-[15px] w-[15px]"
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
                            className="h-[15px] w-[15px] object-contain"
                          />
                        )}
                      </span>
                      {item.label}
                    </span>
                    <ExternalLink
                      size={14}
                      className="text-slate-500 transition group-hover:text-cyan-200"
                    />
                  </a>
                );
              })}
            </div>

            <div className="mt-5 rounded-xl border border-emerald-300/25 bg-emerald-300/10 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">
                Fastest Response Channels
              </p>
              <p className="mt-2 text-sm text-slate-200">
                For quickest replies, use Email, LinkedIn, or WhatsApp.
              </p>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <Button
                href={QUICK_CONTACT.resume}
                target="_blank"
                rel="noreferrer"
                variant="ghost"
                className="w-full"
              >
                Download Resume
              </Button>
              <Button href={`mailto:${QUICK_CONTACT.email}`} className="w-full">
                Start Email
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

export default ContactPage;

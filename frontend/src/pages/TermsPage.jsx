import SeoHead from "@/components/seo/SeoHead";
import SectionTitle from "@/components/ui/SectionTitle";
import { QUICK_CONTACT } from "@/constants/siteData";

const termsItems = [
  {
    title: "Service Scope",
    detail:
      "Work scope is confirmed in writing before execution. Additional requirements are treated as separate scope updates.",
  },
  {
    title: "Communication",
    detail:
      "Project communication and approvals are handled through agreed channels such as email, WhatsApp, or scheduled calls.",
  },
  {
    title: "Payment Terms",
    detail:
      "Payments are accepted through listed checkout methods. Confirmation is considered valid only after successful gateway verification.",
  },
  {
    title: "Intellectual Property",
    detail:
      "Client-provided assets remain client property. Delivered source files and assets are transferred as per agreed project scope.",
  },
  {
    title: "Limitation of Liability",
    detail:
      "Services are delivered on a best-effort professional basis. Liability is limited to the amount paid for the specific service.",
  },
];

const TermsPage = () => {
  return (
    <>
      <SeoHead
        title="Terms and Conditions"
        description="Terms and conditions for service scope, communication workflow, payment terms, and delivery references."
        pathname="/terms-and-conditions"
      />

      <section className="section-wrap pt-6 sm:pt-8 pb-20">
        <SectionTitle
          eyebrow="Terms and Conditions"
          title="Website and Service Terms"
          description="These terms govern website use, project engagement, billing, and delivery obligations."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {termsItems.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c]"
            >
              <h2 className="text-lg font-semibold text-ink-950 dark:text-ink-50">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-7 text-ink-600 dark:text-ink-300">
                {item.detail}
              </p>
            </article>
          ))}
        </div>

        <article className="mt-6 rounded-2xl border border-black/[0.08] bg-white p-6 text-sm text-ink-600 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-ink-300">
          <p>
            Questions about these terms:{" "}
            <a
              href={`mailto:${QUICK_CONTACT.supportEmail}`}
              className="font-medium text-emerald-700 underline underline-offset-2 dark:text-emerald-400"
            >
              {QUICK_CONTACT.supportEmail}
            </a>
          </p>
          <p className="mt-2 text-ink-500 dark:text-ink-400">Last updated: April 2026</p>
        </article>
      </section>
    </>
  );
};

export default TermsPage;

import SectionTitle from "@/components/ui/SectionTitle";
import SeoHead from "@/components/seo/SeoHead";
import { createBreadcrumbSchema } from "@/utils/seo";
import { QUICK_CONTACT } from "@/constants/siteData";

const policyItems = [
  {
    title: "Refund Request Window",
    detail: "Refund requests are accepted within 7 days of the payment date.",
  },
  {
    title: "Eligible Cases",
    detail:
      "Duplicate charge, accidental payment, or non-delivery within the agreed written scope may qualify for review.",
  },
  {
    title: "Not Eligible Cases",
    detail:
      "Completed consulting sessions, delivered digital guidance, and approved project milestones are not refundable.",
  },
  {
    title: "Review Timeline",
    detail:
      "Requests are reviewed within 2 to 5 business days with confirmation updates shared by email.",
  },
];

const RefundPolicyPage = () => {
  return (
    <>
      <SeoHead
        title="Refund Policy"
        description="Refund policy for paid services by Nikhil Agrahari, including eligibility, review timeline, and billing support channels."
        pathname="/refund-policy"
        robots="index, follow"
        keywords={[
          "Nikhil refund policy",
          "service refund terms",
          "Nikhil portfolio payments",
        ]}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Refund Policy", path: "/refund-policy" },
        ])}
      />

      <section className="section-wrap pt-6 sm:pt-8 pb-20">
        <SectionTitle
          eyebrow="Refund Policy"
          title="Refund Terms"
          description="Refund eligibility, review timelines, and billing support details for paid services."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {policyItems.map((item) => (
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
            For refund requests, share your receipt number, payment ID, and issue summary via official billing email.
          </p>
          <p className="mt-3 text-ink-900 dark:text-ink-100">
            Billing Support:{" "}
            <a
              href={`mailto:${QUICK_CONTACT.billingEmail}`}
              className="font-medium text-emerald-700 underline underline-offset-2 dark:text-emerald-400"
            >
              {QUICK_CONTACT.billingEmail}
            </a>
          </p>
          <p className="mt-1 tabular-nums text-ink-900 dark:text-ink-100">
            Primary Contact: <span className="font-medium">{QUICK_CONTACT.phone}</span>
          </p>
        </article>
      </section>
    </>
  );
};

export default RefundPolicyPage;

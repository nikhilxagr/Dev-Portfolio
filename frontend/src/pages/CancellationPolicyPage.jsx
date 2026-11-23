import SeoHead from "@/components/seo/SeoHead";
import SectionTitle from "@/components/ui/SectionTitle";
import { QUICK_CONTACT } from "@/constants/siteData";

const cancellationItems = [
  {
    title: "Before Work Starts",
    detail:
      "If cancellation is requested before work begins, a full cancellation review is processed and eligible refund is handled as per refund policy.",
  },
  {
    title: "After Work Starts",
    detail:
      "If work has started, cancellation is reviewed based on effort completed, delivered milestones, and confirmed scope records.",
  },
  {
    title: "How to Request",
    detail:
      "Send cancellation request from the payment email with receipt number, service name, and reason for cancellation.",
  },
  {
    title: "Review Timeline",
    detail:
      "Cancellation requests are reviewed within 2 to 5 business days. Outcome updates are shared over email.",
  },
];

const CancellationPolicyPage = () => {
  return (
    <>
      <SeoHead
        title="Cancellation Policy"
        description="Cancellation policy for booked services, review workflow, and communication timeline."
        pathname="/cancellation-policy"
      />

      <section className="section-wrap pt-6 sm:pt-8 pb-20">
        <SectionTitle
          eyebrow="Cancellation Policy"
          title="Cancellation Terms"
          description="Cancellation requests are reviewed based on project stage, delivered work, and communication status."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {cancellationItems.map((item) => (
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
            Submit requests at{" "}
            <a
              href={`mailto:${QUICK_CONTACT.billingEmail}`}
              className="font-medium text-emerald-700 underline underline-offset-2 dark:text-emerald-400"
            >
              {QUICK_CONTACT.billingEmail}
            </a>{" "}
            from your payment email.
          </p>
        </article>
      </section>
    </>
  );
};

export default CancellationPolicyPage;

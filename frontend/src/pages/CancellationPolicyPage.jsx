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

      <section className="section-wrap pt-12 sm:pt-20">
        <SectionTitle
          eyebrow="Cancellation Policy"
          title="Cancellation Terms"
          description="Cancellation requests are reviewed based on project stage, delivered work, and communication status."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {cancellationItems.map((item) => (
            <article key={item.title} className="card-surface rounded-2xl p-5">
              <h2 className="text-lg font-semibold text-cyan-100">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                {item.detail}
              </p>
            </article>
          ))}
        </div>

        <article className="card-surface mt-6 rounded-2xl p-5 text-sm text-slate-300">
          <p>
            Submit requests at {QUICK_CONTACT.billingEmail} from your payment
            email.
          </p>
        </article>
      </section>
    </>
  );
};

export default CancellationPolicyPage;

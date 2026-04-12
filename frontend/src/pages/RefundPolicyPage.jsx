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

      <section className="section-wrap pt-12 sm:pt-20">
        <SectionTitle
          eyebrow="Refund Policy"
          title="Professional and Transparent Payment Policy"
          description="This policy keeps payments clear, verifiable, and fair for both service buyer and service provider."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {policyItems.map((item) => (
            <article key={item.title} className="card-surface rounded-2xl p-5">
              <h2 className="text-lg font-semibold text-cyan-100">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>

        <article className="card-surface mt-6 rounded-2xl p-5 text-sm text-slate-300">
          <p>
            For refund requests, share your receipt number, payment ID, and
            issue summary using official billing email.
          </p>
          <p className="mt-3 text-cyan-100">
            Billing Support: {QUICK_CONTACT.billingEmail}
          </p>
          <p className="mt-1 text-cyan-100">
            Primary Contact: {QUICK_CONTACT.phone}
          </p>
        </article>
      </section>
    </>
  );
};

export default RefundPolicyPage;

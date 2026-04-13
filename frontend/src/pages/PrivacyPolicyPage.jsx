import SeoHead from "@/components/seo/SeoHead";
import SectionTitle from "@/components/ui/SectionTitle";
import { QUICK_CONTACT } from "@/constants/siteData";

const privacyItems = [
  {
    title: "Information Collected",
    detail:
      "Name, email, phone, and project notes submitted through contact or checkout forms are collected only for service communication and delivery.",
  },
  {
    title: "Payment Data",
    detail:
      "Payments are processed by Cashfree. Card, UPI, and banking credentials are handled on Cashfree pages and are not stored on this website.",
  },
  {
    title: "How Data Is Used",
    detail:
      "Data is used for project communication, invoicing, receipt generation, support requests, and service updates.",
  },
  {
    title: "Data Protection",
    detail:
      "Reasonable technical and process controls are used to protect submitted data. Access is restricted to required business operations.",
  },
  {
    title: "Data Sharing",
    detail:
      "Data is not sold. It may be shared only with payment or infrastructure providers required to fulfill services.",
  },
];

const PrivacyPolicyPage = () => {
  return (
    <>
      <SeoHead
        title="Privacy Policy"
        description="Privacy policy for service inquiries, checkout data handling, and payment processing references."
        pathname="/privacy-policy"
      />

      <section className="section-wrap pt-12 sm:pt-20">
        <SectionTitle
          eyebrow="Privacy Policy"
          title="How Information Is Collected and Used"
          description="This page explains what data is collected, why it is collected, and how it is protected."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {privacyItems.map((item) => (
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
            For privacy-related requests, contact: {QUICK_CONTACT.supportEmail}
          </p>
          <p className="mt-2">
            This policy may be updated to reflect service or compliance changes.
          </p>
        </article>
      </section>
    </>
  );
};

export default PrivacyPolicyPage;

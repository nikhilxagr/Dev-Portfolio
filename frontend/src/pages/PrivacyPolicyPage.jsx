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

      <section className="section-wrap pt-6 sm:pt-8 pb-20">
        <SectionTitle
          eyebrow="Privacy Policy"
          title="Data Collection and Use"
          description="This policy outlines what information is collected, why it is processed, and how it is protected."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {privacyItems.map((item) => (
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
            For privacy-related requests, contact:{" "}
            <a
              href={`mailto:${QUICK_CONTACT.supportEmail}`}
              className="font-medium text-emerald-700 underline underline-offset-2 dark:text-emerald-400"
            >
              {QUICK_CONTACT.supportEmail}
            </a>
          </p>
          <p className="mt-2 text-ink-500 dark:text-ink-400">
            This policy may be updated to reflect service or compliance changes.
          </p>
        </article>
      </section>
    </>
  );
};

export default PrivacyPolicyPage;

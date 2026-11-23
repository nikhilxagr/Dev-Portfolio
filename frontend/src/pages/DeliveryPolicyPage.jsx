import SeoHead from "@/components/seo/SeoHead";
import SectionTitle from "@/components/ui/SectionTitle";
import { QUICK_CONTACT } from "@/constants/siteData";

const deliveryItems = [
  {
    title: "Service Nature",
    detail:
      "This website provides digital services such as mentorship, guidance, and software development deliverables.",
  },
  {
    title: "Delivery Method",
    detail:
      "Delivery is completed through email, repository handover, file sharing links, or live review calls depending on scope.",
  },
  {
    title: "Delivery Timeline",
    detail:
      "Estimated timelines are shown on service cards. Final delivery windows are confirmed during project discussion.",
  },
  {
    title: "Proof of Delivery",
    detail:
      "Delivery proof may include milestone updates, repository commits, document handover, or signed completion confirmation.",
  },
  {
    title: "Delays and Dependencies",
    detail:
      "Delays caused by missing inputs, pending approvals, or scope changes are communicated with revised timeline estimates.",
  },
];

const DeliveryPolicyPage = () => {
  return (
    <>
      <SeoHead
        title="Delivery and Fulfillment"
        description="Delivery and fulfillment policy for digital services and timeline communication."
        pathname="/delivery-policy"
      />

      <section className="section-wrap pt-6 sm:pt-8 pb-20">
        <SectionTitle
          eyebrow="Delivery and Fulfillment"
          title="Delivery Process"
          description="Delivery channels, timelines, and fulfillment confirmation for digital services."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {deliveryItems.map((item) => (
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
            Delivery support contact:{" "}
            <a
              href={`mailto:${QUICK_CONTACT.supportEmail}`}
              className="font-medium text-emerald-700 underline underline-offset-2 dark:text-emerald-400"
            >
              {QUICK_CONTACT.supportEmail}
            </a>
          </p>
        </article>
      </section>
    </>
  );
};

export default DeliveryPolicyPage;

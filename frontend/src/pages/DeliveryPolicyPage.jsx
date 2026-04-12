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

      <section className="section-wrap pt-12 sm:pt-20">
        <SectionTitle
          eyebrow="Delivery and Fulfillment"
          title="How Services Are Delivered"
          description="This page explains delivery channels, timelines, and fulfillment confirmations for digital services."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {deliveryItems.map((item) => (
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
          <p>Delivery support contact: {QUICK_CONTACT.supportEmail}</p>
        </article>
      </section>
    </>
  );
};

export default DeliveryPolicyPage;

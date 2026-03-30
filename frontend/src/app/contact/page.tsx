import type { Metadata } from "next";

import { SimplePage } from "@/components/shared/simple-page";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <SimplePage
      eyebrow="Contact"
      title="Easy ways to reach out."
      description="This page will become your main inquiry space with contact links, service interest form, and the first version of your client communication flow."
    />
  );
}

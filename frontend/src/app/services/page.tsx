import type { Metadata } from "next";

import { SimplePage } from "@/components/shared/simple-page";

export const metadata: Metadata = {
  title: "Services",
};

export default function ServicesPage() {
  return (
    <SimplePage
      eyebrow="Services"
      title="Student-friendly help with clear scope."
      description="This page will turn into your paid services area with pricing cards, process steps, Razorpay integration, and legal notes for security review work."
    />
  );
}

import type { Metadata } from "next";

import { SimplePage } from "@/components/shared/simple-page";

export const metadata: Metadata = {
  title: "Practicals",
};

export default function PracticalsPage() {
  return (
    <SimplePage
      eyebrow="Practicals"
      title="Lab work and cyber security practice."
      description="This page will present your Kali Linux setup, Nmap labs, TryHackMe learning, and Burp Suite practice in a professional and ethical way."
    />
  );
}

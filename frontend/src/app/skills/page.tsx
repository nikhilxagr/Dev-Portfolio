import type { Metadata } from "next";

import { SimplePage } from "@/components/shared/simple-page";

export const metadata: Metadata = {
  title: "Skills",
};

export default function SkillsPage() {
  return (
    <SimplePage
      eyebrow="Skills"
      title="Technical skills with room to grow."
      description="This page will organize your frontend, backend, language, deployment, and security tool stack into a clean visual system instead of a plain bullet list."
    />
  );
}

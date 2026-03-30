import type { Metadata } from "next";

import { SimplePage } from "@/components/shared/simple-page";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <SimplePage
      eyebrow="Projects"
      title="Work that shows how you build."
      description="This page will grow into your main proof section with project cards, stack tags, case-study style summaries, and live or GitHub links."
    />
  );
}

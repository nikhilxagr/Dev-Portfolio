import type { Metadata } from "next";

import { SimplePage } from "@/components/shared/simple-page";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <SimplePage
      eyebrow="About"
      title="The person behind the portfolio."
      description="This page will expand into your story, learning journey, education, growth mindset, and the path that connects full stack development with cyber security."
    />
  );
}

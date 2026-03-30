import type { Metadata } from "next";

import { SimplePage } from "@/components/shared/simple-page";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogPage() {
  return (
    <SimplePage
      eyebrow="Blog"
      title="Public writing and learning notes."
      description="This page will bring together your Medium and LinkedIn writing into one organized reading section with featured articles, tags, and source links."
    />
  );
}

import type { Metadata } from "next";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import { buildPublicMetadata, noIndexRobots } from "@/lib/seo/site";

export const metadata: Metadata = {
  ...buildPublicMetadata({
    title: "GCSE Russian Resources",
    description:
      "Future GCSE Russian revision guidance, exam advice, course updates, and resource articles.",
    path: "/blog",
  }),
  robots: noIndexRobots,
};

export default function MarketingBlogPage() {
  return (
    <div className="space-y-8 py-8 md:py-12">
      <PageIntroPanel
        tone="neutral"
        eyebrow="Blog"
        title="GCSE Russian articles are coming soon"
        description="This page is scaffolded for future SEO content, revision guidance, exam advice, and course updates."
        badges={
          <Badge tone="muted" icon="info">
            Placeholder
          </Badge>
        }
        actions={
          <Button href="/signup" variant="primary" icon="create">
            Start trial
          </Button>
        }
      />

      <SectionCard
        title="Future content areas"
        description="The blog can grow into exam explainers, revision plans, vocabulary guides, and parent-facing course updates without touching platform routes."
        tone="muted"
      />
    </div>
  );
}

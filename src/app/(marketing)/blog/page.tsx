import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";

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

import type { Metadata } from "next";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import MarketingBreadcrumbs from "@/components/marketing/marketing-breadcrumbs";
import { MarketingRelatedLinks } from "@/components/marketing/marketing-page-sections";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "About GCSE Russian",
  description:
    "Learn about the GCSE Russian Course Platform, a focused online learning product for Pearson Edexcel GCSE Russian students and Volna learners.",
  path: "/about",
});

const principles = [
  {
    title: "Specific to GCSE Russian",
    description:
      "The platform is shaped around the needs of GCSE Russian learners rather than generic language-learning content.",
  },
  {
    title: "Built around structured progress",
    description:
      "Lessons, practice, vocabulary, grammar, and exam preparation are organised so students know what to do next.",
  },
  {
    title: "Connected to teaching workflows",
    description:
      "The same product can support independent learners and Volna students without splitting the codebase.",
  },
];

const relatedLinks = [
  {
    title: "Online GCSE Russian course",
    description: "See how the platform is structured for Pearson Edexcel preparation.",
    href: "/gcse-russian-course",
    icon: "courses" as const,
  },
  {
    title: "GCSE Russian guide for parents",
    description: "Understand how families can support course and exam preparation.",
    href: "/gcse-russian-for-parents",
    icon: "users" as const,
  },
  {
    title: "Course pricing",
    description: "Compare Foundation and Higher access after trial-first signup.",
    href: "/pricing",
    icon: "pricing" as const,
  },
];

export default function MarketingAboutPage() {
  return (
    <>
      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "About", href: "/about" },
        ]}
      />
      <div className="space-y-8 py-8 md:py-12">
        <PageIntroPanel
          tone="brand"
          eyebrow="About"
          title="A focused course platform for GCSE Russian"
          description="GCSE Russian Course Platform supports students preparing for Pearson Edexcel GCSE Russian and sits alongside the teaching work of Volna Online Russian School."
          badges={
            <>
              <Badge tone="info" icon="school">
                Volna ecosystem
              </Badge>
              <Badge tone="muted" icon="layers">
                Single codebase
              </Badge>
            </>
          }
          actions={
            <Button href="/signup" variant="primary" icon="create">
              Start trial
            </Button>
          }
        />

        <section className="grid gap-4 md:grid-cols-3">
          {principles.map((principle) => (
            <SectionCard
              key={principle.title}
              title={principle.title}
              description={principle.description}
              tone="student"
              density="compact"
            />
          ))}
        </section>

        <SectionCard
          title="Why this exists"
          description="GCSE Russian is a small subject with specific exam needs. The platform gives students and families a more direct route than generic language apps or scattered revision notes."
          tone="brand"
        />

        <MarketingRelatedLinks
          title="Continue from here"
          description="Move from background context into the course, parent guide, or pricing details."
          links={relatedLinks}
        />
      </div>
    </>
  );
}

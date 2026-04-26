import type { Metadata } from "next";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
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

export default function MarketingAboutPage() {
  return (
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
    </div>
  );
}

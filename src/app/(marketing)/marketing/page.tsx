import type { Metadata } from "next";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import Surface from "@/components/ui/surface";
import { MarketingRelatedLinks } from "@/components/marketing/marketing-page-sections";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Online Course",
  description:
    "A structured online GCSE Russian course for Pearson Edexcel 1RU0 students, with guided lessons, vocabulary, grammar, exam practice, and progress tracking.",
  path: "/marketing",
});

const highlights = [
  {
    title: "Trial-first learning",
    description:
      "Students can try the platform, explore trial lessons, and understand the course before choosing paid access.",
  },
  {
    title: "Built for GCSE Russian",
    description:
      "The course is focused on Pearson Edexcel GCSE Russian, with Foundation and Higher pathways.",
  },
  {
    title: "Clear app handoff",
    description:
      "Marketing pages explain the offer, while the app handles lessons, progress, account details, and billing.",
  },
];

const pathways = [
  "Start with a trial account",
  "Try sample lessons and platform tools",
  "Upgrade inside the app when ready",
];

const guideLinks = [
  {
    title: "GCSE Russian resources",
    description:
      "Browse exam paper guides, grammar, vocabulary, and past-paper revision strategy.",
    href: "/resources",
    icon: "lessonContent" as const,
  },
  {
    title: "Online GCSE Russian course",
    description:
      "See how the structured course supports Edexcel GCSE Russian preparation.",
    href: "/gcse-russian-course",
    icon: "courses" as const,
  },
  {
    title: "Pearson Edexcel GCSE Russian",
    description:
      "Understand qualification code 1RU0, papers, tiers, and platform support.",
    href: "/edexcel-gcse-russian",
    icon: "school" as const,
  },
  {
    title: "GCSE Russian exam guide",
    description:
      "Start with a clear overview of listening, speaking, reading, and writing.",
    href: "/gcse-russian-exam-guide",
    icon: "exam" as const,
  },
  {
    title: "GCSE Russian revision guide",
    description:
      "Build a practical revision plan across vocabulary, grammar, and exam papers.",
    href: "/gcse-russian-revision",
    icon: "calendar" as const,
  },
  {
    title: "Russian GCSE private candidates",
    description: "Plan preparation for students arranging their own exam entry.",
    href: "/russian-gcse-private-candidate",
    icon: "userCheck" as const,
  },
  {
    title: "Online GCSE Russian lessons",
    description: "Explore teacher-supported learning alongside the course platform.",
    href: "/online-gcse-russian-lessons",
    icon: "school" as const,
  },
  {
    title: "GCSE Russian guide for parents",
    description: "Understand course support, private entry, revision, and trial access.",
    href: "/gcse-russian-for-parents",
    icon: "users" as const,
  },
];

export default function MarketingHomePage() {
  return (
    <div className="space-y-8 py-8 md:py-12">
      <PageIntroPanel
        tone="brand"
        eyebrow="GCSE Russian Course Platform"
        title="Structured Russian learning for GCSE students"
        description="A focused online course platform for students preparing for Pearson Edexcel GCSE Russian, combining guided lessons, exam practice, vocabulary, grammar, and progress tracking."
        badges={
          <>
            <Badge tone="info" icon="school">
              Edexcel GCSE 1RU0
            </Badge>
            <Badge tone="muted" icon="layers">
              Foundation and Higher
            </Badge>
            <Badge tone="success" icon="unlocked">
              Trial-first access
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/signup" variant="primary" icon="create">
              Start trial
            </Button>
            <Button href="/pricing" variant="secondary" icon="pricing">
              View pricing
            </Button>
          </>
        }
      >
        <div className="grid gap-3 md:grid-cols-3">
          {pathways.map((item, index) => (
            <Card key={item}>
              <CardBody className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full [background:var(--accent-gradient-selected)] text-sm font-semibold text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-selected-border)]">
                  {index + 1}
                </span>
                <p className="text-sm font-medium text-[var(--text-primary)]">{item}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </PageIntroPanel>

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <SectionCard
            key={item.title}
            title={item.title}
            description={item.description}
            tone="student"
            density="compact"
          />
        ))}
      </section>

      <MarketingRelatedLinks
        title="Explore GCSE Russian preparation"
        description="Start with the page that matches your question, then move into trial access when you are ready to practise."
        links={guideLinks}
      />

      <Surface variant="muted" padding="lg">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-center">
          <div className="space-y-2">
            <h2 className="app-section-title text-xl">Ready for the app?</h2>
            <p className="max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              The learning platform lives separately from the marketing site. Students can
              create a trial account first, then upgrade from inside their account when
              they are ready.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Button href="/signup" variant="primary" icon="create">
              Create trial account
            </Button>
            <Button href="/login" variant="secondary" icon="user">
              Log in
            </Button>
          </div>
        </div>
      </Surface>
    </div>
  );
}

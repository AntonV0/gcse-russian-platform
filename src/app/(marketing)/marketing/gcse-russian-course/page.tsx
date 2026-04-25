import type { Metadata } from "next";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import {
  MarketingCtaBand,
  MarketingFeatureGrid,
  MarketingRelatedLinks,
  MarketingStepList,
} from "@/components/marketing/marketing-page-sections";
import MarketingBreadcrumbs from "@/components/marketing/marketing-breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { buildPublicMetadata } from "@/lib/seo/site";
import { buildCourseJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = buildPublicMetadata({
  title: "Online GCSE Russian Course",
  description:
    "Explore a structured online GCSE Russian course for Pearson Edexcel 1RU0, with Foundation and Higher pathways, guided lessons, grammar, vocabulary, and exam practice.",
  path: "/marketing/gcse-russian-course",
});

const courseFit = [
  {
    title: "Students preparing for GCSE Russian",
    description:
      "The course is built around the needs of GCSE Russian learners rather than generic language learning.",
  },
  {
    title: "Parents who want structure",
    description:
      "Clear pathways, lesson order, and progress tracking help families understand what the student should do next.",
  },
  {
    title: "Independent and taught learners",
    description:
      "The same platform can support self-study students and learners connected to Volna teaching workflows.",
  },
];

const courseSteps = [
  {
    title: "Choose the right pathway",
    description:
      "Start with Foundation or Higher content according to the student's level and exam target.",
  },
  {
    title: "Work through lessons in order",
    description:
      "Modules and lessons create a guided route through topics, grammar, vocabulary, and exam skills.",
  },
  {
    title: "Practise and track progress",
    description:
      "The app keeps learning active with question practice, revision resources, and account-based progress.",
  },
];

const courseCoverage = [
  {
    title: "Pearson Edexcel 1RU0 focus",
    description:
      "Public pages explain the specification, while the app delivers the structured learning experience.",
  },
  {
    title: "Foundation and Higher",
    description:
      "The platform supports tier-aware content so students can study at the right level.",
  },
  {
    title: "Grammar and vocabulary",
    description:
      "Students can revise language knowledge alongside exam-style listening, reading, speaking, and writing preparation.",
  },
];

const relatedLinks = [
  {
    title: "Pearson Edexcel GCSE Russian",
    description: "Understand the exam board, qualification code, papers, and tier model.",
    href: "/marketing/edexcel-gcse-russian",
    icon: "school" as const,
  },
  {
    title: "GCSE Russian exam guide",
    description: "See how listening, speaking, reading, and writing fit together.",
    href: "/marketing/gcse-russian-exam-guide",
    icon: "exam" as const,
  },
  {
    title: "Russian GCSE private candidate guide",
    description: "Learn how the course can support students arranging their own exam entry.",
    href: "/marketing/russian-gcse-private-candidate",
    icon: "userCheck" as const,
  },
];

export default function GcseRussianCoursePage() {
  return (
    <>
      <JsonLd
        data={buildCourseJsonLd({
          name: "Online GCSE Russian Course",
          description:
            "A structured online GCSE Russian course for Pearson Edexcel 1RU0 students, with Foundation and Higher pathways, guided lessons, grammar, vocabulary, and exam practice.",
          path: "/marketing/gcse-russian-course",
        })}
      />
      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "Course", href: "/marketing/gcse-russian-course" },
        ]}
      />
      <div className="space-y-8 py-8 md:py-12">
        <PageIntroPanel
        tone="brand"
        eyebrow="Online GCSE Russian course"
        title="A structured online GCSE Russian course"
        description="Prepare for Pearson Edexcel GCSE Russian with a guided platform that combines course lessons, vocabulary, grammar, exam-style practice, and progress tracking."
        badges={
          <>
            <Badge tone="info" icon="school">
              Pearson Edexcel 1RU0
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
            <Button href="/marketing/pricing" variant="secondary" icon="pricing">
              View pricing
            </Button>
          </>
        }
      />

      <MarketingFeatureGrid items={courseFit} />

      <MarketingStepList
        title="How the course works"
        description="The public site explains the offer. The app handles learning, practice, progress, and billing."
        steps={courseSteps}
      />

      <SectionCard
        title="What the course is designed to cover"
        description="The platform is being built around the real GCSE Russian journey: language knowledge, exam skills, and tier-aware progression."
        tone="brand"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {courseCoverage.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4"
            >
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <MarketingRelatedLinks links={relatedLinks} />

      <MarketingCtaBand
        title="Ready to try the GCSE Russian course?"
        description="Create a trial account first, explore the app, and upgrade inside the platform when the course is the right fit."
      />
      </div>
    </>
  );
}

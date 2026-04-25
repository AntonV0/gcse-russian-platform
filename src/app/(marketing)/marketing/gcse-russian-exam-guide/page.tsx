import type { Metadata } from "next";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import {
  MarketingCtaBand,
  MarketingRelatedLinks,
  MarketingStepList,
} from "@/components/marketing/marketing-page-sections";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Exam Guide",
  description:
    "A practical GCSE Russian exam guide covering listening, speaking, reading, writing, Foundation and Higher tiers, and how to prepare with a structured course.",
  path: "/marketing/gcse-russian-exam-guide",
});

const examSkills = [
  {
    title: "Listening",
    description:
      "Build the habit of listening for gist, detail, opinions, and familiar vocabulary in spoken Russian.",
  },
  {
    title: "Speaking",
    description:
      "Prepare answers, practise pronunciation, and build confidence for role play, picture tasks, and conversation.",
  },
  {
    title: "Reading",
    description:
      "Work on comprehension, inference, translation into English, and recognising language across themes.",
  },
  {
    title: "Writing",
    description:
      "Practise accurate Russian sentences, useful opinions, justifications, translation into Russian, and longer answers.",
  },
];

const revisionSteps = [
  {
    title: "Know the paper structure",
    description:
      "Start by understanding what each paper tests so revision time is not wasted on the wrong tasks.",
  },
  {
    title: "Build language foundations",
    description:
      "Vocabulary and grammar need regular practice because they support every paper, not just writing.",
  },
  {
    title: "Practise exam-style tasks",
    description:
      "Use structured practice and mock tasks to turn knowledge into exam performance.",
  },
];

const relatedLinks = [
  {
    title: "GCSE Russian listening exam guide",
    description: "Prepare for Paper 1 with audio strategy and vocabulary recognition.",
    href: "/marketing/gcse-russian-listening-exam",
    icon: "listening" as const,
  },
  {
    title: "GCSE Russian speaking exam guide",
    description: "Plan role play, picture-based task, and conversation practice.",
    href: "/marketing/gcse-russian-speaking-exam",
    icon: "speaking" as const,
  },
  {
    title: "GCSE Russian writing exam guide",
    description: "Build translation, accuracy, and extended-answer habits.",
    href: "/marketing/gcse-russian-writing-exam",
    icon: "write" as const,
  },
];

export default function GcseRussianExamGuidePage() {
  return (
    <div className="space-y-8 py-8 md:py-12">
      <PageIntroPanel
        tone="brand"
        eyebrow="GCSE Russian exam guide"
        title="How the GCSE Russian exam works"
        description="GCSE Russian preparation needs all four skills: listening, speaking, reading, and writing. This page gives students and parents a clear starting point before they move into structured practice."
        badges={
          <>
            <Badge tone="info" icon="exam">
              Listening, speaking, reading, writing
            </Badge>
            <Badge tone="muted" icon="layers">
              Foundation and Higher
            </Badge>
            <Badge tone="muted" icon="school">
              Edexcel 1RU0
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/signup" variant="primary" icon="create">
              Start trial
            </Button>
            <Button href="/marketing/gcse-russian-course" variant="secondary" icon="courses">
              View course
            </Button>
          </>
        }
      />

      <SectionCard
        title="The four skills students need to prepare"
        description="A good revision plan should not treat GCSE Russian as only vocabulary memorisation. Each paper needs a different kind of practice."
        tone="student"
      >
        <div className="grid gap-3 md:grid-cols-2">
          {examSkills.map((skill) => (
            <div
              key={skill.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4"
            >
              <h3 className="font-semibold text-[var(--text-primary)]">{skill.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                {skill.description}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <MarketingStepList
        title="A practical revision sequence"
        description="The platform is designed to move students from understanding the exam to practising in a structured way."
        steps={revisionSteps}
      />

      <SectionCard
        title="Where the app fits"
        description="Public guides can explain the exam, but practice, progress tracking, attempts, and lesson content belong inside the logged-in LMS."
        tone="brand"
        actions={
          <Badge tone="success" icon="locked">
            Practice lives in the app
          </Badge>
        }
      />

      <MarketingRelatedLinks links={relatedLinks} />

      <MarketingCtaBand
        title="Start preparing with structure"
        description="A trial account lets students explore the platform before choosing the full access route that matches their level."
        secondaryHref="/marketing/pricing"
        secondaryLabel="Compare access"
      />
    </div>
  );
}

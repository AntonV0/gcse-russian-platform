import type { Metadata } from "next";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import {
  MarketingCtaBand,
  MarketingFaqSection,
  MarketingFeatureGrid,
  MarketingRelatedLinks,
  type MarketingFaqItem,
} from "@/components/marketing/marketing-page-sections";
import MarketingBreadcrumbs from "@/components/marketing/marketing-breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";
import { buildFaqJsonLd, buildLearningResourceJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = buildPublicMetadata({
  title: "Pearson Edexcel GCSE Russian Guide",
  description:
    "A clear guide to Pearson Edexcel GCSE Russian 1RU0, including the four papers, Foundation and Higher tiers, and how the course platform supports preparation.",
  path: "/edexcel-gcse-russian",
  ogTitle: "Pearson Edexcel GCSE Russian 1RU0",
  ogDescription:
    "Understand the four papers, Foundation and Higher tiers, speaking window, and course preparation.",
  ogImagePath: getOgImagePath("edexcel"),
  ogImageAlt: "Pearson Edexcel GCSE Russian 1RU0 guide",
});

const paperOverview = [
  {
    title: "Paper 1: Listening",
    description:
      "Students need to understand spoken Russian, identify key details, and handle exam-style audio tasks.",
  },
  {
    title: "Paper 2: Speaking",
    description:
      "Speaking preparation should build confidence with role play, picture-based tasks, conversation, and spontaneous answers.",
  },
  {
    title: "Paper 3: Reading",
    description:
      "Reading work develops comprehension, inference, vocabulary recognition, and translation into English.",
  },
  {
    title: "Paper 4: Writing",
    description:
      "Writing preparation focuses on accurate Russian, useful structures, translation into Russian, and extended answers.",
  },
];

const tierNotes = [
  {
    title: "Foundation tier",
    description:
      "Best for students building core confidence with high-frequency vocabulary, essential grammar, and structured answers.",
  },
  {
    title: "Higher tier",
    description:
      "Best for stronger students who need more complex language, wider vocabulary, and more demanding exam preparation.",
  },
  {
    title: "Tier-aware learning",
    description:
      "The platform separates Foundation and Higher pathways while still allowing shared content where it makes sense.",
  },
];

const qualificationFacts = [
  {
    title: "Four equal skills",
    description:
      "Listening, speaking, reading, and writing are each assessed as a separate paper and each contributes 25% of the qualification.",
  },
  {
    title: "One tier across all papers",
    description:
      "Students are entered for either Foundation or Higher across the qualification, so tier choice should be planned before the exam series.",
  },
  {
    title: "No dictionaries",
    description:
      "Pearson's specification states that dictionaries are not permitted in the papers, including during speaking preparation time.",
  },
  {
    title: "Speaking happens earlier",
    description:
      "The speaking assessment is completed in the April/May window, with the other papers taken in the May/June exam series.",
  },
];

const paperDetails = [
  {
    title: "Paper 1: Listening",
    description:
      "Paper codes 1RU0/1F and 1RU0/1H. Foundation is 35 minutes including reading time; Higher is 45 minutes including reading time.",
  },
  {
    title: "Paper 2: Speaking",
    description:
      "Paper codes 1RU0/2F and 1RU0/2H. Students complete a role play, picture-based task, and conversation.",
  },
  {
    title: "Paper 3: Reading",
    description:
      "Paper codes 1RU0/3F and 1RU0/3H. Students answer comprehension questions and translate from Russian into English.",
  },
  {
    title: "Paper 4: Writing",
    description:
      "Paper codes 1RU0/4F and 1RU0/4H. Students produce written Russian and translate from English into Russian.",
  },
];

const edexcelFaqs: MarketingFaqItem[] = [
  {
    question: "What is the GCSE Russian qualification code?",
    answer:
      "Pearson Edexcel GCSE Russian uses qualification code 1RU0. Individual papers use 1RU0 with paper and tier suffixes such as 1RU0/1F or 1RU0/4H.",
  },
  {
    question: "Can students mix Foundation and Higher papers?",
    answer:
      "No. Pearson's GCSE Russian specification says students must be entered for a single tier across all papers.",
  },
  {
    question: "Are dictionaries allowed in GCSE Russian?",
    answer:
      "No. The Pearson specification states that dictionaries are not permitted, including during the preparation time for the speaking paper.",
  },
  {
    question: "Why does the speaking paper need early preparation?",
    answer:
      "Speaking is completed in the April/May assessment window, so students should not leave speaking practice until the final written-paper revision period.",
  },
];

const relatedLinks = [
  {
    title: "Online GCSE Russian course",
    description:
      "See how the course turns the specification into a practical study path.",
    href: "/gcse-russian-course",
    icon: "courses" as const,
  },
  {
    title: "GCSE Russian exam guide",
    description: "Understand how the four papers shape revision and practice.",
    href: "/gcse-russian-exam-guide",
    icon: "exam" as const,
  },
  {
    title: "GCSE Russian course pricing",
    description: "Start with trial access before choosing the right pathway.",
    href: "/pricing",
    icon: "pricing" as const,
  },
];

export default function EdexcelGcseRussianPage() {
  return (
    <>
      <JsonLd
        data={[
          buildLearningResourceJsonLd({
            name: "Pearson Edexcel GCSE Russian 1RU0 Guide",
            description:
              "A clear guide to Pearson Edexcel GCSE Russian 1RU0, including the four papers, Foundation and Higher tiers, and course preparation.",
            path: "/edexcel-gcse-russian",
            keywords: ["Pearson Edexcel GCSE Russian", "1RU0", "Edexcel Russian GCSE"],
            relatedLinks,
          }),
          buildFaqJsonLd(edexcelFaqs),
        ]}
      />
      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "Resources", href: "/resources" },
          { label: "Edexcel GCSE Russian", href: "/edexcel-gcse-russian" },
        ]}
      />
      <div className="space-y-8 py-8 md:py-12">
        <PageIntroPanel
          tone="brand"
          eyebrow="Pearson Edexcel GCSE Russian"
          title="Pearson Edexcel GCSE Russian 1RU0 guide"
          description="GCSE Russian preparation works best when students understand the papers, tiers, and skills they are preparing for. This guide explains the structure and how the platform supports it."
          badges={
            <>
              <Badge tone="info" icon="school">
                Qualification code 1RU0
              </Badge>
              <Badge tone="muted" icon="exam">
                Four papers
              </Badge>
              <Badge tone="muted" icon="layers">
                Foundation and Higher
              </Badge>
            </>
          }
          actions={
            <>
              <Button href="/gcse-russian-course" variant="primary" icon="courses">
                View course
              </Button>
              <Button href="/signup" variant="secondary" icon="create">
                Start trial
              </Button>
            </>
          }
        />

        <SectionCard
          title="The four GCSE Russian papers"
          description="Each major language skill needs deliberate preparation. The platform is designed around this full exam journey."
          tone="student"
        >
          <div className="grid gap-3 md:grid-cols-2">
            {paperOverview.map((paper) => (
              <div
                key={paper.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4"
              >
                <h3 className="font-semibold text-[var(--text-primary)]">
                  {paper.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {paper.description}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <MarketingFeatureGrid items={tierNotes} tone="muted" />

        <SectionCard
          title="Qualification details students should know"
          description="These details affect revision planning, tier choice, and when students need to be ready for speaking."
          tone="brand"
        >
          <div className="grid gap-3 md:grid-cols-2">
            {qualificationFacts.map((item) => (
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

        <SectionCard
          title="Paper codes and preparation focus"
          description="Use the codes to recognise official materials and the preparation focus to plan the student's weekly work."
          tone="muted"
          actions={
            <a
              href="https://qualifications.pearson.com/en/qualifications/edexcel-gcses/russian-2017.html"
              className="app-nav-link"
            >
              Pearson qualification page
            </a>
          }
        >
          <div className="grid gap-3 md:grid-cols-2">
            {paperDetails.map((item) => (
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

        <SectionCard
          title="How the platform supports Edexcel preparation"
          description="The public pages give context. The logged-in app provides the learning sequence, practice, progress tracking, and account-specific access."
          tone="brand"
          actions={
            <Badge tone="success" icon="unlocked">
              Public guide, locked practice
            </Badge>
          }
        />

        <MarketingRelatedLinks links={relatedLinks} />

        <MarketingFaqSection
          title="Edexcel GCSE Russian questions"
          description="The details that most often affect planning, tier choice, and revision timing."
          items={edexcelFaqs}
        />

        <MarketingCtaBand
          title="Turn the specification into a study plan"
          description="Start with a trial account, explore the course structure, and use the app to practise the skills that matter for GCSE Russian."
          secondaryHref="/gcse-russian-exam-guide"
          secondaryLabel="Read exam guide"
        />
      </div>
    </>
  );
}

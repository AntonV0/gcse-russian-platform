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
  MarketingStepList,
  type MarketingFaqItem,
} from "@/components/marketing/marketing-page-sections";
import MarketingBreadcrumbs from "@/components/marketing/marketing-breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { buildPublicMetadata } from "@/lib/seo/site";
import { buildFaqJsonLd, buildLearningResourceJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = buildPublicMetadata({
  title: "Russian GCSE Private Candidate Guide",
  description:
    "A practical guide for Russian GCSE private candidates and families looking for exam preparation, course structure, online lessons, and exam-centre planning.",
  path: "/russian-gcse-private-candidate",
});

const candidateQuestions = [
  {
    title: "Where will the student sit the exam?",
    description:
      "Private candidates usually need to arrange exam entry separately through a suitable centre.",
  },
  {
    title: "Which tier is right?",
    description:
      "Foundation and Higher choices affect the study route, practice difficulty, and exam expectations.",
  },
  {
    title: "How will speaking be prepared?",
    description:
      "Speaking needs regular practice, confidence, and feedback because it cannot be solved by worksheets alone.",
  },
];

const supportSteps = [
  {
    title: "Use public guides first",
    description:
      "Understand the Edexcel structure, papers, tiers, and preparation needs before committing to a plan.",
  },
  {
    title: "Start structured course preparation",
    description:
      "A course pathway helps the student cover vocabulary, grammar, and exam skills in a sensible order.",
  },
  {
    title: "Add live support if needed",
    description:
      "Some private candidates benefit from teacher guidance, especially for speaking, writing, and accountability.",
  },
];

const trustPoints = [
  {
    title: "Good fit for heritage speakers",
    description:
      "Heritage speakers may be confident orally but still need exam technique, writing accuracy, and formal preparation.",
  },
  {
    title: "Useful for non-native learners",
    description:
      "Non-native learners need steady vocabulary, grammar, and exam-skill development across all four papers.",
  },
  {
    title: "Clear separation of roles",
    description:
      "The platform supports preparation; exam entry and centre arrangements should be checked separately by the family.",
  },
];

const examCentreChecklist = [
  {
    title: "Confirm candidate acceptance",
    description:
      "Ask whether the centre accepts private candidates for Pearson Edexcel GCSE Russian and which entry option they can offer.",
  },
  {
    title: "Ask about speaking arrangements",
    description:
      "Speaking is often the hardest part to arrange privately, so families should ask early about teacher-examiner and recording arrangements.",
  },
  {
    title: "Check deadlines and fees",
    description:
      "Entry deadlines, late fees, access arrangements, and centre administration costs can vary, so these should be confirmed directly.",
  },
  {
    title: "Match tier to preparation",
    description:
      "Foundation or Higher should be chosen before the speaking assessment, then revision should stay aligned to that tier.",
  },
];

const privateCandidateFaqs: MarketingFaqItem[] = [
  {
    question: "Can this platform enter a student for GCSE Russian?",
    answer:
      "No. The platform supports preparation. Families still need to arrange exam entry and confirm all requirements directly with an exam centre.",
  },
  {
    question: "When should private candidates look for an exam centre?",
    answer:
      "As early as possible. Centre availability, fees, deadlines, and speaking arrangements can vary, and speaking is completed before the written papers.",
  },
  {
    question: "Is GCSE Russian suitable for heritage speakers?",
    answer:
      "Often, yes, but heritage speakers still need exam preparation: formal writing, translation accuracy, grammar control, and paper-specific technique.",
  },
  {
    question: "What support is most useful for private candidates?",
    answer:
      "A structured course helps with coverage and routine. Live support is especially useful when speaking confidence, writing feedback, or accountability is needed.",
  },
];

const relatedLinks = [
  {
    title: "Online GCSE Russian course",
    description: "See the structured course pathway for independent preparation.",
    href: "/gcse-russian-course",
    icon: "courses" as const,
  },
  {
    title: "Online GCSE Russian lessons",
    description: "Explore how live teacher guidance can support private candidates.",
    href: "/online-gcse-russian-lessons",
    icon: "speaking" as const,
  },
  {
    title: "GCSE Russian exam guide",
    description: "Understand what each paper tests before planning revision.",
    href: "/gcse-russian-exam-guide",
    icon: "exam" as const,
  },
];

export default function RussianGcsePrivateCandidatePage() {
  return (
    <>
      <JsonLd
        data={[
          buildLearningResourceJsonLd({
            name: "Russian GCSE Private Candidate Guide",
            description:
              "A practical guide for Russian GCSE private candidates and families planning exam preparation, course structure, online lessons, and exam-centre questions.",
            path: "/russian-gcse-private-candidate",
            keywords: [
              "Russian GCSE private candidate",
              "Russian GCSE exam centre",
              "GCSE Russian preparation",
            ],
            relatedLinks,
          }),
          buildFaqJsonLd(privateCandidateFaqs),
        ]}
      />
      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "Resources", href: "/resources" },
          {
            label: "Private candidates",
            href: "/russian-gcse-private-candidate",
          },
        ]}
      />
      <div className="space-y-8 py-8 md:py-12">
        <PageIntroPanel
          tone="brand"
          eyebrow="Private candidates"
          title="Russian GCSE private candidate preparation"
          description="Private candidates need more than resources: they need a clear preparation route, exam awareness, and a plan for speaking, writing, grammar, vocabulary, and exam-centre arrangements."
          badges={
            <>
              <Badge tone="info" icon="userCheck">
                Private candidate support
              </Badge>
              <Badge tone="muted" icon="school">
                GCSE Russian
              </Badge>
              <Badge tone="muted" icon="layers">
                Foundation and Higher
              </Badge>
            </>
          }
          actions={
            <>
              <Button href="/signup" variant="primary" icon="create">
                Start trial
              </Button>
              <Button
                href="/online-gcse-russian-lessons"
                variant="secondary"
                icon="school"
              >
                Online lessons
              </Button>
            </>
          }
        />

        <MarketingFeatureGrid items={candidateQuestions} />

        <MarketingStepList
          title="A sensible preparation path"
          description="Private-candidate preparation should connect exam logistics with a practical learning routine."
          steps={supportSteps}
        />

        <MarketingFeatureGrid items={trustPoints} tone="muted" />

        <SectionCard
          title="Exam centre checklist"
          description="The course can organise preparation, but the exam centre controls entry, fees, deadlines, and assessment arrangements."
          tone="student"
        >
          <div className="grid gap-3 md:grid-cols-2">
            {examCentreChecklist.map((item) => (
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
          title="Important note about exam entry"
          description="This platform can support GCSE Russian preparation, but families should confirm exam entry, deadlines, speaking arrangements, and centre availability directly with their chosen exam centre."
          tone="brand"
          actions={
            <Badge tone="warning" icon="info">
              Check centre arrangements
            </Badge>
          }
        />

        <MarketingRelatedLinks links={relatedLinks} />

        <MarketingFaqSection
          title="Private candidate questions"
          description="The practical questions families should settle before relying on a revision plan alone."
          items={privateCandidateFaqs}
        />

        <MarketingCtaBand
          title="Give private-candidate preparation a structure"
          description="Start with trial access, review the course flow, and decide whether self-study or live teacher support is the right next step."
          secondaryHref="/gcse-russian-course"
          secondaryLabel="View course"
        />
      </div>
    </>
  );
}

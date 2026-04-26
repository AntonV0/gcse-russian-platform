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
import { buildLearningResourceJsonLd } from "@/lib/seo/structured-data";

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
        data={buildLearningResourceJsonLd({
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
        })}
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

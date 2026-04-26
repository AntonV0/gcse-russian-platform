import type { Metadata } from "next";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import {
  MarketingCtaBand,
  MarketingRelatedLinks,
} from "@/components/marketing/marketing-page-sections";
import MarketingBreadcrumbs from "@/components/marketing/marketing-breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { buildPublicMetadata } from "@/lib/seo/site";
import { buildLearningResourceJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Resources",
  description:
    "Evergreen GCSE Russian resources for Pearson Edexcel 1RU0 students, including exam paper guides, grammar, vocabulary, past papers, and private-candidate preparation.",
  path: "/marketing/resources",
});

const resourceLinks = [
  {
    title: "GCSE Russian listening exam guide",
    description: "Prepare for Paper 1 with audio habits, question strategy, and revision planning.",
    href: "/marketing/gcse-russian-listening-exam",
    icon: "listening" as const,
  },
  {
    title: "GCSE Russian speaking exam guide",
    description: "Understand role play, picture-based tasks, conversation, and confidence building.",
    href: "/marketing/gcse-russian-speaking-exam",
    icon: "speaking" as const,
  },
  {
    title: "GCSE Russian reading exam guide",
    description: "Build comprehension, vocabulary recognition, inference, and translation skills.",
    href: "/marketing/gcse-russian-reading-exam",
    icon: "lessonContent" as const,
  },
  {
    title: "GCSE Russian writing exam guide",
    description: "Plan accurate written Russian, translation practice, opinions, and longer answers.",
    href: "/marketing/gcse-russian-writing-exam",
    icon: "write" as const,
  },
  {
    title: "GCSE Russian grammar guide",
    description: "See how grammar supports all four papers and how to revise it systematically.",
    href: "/marketing/gcse-russian-grammar",
    icon: "grammar" as const,
  },
  {
    title: "GCSE Russian vocabulary guide",
    description: "Organise vocabulary by theme, tier, and productive or receptive exam use.",
    href: "/marketing/gcse-russian-vocabulary",
    icon: "vocabulary" as const,
  },
  {
    title: "GCSE Russian past papers",
    description: "Use official Pearson resources as part of a wider revision and mock-exam plan.",
    href: "/marketing/gcse-russian-past-papers",
    icon: "pastPapers" as const,
  },
  {
    title: "GCSE Russian revision guide",
    description: "Build a weekly revision plan across vocabulary, grammar, papers, and feedback.",
    href: "/marketing/gcse-russian-revision",
    icon: "calendar" as const,
  },
  {
    title: "GCSE Russian Foundation tier",
    description: "Focus Foundation preparation on secure core language and familiar exam tasks.",
    href: "/marketing/gcse-russian-foundation-tier",
    icon: "layers" as const,
  },
  {
    title: "GCSE Russian Higher tier",
    description: "Prepare Higher tier students for range, accuracy, translation, and extended answers.",
    href: "/marketing/gcse-russian-higher-tier",
    icon: "layers" as const,
  },
  {
    title: "Russian GCSE private candidate guide",
    description: "Plan course preparation alongside exam-centre and speaking-arrangement questions.",
    href: "/marketing/russian-gcse-private-candidate",
    icon: "userCheck" as const,
  },
  {
    title: "GCSE Russian tutor or online course?",
    description: "Compare tutor support, online lessons, and structured course access.",
    href: "/marketing/gcse-russian-tutor",
    icon: "school" as const,
  },
  {
    title: "GCSE Russian guide for parents",
    description: "Help families understand the exam, course structure, private entry, and support options.",
    href: "/marketing/gcse-russian-for-parents",
    icon: "users" as const,
  },
];

export default function GcseRussianResourcesPage() {
  return (
    <>
      <JsonLd
        data={buildLearningResourceJsonLd({
          name: "GCSE Russian Resources",
          description:
            "Evergreen GCSE Russian resources for Pearson Edexcel 1RU0 students, including exam paper guides, grammar, vocabulary, past papers, and private-candidate preparation.",
          path: "/marketing/resources",
          keywords: ["GCSE Russian resources", "Edexcel Russian GCSE", "Russian GCSE revision"],
          relatedLinks: resourceLinks,
        })}
      />
      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "Resources", href: "/marketing/resources" },
        ]}
      />
      <div className="space-y-8 py-8 md:py-12">
        <PageIntroPanel
          tone="brand"
          eyebrow="GCSE Russian resources"
          title="Evergreen GCSE Russian guides"
          description="Use these public guides to understand the exam, plan revision, and decide when to move into structured practice inside the course platform."
          badges={
            <>
              <Badge tone="info" icon="school">
                Pearson Edexcel 1RU0
              </Badge>
              <Badge tone="muted" icon="exam">
                Paper guides
              </Badge>
              <Badge tone="muted" icon="vocabulary">
                Grammar and vocabulary
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

        <MarketingRelatedLinks
          title="Choose a guide"
          description="Each public page answers a specific search question, then links into trial access when the student is ready to practise."
          links={resourceLinks}
        />

        <MarketingCtaBand
          title="Use the guides, then practise in the app"
          description="The public site explains what to study. The app provides structured lessons, practice, progress tracking, and account-based course access."
          secondaryHref="/marketing/gcse-russian-exam-guide"
          secondaryLabel="Exam guide"
        />
      </div>
    </>
  );
}

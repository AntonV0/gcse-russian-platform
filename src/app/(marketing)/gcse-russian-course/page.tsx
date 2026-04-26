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
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildCourseJsonLd, buildFaqJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = buildPublicMetadata({
  title: "Online GCSE Russian Course",
  description:
    "Explore a structured online GCSE Russian course for Pearson Edexcel 1RU0, with Foundation and Higher pathways, guided lessons, grammar, vocabulary, and exam practice.",
  path: "/gcse-russian-course",
  ogTitle: "Online GCSE Russian Course",
  ogDescription:
    "A structured Pearson Edexcel 1RU0 course with lessons, grammar, vocabulary, and exam practice.",
  ogImagePath: getOgImagePath("course"),
  ogImageAlt: "Online GCSE Russian Course",
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

const courseIncludes = [
  {
    title: "Lesson pathways",
    description:
      "Students follow a course order instead of piecing together isolated worksheets, videos, and vocabulary lists.",
  },
  {
    title: "Theme-based vocabulary",
    description:
      "Vocabulary work connects to GCSE themes so words are practised in the contexts students meet in exam tasks.",
  },
  {
    title: "Grammar in exam use",
    description:
      "Grammar is treated as a tool for understanding questions, translating accurately, and producing stronger Russian.",
  },
  {
    title: "Paper-by-paper preparation",
    description:
      "Listening, speaking, reading, and writing are introduced as separate skills with their own practice routines.",
  },
  {
    title: "Private-candidate support",
    description:
      "Families arranging exam entry can use public guidance while the course gives the student a structured study route.",
  },
  {
    title: "Trial-to-upgrade flow",
    description:
      "Students can create a trial account first, then upgrade from billing when the course is the right fit.",
  },
];

const courseFaqs: MarketingFaqItem[] = [
  {
    question: "Is this course for Pearson Edexcel GCSE Russian?",
    answer:
      "Yes. The public guidance and course structure are focused on Pearson Edexcel GCSE Russian 1RU0, including Foundation and Higher preparation.",
  },
  {
    question: "Can a private candidate use the course?",
    answer:
      "Yes. The course can support preparation, but private candidates still need to arrange exam entry, deadlines, and speaking assessment details with an exam centre.",
  },
  {
    question: "Does the course replace live lessons?",
    answer:
      "Not always. Some students can study independently with a structured platform, while others benefit from live teacher support for speaking, writing, and accountability.",
  },
  {
    question: "Should students choose Foundation or Higher first?",
    answer:
      "Students should choose the pathway that matches their current level and exam target. Families can use the Foundation and Higher guides to compare the demands.",
  },
];

const relatedLinks = [
  {
    title: "Pearson Edexcel GCSE Russian",
    description: "Understand the exam board, qualification code, papers, and tier model.",
    href: "/edexcel-gcse-russian",
    icon: "school" as const,
  },
  {
    title: "GCSE Russian exam guide",
    description: "See how listening, speaking, reading, and writing fit together.",
    href: "/gcse-russian-exam-guide",
    icon: "exam" as const,
  },
  {
    title: "GCSE Russian Foundation tier",
    description: "Understand how Foundation preparation can stay focused and measurable.",
    href: "/gcse-russian-foundation-tier",
    icon: "layers" as const,
  },
  {
    title: "GCSE Russian Higher tier",
    description:
      "See how Higher tier preparation uses range, accuracy, and exam technique.",
    href: "/gcse-russian-higher-tier",
    icon: "layers" as const,
  },
  {
    title: "Russian GCSE private candidate guide",
    description:
      "Learn how the course can support students arranging their own exam entry.",
    href: "/russian-gcse-private-candidate",
    icon: "userCheck" as const,
  },
];

export default function GcseRussianCoursePage() {
  return (
    <>
      <JsonLd
        data={[
          buildCourseJsonLd({
            name: "Online GCSE Russian Course",
            description:
              "A structured online GCSE Russian course for Pearson Edexcel 1RU0 students, with Foundation and Higher pathways, guided lessons, grammar, vocabulary, and exam practice.",
            path: "/gcse-russian-course",
          }),
          buildFaqJsonLd(courseFaqs),
        ]}
      />
      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "Course", href: "/gcse-russian-course" },
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
              <Button href="/pricing" variant="secondary" icon="pricing">
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

        <SectionCard
          title="What students get from a structured course"
          description="The course is intended to turn GCSE Russian preparation into a clear routine: learn, practise, review, and return to the next lesson."
          tone="muted"
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {courseIncludes.map((item) => (
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

        <MarketingFaqSection
          title="GCSE Russian course questions"
          description="Practical answers for families deciding whether a structured online course is the right next step."
          items={courseFaqs}
        />

        <MarketingCtaBand
          title="Ready to try the GCSE Russian course?"
          description="Create a trial account first, explore the app, and upgrade inside the platform when the course is the right fit."
        />
      </div>
    </>
  );
}

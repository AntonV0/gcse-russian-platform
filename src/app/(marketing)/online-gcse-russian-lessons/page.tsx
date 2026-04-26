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
import { buildPublicMetadata } from "@/lib/seo/site";
import { buildFaqJsonLd, buildLearningResourceJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = buildPublicMetadata({
  title: "Online GCSE Russian Lessons",
  description:
    "Explore online GCSE Russian lessons and teacher-supported preparation for students who want structured guidance alongside the GCSE Russian course platform.",
  path: "/online-gcse-russian-lessons",
});

const lessonBenefits = [
  {
    title: "Live explanation",
    description:
      "A teacher can explain grammar, translation, pronunciation, and exam technique in the moment.",
  },
  {
    title: "Accountability",
    description:
      "Regular online lessons help students keep momentum when independent study is not enough.",
  },
  {
    title: "Speaking and writing support",
    description:
      "Teacher feedback is especially useful for skills that need correction, confidence, and natural language use.",
  },
];

const classFit = [
  {
    title: "Students who need more guidance",
    description:
      "A live route can help students who struggle to organise revision or understand what to prioritise.",
  },
  {
    title: "Parents looking for support",
    description:
      "Families can combine the platform's structure with teacher-led lessons for a more supported preparation plan.",
  },
  {
    title: "Private candidates",
    description:
      "Online lessons can provide accountability and feedback for students preparing outside a school timetable.",
  },
];

const lessonFaqs: MarketingFaqItem[] = [
  {
    question: "Who benefits most from online GCSE Russian lessons?",
    answer:
      "Students who need speaking practice, writing feedback, grammar explanation, accountability, or private-candidate guidance often benefit most.",
  },
  {
    question: "Can online lessons work alongside the course platform?",
    answer:
      "Yes. The platform can provide lesson structure and practice, while live teaching adds explanation, correction, and a weekly rhythm.",
  },
  {
    question: "Are online lessons necessary for every student?",
    answer:
      "No. Some students can work independently with a structured course. Others need live support, especially for speaking and writing.",
  },
  {
    question: "How do online lessons help with speaking?",
    answer:
      "A teacher can prompt spontaneous answers, correct pronunciation, practise role plays and picture tasks, and build confidence under exam-style pressure.",
  },
];

const relatedLinks = [
  {
    title: "Online GCSE Russian course",
    description: "Compare self-study course access with teacher-supported learning.",
    href: "/gcse-russian-course",
    icon: "courses" as const,
  },
  {
    title: "Russian GCSE private candidate guide",
    description: "See how online support can help private-candidate preparation.",
    href: "/russian-gcse-private-candidate",
    icon: "userCheck" as const,
  },
  {
    title: "GCSE Russian tutor or online course?",
    description: "Compare tutors, online lessons, and platform access.",
    href: "/gcse-russian-tutor",
    icon: "school" as const,
  },
  {
    title: "GCSE Russian course pricing",
    description: "Start with trial access before deciding on the right level of support.",
    href: "/pricing",
    icon: "pricing" as const,
  },
];

export default function OnlineGcseRussianLessonsPage() {
  return (
    <>
      <JsonLd
        data={[
          buildLearningResourceJsonLd({
            name: "Online GCSE Russian Lessons",
            description:
              "A guide to online GCSE Russian lessons and teacher-supported preparation alongside the GCSE Russian course platform.",
            path: "/online-gcse-russian-lessons",
            keywords: [
              "online GCSE Russian lessons",
              "GCSE Russian tutor",
              "Russian GCSE classes",
            ],
            relatedLinks,
          }),
          buildFaqJsonLd(lessonFaqs),
        ]}
      />
      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "Resources", href: "/resources" },
          { label: "Online lessons", href: "/online-gcse-russian-lessons" },
        ]}
      />
      <div className="space-y-8 py-8 md:py-12">
        <PageIntroPanel
          tone="brand"
          eyebrow="Online GCSE Russian lessons"
          title="Online GCSE Russian lessons with structured support"
          description="Some students need more than self-study. Online GCSE Russian lessons can add teacher guidance, accountability, and feedback alongside the course platform."
          badges={
            <>
              <Badge tone="info" icon="school">
                Live teacher support
              </Badge>
              <Badge tone="muted" icon="speaking">
                Speaking and writing
              </Badge>
              <Badge tone="muted" icon="courses">
                Course platform
              </Badge>
            </>
          }
          actions={
            <>
              <Button href="/signup" variant="primary" icon="create">
                Start trial
              </Button>
              <Button
                href="https://volnaschool.com"
                variant="secondary"
                icon="externalLink"
              >
                Visit Volna School
              </Button>
            </>
          }
        />

        <MarketingFeatureGrid items={lessonBenefits} />

        <SectionCard
          title="How lessons and the platform work together"
          description="The course platform gives students structure, resources, and practice. Live lessons can add explanation, correction, and a human rhythm to preparation."
          tone="brand"
          actions={
            <Badge tone="success" icon="school">
              Platform plus teaching
            </Badge>
          }
        />

        <MarketingFeatureGrid items={classFit} tone="muted" />

        <MarketingRelatedLinks links={relatedLinks} />

        <MarketingFaqSection
          title="Online lesson questions"
          description="Use these answers to decide whether teacher-supported learning should sit alongside the course platform."
          items={lessonFaqs}
        />

        <MarketingCtaBand
          title="Start with the platform, add teaching when useful"
          description="Create a trial account to explore the course structure. Students who need live support can connect the platform with Volna School lessons."
          secondaryHref="/gcse-russian-course"
          secondaryLabel="View course"
        />
      </div>
    </>
  );
}

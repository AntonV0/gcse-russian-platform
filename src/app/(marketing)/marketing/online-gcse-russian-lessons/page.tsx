import type { Metadata } from "next";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import {
  MarketingCtaBand,
  MarketingFeatureGrid,
  MarketingRelatedLinks,
} from "@/components/marketing/marketing-page-sections";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "Online GCSE Russian Lessons",
  description:
    "Explore online GCSE Russian lessons and teacher-supported preparation for students who want structured guidance alongside the GCSE Russian course platform.",
  path: "/marketing/online-gcse-russian-lessons",
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

const relatedLinks = [
  {
    title: "Online GCSE Russian course",
    description: "Compare self-study course access with teacher-supported learning.",
    href: "/marketing/gcse-russian-course",
    icon: "courses" as const,
  },
  {
    title: "Russian GCSE private candidate guide",
    description: "See how online support can help private-candidate preparation.",
    href: "/marketing/russian-gcse-private-candidate",
    icon: "userCheck" as const,
  },
  {
    title: "GCSE Russian course pricing",
    description: "Start with trial access before deciding on the right level of support.",
    href: "/marketing/pricing",
    icon: "pricing" as const,
  },
];

export default function OnlineGcseRussianLessonsPage() {
  return (
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
            <Button href="https://volnaschool.com" variant="secondary" icon="externalLink">
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

      <MarketingCtaBand
        title="Start with the platform, add teaching when useful"
        description="Create a trial account to explore the course structure. Students who need live support can connect the platform with Volna School lessons."
        secondaryHref="/marketing/gcse-russian-course"
        secondaryLabel="View course"
      />
    </div>
  );
}

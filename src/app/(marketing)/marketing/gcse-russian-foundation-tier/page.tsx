import type { Metadata } from "next";
import EvergreenGuidePage from "@/components/marketing/evergreen-guide-page";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Foundation Tier Guide",
  description:
    "A GCSE Russian Foundation tier guide for Pearson Edexcel 1RU0 students, explaining revision priorities, vocabulary, grammar, and exam preparation.",
  path: "/marketing/gcse-russian-foundation-tier",
});

export default function GcseRussianFoundationTierPage() {
  return (
    <EvergreenGuidePage
      eyebrow="Foundation tier"
      title="GCSE Russian Foundation tier guide"
      description="Foundation tier students need secure core language, regular practice, and confidence with familiar exam tasks. The aim is accuracy, understanding, and steady progress."
      path="/marketing/gcse-russian-foundation-tier"
      keywords={[
        "GCSE Russian Foundation tier",
        "Russian GCSE Foundation",
        "Edexcel Russian Foundation tier",
      ]}
      badges={[
        { label: "Foundation tier", icon: "layers", tone: "info" },
        { label: "Core vocabulary", icon: "vocabulary" },
        { label: "Exam confidence", icon: "exam" },
      ]}
      sections={[
        {
          title: "Foundation tier priorities",
          description:
            "A focused Foundation plan should make the most common language secure before adding complexity.",
          items: [
            {
              title: "Understand common topics",
              description:
                "Students should revise familiar themes such as identity, school, holidays, local area, free time, future plans, and global issues.",
            },
            {
              title: "Build reliable sentences",
              description:
                "Short accurate sentences, opinions, reasons, negatives, time phrases, and simple tense control are more valuable than risky complexity.",
            },
            {
              title: "Practise accessible tasks",
              description:
                "Foundation preparation should include regular listening, reading, translation, short writing, and speaking responses.",
            },
          ],
        },
        {
          title: "How the course can support Foundation students",
          description:
            "Foundation students often need structure, repetition, and clear feedback loops.",
          items: [
            {
              title: "Small lesson steps",
              description:
                "Short lessons help students build confidence without being overwhelmed by too much grammar or vocabulary at once.",
            },
            {
              title: "Repeated retrieval",
              description:
                "Core vocabulary and structures should return often so students can recognise and use them under exam conditions.",
            },
            {
              title: "Exam-linked practice",
              description:
                "Practice should connect directly to GCSE task types rather than general Russian study alone.",
            },
          ],
        },
      ]}
      relatedLinks={[
        {
          title: "GCSE Russian vocabulary guide",
          description: "Plan Foundation vocabulary revision by theme and use.",
          href: "/marketing/gcse-russian-vocabulary",
          icon: "vocabulary",
        },
        {
          title: "GCSE Russian grammar guide",
          description: "Focus on grammar that supports clear exam answers.",
          href: "/marketing/gcse-russian-grammar",
          icon: "grammar",
        },
        {
          title: "GCSE Russian revision guide",
          description: "Build a revision routine that fits the tier.",
          href: "/marketing/gcse-russian-revision",
          icon: "calendar",
        },
      ]}
      ctaTitle="Build Foundation confidence step by step"
      ctaDescription="Start with structured course access so students can practise core Russian regularly and see what still needs attention."
    />
  );
}

import type { Metadata } from "next";
import EvergreenGuidePage from "@/components/marketing/evergreen-guide-page";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian for Parents",
  description:
    "A parent-friendly guide to GCSE Russian, Pearson Edexcel 1RU0 preparation, private candidates, online lessons, and structured course support.",
  path: "/gcse-russian-for-parents",
});

export default function GcseRussianForParentsPage() {
  return (
    <EvergreenGuidePage
      eyebrow="Parent guide"
      title="GCSE Russian guide for parents"
      description="Parents often need a clear view of what GCSE Russian involves, what support is realistic, and how to help without having to manage every lesson themselves."
      path="/gcse-russian-for-parents"
      keywords={[
        "GCSE Russian for parents",
        "Russian GCSE course for child",
        "GCSE Russian online course parents",
      ]}
      badges={[
        { label: "Parent support", icon: "users", tone: "info" },
        { label: "Edexcel 1RU0", icon: "school" },
        { label: "Trial-first", icon: "unlocked" },
      ]}
      sections={[
        {
          title: "What parents usually need to know",
          description:
            "The most important questions are about exam structure, time, support, and whether the student can practise consistently.",
          items: [
            {
              title: "Which exam board?",
              description:
                "This platform is built around Pearson Edexcel GCSE Russian 1RU0, so public guide pages and course practice should match that qualification route.",
            },
            {
              title: "How much structure?",
              description:
                "Many students need a clear weekly path rather than a loose collection of worksheets, videos, and past papers.",
            },
            {
              title: "What kind of feedback?",
              description:
                "Speaking and writing often need more correction than reading and listening, so families may choose a blended route with teacher support.",
            },
          ],
        },
        {
          title: "How to support without taking over",
          description:
            "Parents can help most by making study visible, regular, and connected to the exam.",
          items: [
            {
              title: "Check progress, not every answer",
              description:
                "A platform route helps parents see whether study is happening, while the student still owns the learning.",
            },
            {
              title: "Protect short study blocks",
              description:
                "Consistent short sessions for vocabulary, grammar, listening, and writing are more useful than occasional cramming.",
            },
            {
              title: "Plan early for private entry",
              description:
                "If the student is a private candidate, exam-centre and speaking-arrangement questions should be investigated well before the exam season.",
            },
          ],
        },
      ]}
      relatedLinks={[
        {
          title: "Russian GCSE private candidate guide",
          description: "Understand exam-centre and private-entry planning.",
          href: "/russian-gcse-private-candidate",
          icon: "userCheck",
        },
        {
          title: "GCSE Russian tutor or online course?",
          description: "Compare course access, tutor support, and online lessons.",
          href: "/gcse-russian-tutor",
          icon: "school",
        },
        {
          title: "GCSE Russian revision guide",
          description: "Help the student turn exam preparation into a routine.",
          href: "/gcse-russian-revision",
          icon: "calendar",
        },
      ]}
      ctaTitle="Start with a low-pressure trial"
      ctaDescription="A trial account lets the family inspect the course structure before deciding how much support the student needs."
      ctaSecondaryHref="/pricing"
      ctaSecondaryLabel="View pricing"
    />
  );
}

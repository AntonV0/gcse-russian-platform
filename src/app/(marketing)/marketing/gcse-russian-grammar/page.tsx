import type { Metadata } from "next";
import EvergreenGuidePage from "@/components/marketing/evergreen-guide-page";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Grammar Guide",
  description:
    "A practical GCSE Russian grammar guide explaining how grammar supports reading, listening, speaking, writing, translation, and Edexcel 1RU0 revision.",
  path: "/marketing/gcse-russian-grammar",
});

export default function GcseRussianGrammarPage() {
  return (
    <EvergreenGuidePage
      eyebrow="GCSE Russian grammar"
      title="GCSE Russian grammar guide"
      description="Grammar is not a separate extra: it affects every GCSE Russian paper. Students need enough control to understand meaning and produce accurate Russian."
      badges={[
        { label: "Grammar revision", icon: "grammar", tone: "info" },
        { label: "All four skills", icon: "exam" },
        { label: "Foundation and Higher", icon: "layers" },
      ]}
      sections={[
        {
          title: "Why grammar matters for GCSE Russian",
          description:
            "Grammar helps students understand what they read and hear, and it gives them control when they speak or write.",
          items: [
            {
              title: "Cases and endings",
              description:
                "Endings can show who does what, where something is, movement, possession, and relationships between words.",
            },
            {
              title: "Verbs and tense",
              description:
                "Students need to recognise and produce present, past, future, opinions, preferences, and common modal structures.",
            },
            {
              title: "Sentence control",
              description:
                "Word order, negatives, conjunctions, and comparisons help students write and speak more clearly.",
            },
          ],
        },
        {
          title: "Best public/private split",
          description:
            "Public pages can summarise rules. The app is better for practice, examples, checking, and progress.",
          items: [
            {
              title: "Public summaries",
              description:
                "Short grammar explanations can rank and help families understand what the course covers.",
            },
            {
              title: "Locked practice",
              description:
                "Interactive exercises, lesson order, and progress should stay inside the app where students can practise properly.",
            },
            {
              title: "Connected exam tasks",
              description:
                "Grammar should connect to translation, speaking, writing, and reading rather than isolated rule memorisation.",
            },
          ],
        },
      ]}
      relatedLinks={[
        {
          title: "GCSE Russian writing exam guide",
          description: "See how grammar accuracy affects written answers.",
          href: "/marketing/gcse-russian-writing-exam",
          icon: "write",
        },
        {
          title: "GCSE Russian reading exam guide",
          description: "Use grammar awareness to understand meaning in texts.",
          href: "/marketing/gcse-russian-reading-exam",
          icon: "lessonContent",
        },
        {
          title: "Online GCSE Russian course",
          description: "Practise grammar inside a structured learning sequence.",
          href: "/marketing/gcse-russian-course",
          icon: "courses",
        },
      ]}
      ctaTitle="Practise grammar in context"
      ctaDescription="Use public summaries to understand the rules, then move into the app for structured grammar practice and exam-linked tasks."
    />
  );
}

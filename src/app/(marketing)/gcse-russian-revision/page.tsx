import type { Metadata } from "next";
import EvergreenGuidePage from "@/components/marketing/evergreen-guide-page";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Revision Guide",
  description:
    "A practical GCSE Russian revision guide for Pearson Edexcel 1RU0 students, covering planning, vocabulary, grammar, past papers, and exam skills.",
  path: "/gcse-russian-revision",
});

export default function GcseRussianRevisionPage() {
  return (
    <EvergreenGuidePage
      eyebrow="GCSE Russian revision"
      title="GCSE Russian revision guide"
      description="Effective GCSE Russian revision needs more than last-minute vocabulary lists. Students need a steady plan that combines language knowledge with exam-paper practice."
      path="/gcse-russian-revision"
      keywords={[
        "GCSE Russian revision",
        "Russian GCSE revision",
        "Edexcel Russian revision",
      ]}
      badges={[
        { label: "Revision planning", icon: "calendar", tone: "info" },
        { label: "Exam practice", icon: "exam" },
        { label: "Vocabulary and grammar", icon: "vocabulary" },
      ]}
      sections={[
        {
          title: "What to revise first",
          description:
            "A good revision plan balances the four exam skills with the language foundations that support them.",
          items: [
            {
              title: "High-frequency vocabulary",
              description:
                "Start with themes, opinions, time phrases, question words, common verbs, and words that appear across multiple papers.",
            },
            {
              title: "Grammar that changes meaning",
              description:
                "Prioritise tense, cases, agreement, negatives, comparisons, and sentence structures that affect reading, listening, speaking, and writing.",
            },
            {
              title: "Paper-specific technique",
              description:
                "Practise the task types separately so students know how to approach listening, speaking, reading, writing, and translation.",
            },
          ],
        },
        {
          title: "How to make revision measurable",
          description:
            "Students make faster progress when they can see what has been practised, what is secure, and what still needs attention.",
          items: [
            {
              title: "Use short weekly cycles",
              description:
                "Plan one vocabulary theme, one grammar focus, one receptive task, and one productive task each week.",
            },
            {
              title: "Review mistakes deliberately",
              description:
                "Keep a record of recurring errors in endings, tense choice, spelling, word order, and misunderstood question language.",
            },
            {
              title: "Move from notes to retrieval",
              description:
                "Reading notes is useful at the start, but revision should quickly become recall, translation, listening, writing, and speaking practice.",
            },
          ],
        },
      ]}
      relatedLinks={[
        {
          title: "GCSE Russian past papers",
          description: "Use past papers as part of a structured revision cycle.",
          href: "/gcse-russian-past-papers",
          icon: "pastPapers",
        },
        {
          title: "GCSE Russian vocabulary guide",
          description: "Organise vocabulary by theme, tier, and exam use.",
          href: "/gcse-russian-vocabulary",
          icon: "vocabulary",
        },
        {
          title: "Online GCSE Russian course",
          description: "Turn revision topics into guided lessons and practice.",
          href: "/gcse-russian-course",
          icon: "courses",
        },
      ]}
      ctaTitle="Turn revision into a weekly plan"
      ctaDescription="Use the public guides to choose what matters, then use the course platform for structured lessons, practice, and progress tracking."
      ctaSecondaryHref="/gcse-russian-exam-guide"
      ctaSecondaryLabel="Exam guide"
    />
  );
}

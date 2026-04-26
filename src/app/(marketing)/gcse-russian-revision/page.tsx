import type { Metadata } from "next";
import EvergreenGuidePage from "@/components/marketing/evergreen-guide-page";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Revision Guide",
  description:
    "A practical GCSE Russian revision guide for Pearson Edexcel 1RU0 students, covering planning, vocabulary, grammar, past papers, and exam skills.",
  path: "/gcse-russian-revision",
  ogTitle: "GCSE Russian Revision Guide",
  ogDescription:
    "Build a weekly GCSE Russian revision plan across vocabulary, grammar, exam papers, and review.",
  ogImagePath: getOgImagePath("revision"),
  ogImageAlt: "GCSE Russian revision guide",
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
        {
          title: "A weekly GCSE Russian revision cycle",
          description:
            "The best revision plans repeat the same core rhythm so students build fluency without losing sight of exam technique.",
          items: [
            {
              title: "Day 1: vocabulary retrieval",
              description:
                "Review one theme, then test recall both ways: Russian to English and English to Russian.",
            },
            {
              title: "Day 2: grammar in sentences",
              description:
                "Practise one grammar point in short sentences before using it in translation or writing.",
            },
            {
              title: "Day 3: listening or reading",
              description:
                "Use one receptive task to practise speed, question language, distractors, and inference.",
            },
            {
              title: "Day 4: speaking or writing",
              description:
                "Produce Russian from memory, then correct accuracy, range, word order, and endings.",
            },
            {
              title: "Day 5: mistake review",
              description:
                "Turn mistakes into a short action list instead of simply recording a score.",
            },
            {
              title: "Weekend: mixed practice",
              description:
                "Bring vocabulary, grammar, and exam tasks together in a short timed session.",
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
      faqs={[
        {
          question: "How early should GCSE Russian revision start?",
          answer:
            "Students should start steady revision well before the exam season because vocabulary, grammar, listening confidence, and speaking fluency need repeated practice.",
        },
        {
          question: "Should revision begin with past papers?",
          answer:
            "Not usually. Past papers are most useful after students have enough vocabulary and grammar to learn from the result rather than simply feel exposed by it.",
        },
        {
          question: "What should students revise every week?",
          answer:
            "A balanced week should include vocabulary retrieval, one grammar focus, one listening or reading task, one speaking or writing task, and a short mistake review.",
        },
        {
          question: "How can parents tell whether revision is working?",
          answer:
            "Look for evidence of retrieval, corrected mistakes, repeated practice, and improved confidence across papers, not just time spent with notes open.",
        },
      ]}
      ctaTitle="Turn revision into a weekly plan"
      ctaDescription="Use the public guides to choose what matters, then use the course platform for structured lessons, practice, and progress tracking."
      ctaSecondaryHref="/gcse-russian-exam-guide"
      ctaSecondaryLabel="Exam guide"
    />
  );
}

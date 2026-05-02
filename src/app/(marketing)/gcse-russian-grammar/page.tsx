import type { Metadata } from "next";
import StudyGuidePage from "@/components/marketing/study-guide-page";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Grammar Guide",
  description:
    "A practical GCSE Russian grammar guide explaining how grammar supports reading, listening, speaking, writing, translation, and Edexcel 1RU0 revision.",
  path: "/gcse-russian-grammar",
  ogTitle: "GCSE Russian Grammar Guide",
  ogDescription:
    "Prioritise GCSE Russian grammar that changes meaning, sentence control, translation, and output.",
  ogImagePath: getOgImagePath("grammar"),
  ogImageAlt: "GCSE Russian grammar guide",
});

export default function GcseRussianGrammarPage() {
  return (
    <StudyGuidePage
      path="/gcse-russian-grammar"
      eyebrow="GCSE Russian grammar"
      title="Use grammar to control meaning, not just learn rules."
      description="Grammar affects every GCSE Russian paper. Students need enough control to understand what they read and hear, then produce accurate Russian in speaking, writing, and translation."
      keywords={[
        "GCSE Russian grammar",
        "Russian grammar GCSE",
        "Edexcel Russian grammar",
      ]}
      badges={[
        { label: "Grammar revision", icon: "grammar", tone: "info" },
        { label: "All four skills", icon: "exam" },
        { label: "Foundation and Higher", icon: "layers" },
      ]}
      heroIcon="grammar"
      heroLabel="Grammar strategy"
      heroMetric="Meaning, accuracy, output"
      heroRows={[
        ["Comprehension", "Understand who did what and when", "lessonContent"],
        ["Output", "Write and speak with more control", "write"],
        ["Translation", "Spot the grammar behind the sentence", "translation"],
      ]}
      focusTitle="Prioritise the grammar that changes exam answers."
      focusDescription="Students do not need to master every rule at once. The best starting points are patterns that affect meaning across several papers."
      focusItems={[
        {
          title: "Verbs and tense",
          description:
            "Present, past, future, common verbs, preferences, and modal structures appear across all four papers.",
          icon: "grammar",
        },
        {
          title: "Cases and endings",
          description:
            "Endings can show who does what, where something is, movement, possession, and relationships between words.",
          icon: "layers",
        },
        {
          title: "Opinions and reasons",
          description:
            "Students need reliable patterns for preferences, reasons, comparisons, and justifications.",
          icon: "idea",
        },
      ]}
      routineTitle="Grammar should move quickly from rule to use."
      routineDescription="Short focused practice helps, but grammar becomes valuable when students apply it in sentences, translation, reading, speaking, and writing."
      routineItems={[
        {
          title: "Understand the pattern",
          description:
            "Start with a clear example so the student knows what the grammar changes.",
          icon: "lessonContent",
        },
        {
          title: "Practise in short sentences",
          description:
            "Controlled sentences help students notice endings, tense, word order, and agreement.",
          icon: "exercise",
        },
        {
          title: "Apply in an exam task",
          description:
            "Use the pattern in translation, a written answer, or a speaking response.",
          icon: "examTip",
        },
        {
          title: "Return after mistakes",
          description:
            "Repeated errors should become a focused mini-practice rather than a vague note.",
          icon: "history",
        },
      ]}
      warningTitle="Grammar revision fails when it stays too abstract."
      warningDescription="Students can know a rule in theory but still miss it in reading, listening, translation, or written output."
      warningItems={[
        {
          title: "Memorising tables only",
          description:
            "Tables can help, but students need to use forms in real sentences and exam contexts.",
          icon: "table",
        },
        {
          title: "Ignoring small endings",
          description:
            "Endings can change meaning, especially in reading, translation, and writing accuracy.",
          icon: "warning",
        },
        {
          title: "Adding ambitious language too early",
          description:
            "Range helps only when the sentence still stays accurate and task-focused.",
          icon: "star",
        },
      ]}
      courseFitTitle="The course can keep grammar connected to actual tasks."
      courseFitDescription="Grammar works best when it appears in lessons, examples, controlled practice, translation, and exam-style output."
      courseFitItems={[
        {
          title: "Lesson sequence",
          description:
            "Grammar can be introduced at the point students need it in the course route.",
          icon: "lessons",
        },
        {
          title: "Practice blocks",
          description:
            "Students can practise patterns before using them in harder tasks.",
          icon: "exercise",
        },
        {
          title: "Paper transfer",
          description:
            "The same pattern can support reading, writing, speaking, and translation.",
          icon: "exam",
        },
      ]}
      relatedLinks={[
        {
          title: "GCSE Russian writing exam",
          description: "See how grammar accuracy affects written answers.",
          href: "/gcse-russian-writing-exam",
          icon: "write",
        },
        {
          title: "GCSE Russian reading exam",
          description: "Use grammar awareness to understand meaning in texts.",
          href: "/gcse-russian-reading-exam",
          icon: "lessonContent",
        },
        {
          title: "GCSE Russian vocabulary guide",
          description: "Connect words to forms, endings, and sentence patterns.",
          href: "/gcse-russian-vocabulary",
          icon: "vocabulary",
        },
        {
          title: "GCSE Russian course",
          description: "Practise grammar inside a structured learning sequence.",
          href: "/gcse-russian-course",
          icon: "courses",
        },
      ]}
      faqs={[
        {
          question: "Which Russian grammar matters most for GCSE?",
          answer:
            "Students should prioritise tense, common cases, agreement, negatives, question words, opinions, reasons, and sentence structures used in exam tasks.",
        },
        {
          question: "Should grammar be revised separately?",
          answer:
            "Short focused grammar practice helps, but students should quickly apply it in translation, reading, speaking, and writing.",
        },
        {
          question: "How can students stop repeating grammar mistakes?",
          answer:
            "They should keep a small error log, practise the exact pattern again, and revisit it in a later writing or translation task.",
        },
      ]}
      ctaTitle="Practise grammar in context."
      ctaDescription="Use public summaries to understand the rules, then move into the app for structured grammar practice and exam-linked tasks."
      secondaryHref="/gcse-russian-writing-exam"
      secondaryLabel="Writing guide"
    />
  );
}

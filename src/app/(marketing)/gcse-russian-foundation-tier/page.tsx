import type { Metadata } from "next";
import StudyGuidePage from "@/components/marketing/study-guide-page";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Foundation Tier Guide",
  description:
    "A GCSE Russian Foundation tier guide for Pearson Edexcel 1RU0 students, explaining revision priorities, vocabulary, grammar, and exam preparation.",
  path: "/gcse-russian-foundation-tier",
  ogTitle: "GCSE Russian Foundation Tier Guide",
  ogDescription:
    "Build GCSE Russian Foundation confidence with core vocabulary, grammar, exam tasks, and steady revision.",
  ogImagePath: getOgImagePath("foundation"),
  ogImageAlt: "GCSE Russian Foundation tier guide",
});

export default function GcseRussianFoundationTierPage() {
  return (
    <StudyGuidePage
      path="/gcse-russian-foundation-tier"
      eyebrow="Foundation tier"
      title="Build secure core Russian before adding complexity."
      description="Foundation tier preparation should help students feel organised and capable: familiar topics, reliable sentences, regular retrieval, and exam tasks that build confidence."
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
      heroIcon="layers"
      heroLabel="Foundation route"
      heroMetric="Secure, repeat, apply"
      heroRows={[
        ["Core language", "High-frequency words and sentence patterns", "vocabulary"],
        ["Confidence", "Familiar tasks before harder challenge", "completed"],
        ["Exam link", "Practice still connects to all four papers", "exam"],
      ]}
      focusTitle="Foundation preparation should make the most useful language secure."
      focusDescription="Students need enough vocabulary, grammar, and task confidence to recognise meaning and produce clear answers without being overloaded."
      focusItems={[
        {
          title: "Understand common topics",
          description:
            "Revise familiar GCSE themes such as identity, school, holidays, local area, free time, future plans, and global issues.",
          icon: "vocabularySet",
        },
        {
          title: "Build reliable sentences",
          description:
            "Short accurate sentences, opinions, reasons, negatives, time phrases, and simple tense control are more valuable than risky complexity.",
          icon: "grammar",
        },
        {
          title: "Practise accessible tasks",
          description:
            "Foundation preparation should still include listening, reading, translation, short writing, and speaking responses.",
          icon: "exam",
        },
      ]}
      routineTitle="Foundation students benefit from repetition they can trust."
      routineDescription="The route should revisit core language often enough that students can recognise and use it under exam conditions."
      routineItems={[
        {
          title: "Review one theme",
          description:
            "Keep the vocabulary set small enough to recall, then use it in short answers.",
          icon: "vocabulary",
        },
        {
          title: "Practise one grammar pattern",
          description:
            "Use a focused sentence pattern before moving into translation or writing.",
          icon: "grammar",
        },
        {
          title: "Apply to one paper task",
          description:
            "Use listening, reading, speaking, or writing practice to connect the language to the exam.",
          icon: "questionSet",
        },
        {
          title: "Repeat the weak point",
          description:
            "Return to errors until they become familiar rather than just corrected once.",
          icon: "history",
        },
      ]}
      warningTitle="Foundation does not mean revision can be vague."
      warningDescription="The tier is more accessible, but students still lose marks when basic language is uncertain or practice is too passive."
      warningItems={[
        {
          title: "Skipping retrieval",
          description:
            "Students need to recall words and sentence patterns, not only recognise them in notes.",
          icon: "warning",
        },
        {
          title: "Avoiding speaking and writing",
          description:
            "Short productive answers still need regular practice and correction.",
          icon: "speaking",
        },
        {
          title: "Adding complexity too early",
          description:
            "Risky language can damage confidence if core sentences are not secure first.",
          icon: "star",
        },
      ]}
      courseFitTitle="The course can keep Foundation work calm and repeatable."
      courseFitDescription="Students can move through small lesson steps, repeated vocabulary and grammar, and paper-linked tasks without guessing what to do next."
      courseFitItems={[
        {
          title: "Small lessons",
          description:
            "Short sections help students build confidence without too much content at once.",
          icon: "lessonContent",
        },
        {
          title: "Repeated retrieval",
          description:
            "Core words and patterns can return across lessons, revision, and practice.",
          icon: "sync",
        },
        {
          title: "Progress visibility",
          description:
            "Students and parents can see what has been practised and what comes next.",
          icon: "completed",
        },
      ]}
      relatedLinks={[
        {
          title: "GCSE Russian Higher tier",
          description: "Compare Foundation with the more demanding tier route.",
          href: "/gcse-russian-higher-tier",
          icon: "star",
        },
        {
          title: "GCSE Russian vocabulary guide",
          description: "Plan Foundation vocabulary revision by theme and use.",
          href: "/gcse-russian-vocabulary",
          icon: "vocabulary",
        },
        {
          title: "GCSE Russian grammar guide",
          description: "Focus on grammar that supports clear exam answers.",
          href: "/gcse-russian-grammar",
          icon: "grammar",
        },
        {
          title: "GCSE Russian revision guide",
          description: "Build a revision routine that fits the tier.",
          href: "/gcse-russian-revision",
          icon: "calendar",
        },
      ]}
      faqs={[
        {
          question: "Who should consider Foundation tier GCSE Russian?",
          answer:
            "Foundation is usually best for students who need secure core vocabulary, simpler sentence control, and confidence with familiar GCSE task types.",
        },
        {
          question: "Can a Foundation student move towards Higher later?",
          answer:
            "Sometimes, but the decision should be based on evidence from vocabulary, grammar, translation, and exam-style tasks rather than hope alone.",
        },
        {
          question: "What should Foundation students practise most?",
          answer:
            "They should practise high-frequency vocabulary, accurate short sentences, opinions with reasons, key tenses, listening and reading recognition, and short speaking or writing answers.",
        },
      ]}
      ctaTitle="Build Foundation confidence step by step."
      ctaDescription="Start with structured course access so students can practise core Russian regularly and see what still needs attention."
      secondaryHref="/gcse-russian-higher-tier"
      secondaryLabel="Higher guide"
    />
  );
}

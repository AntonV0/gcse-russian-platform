import type { Metadata } from "next";
import StudyGuidePage from "@/components/marketing/study-guide-page";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Vocabulary Guide",
  description:
    "A practical GCSE Russian vocabulary guide for Edexcel 1RU0 students, covering themes, tiers, active recall, receptive vocabulary, and exam preparation.",
  path: "/gcse-russian-vocabulary",
  ogTitle: "GCSE Russian Vocabulary Guide",
  ogDescription:
    "Organise GCSE Russian vocabulary by theme, tier, active use, recognition, and exam task.",
  ogImagePath: getOgImagePath("vocabulary"),
  ogImageAlt: "GCSE Russian vocabulary guide",
});

export default function GcseRussianVocabularyPage() {
  return (
    <StudyGuidePage
      path="/gcse-russian-vocabulary"
      eyebrow="GCSE Russian vocabulary"
      title="Learn vocabulary by how it will be used in the exam."
      description="Vocabulary revision works best when students know which words they need to recognise, which they need to produce, and how words connect to specific GCSE tasks."
      keywords={[
        "GCSE Russian vocabulary",
        "Edexcel Russian vocabulary",
        "Russian GCSE word list",
      ]}
      badges={[
        { label: "Vocabulary revision", icon: "vocabulary", tone: "info" },
        { label: "Themes and topics", icon: "vocabularySet" },
        { label: "Foundation and Higher", icon: "layers" },
      ]}
      heroIcon="vocabulary"
      heroLabel="Vocabulary strategy"
      heroMetric="Recognise, recall, reuse"
      heroRows={[
        ["Receptive", "Words students need to recognise", "preview"],
        ["Productive", "Words students need to write or say", "write"],
        ["Exam-linked", "Words practised inside paper tasks", "exam"],
      ]}
      focusTitle="Vocabulary should not be treated as one huge list."
      focusDescription="Grouping words by theme helps, but the bigger question is whether the student needs to recognise the word, produce it, spell it, or use it in a sentence."
      focusItems={[
        {
          title: "Theme-based learning",
          description:
            "Topic groups help students predict language in reading, listening, speaking, and writing.",
          icon: "vocabularySet",
        },
        {
          title: "Productive vocabulary",
          description:
            "Words for speaking and writing need active recall, spelling, and use in short sentences.",
          icon: "write",
        },
        {
          title: "Receptive vocabulary",
          description:
            "Some words mainly need recognition in audio or texts, so revision can focus on meaning and context.",
          icon: "preview",
        },
      ]}
      routineTitle="Vocabulary improves when recall becomes regular."
      routineDescription="Students should move beyond rereading lists into short repeated recall, sentence use, mixed review, and paper-linked practice."
      routineItems={[
        {
          title: "Start with a theme",
          description:
            "Group words around a GCSE topic so they connect to likely texts, audio, and answers.",
          icon: "vocabularySet",
        },
        {
          title: "Recall both ways",
          description:
            "Recognition is useful, but speaking and writing need English-to-Russian recall too.",
          icon: "sync",
        },
        {
          title: "Use in sentences",
          description:
            "A word becomes more useful when the student can use it with verbs, opinions, and time phrases.",
          icon: "grammar",
        },
        {
          title: "Bring mistakes back",
          description:
            "Words missed in papers, listening tasks, or writing corrections should return to the next cycle.",
          icon: "history",
        },
      ]}
      warningTitle="Word lists look organised even when revision is passive."
      warningDescription="A long list can feel complete, but students still need retrieval, context, and output practice."
      warningItems={[
        {
          title: "Only revising Russian to English",
          description:
            "That helps reading, but speaking and writing need active English-to-Russian recall.",
          icon: "warning",
        },
        {
          title: "Ignoring spelling and endings",
          description:
            "Words used in writing need accurate forms, not only approximate recognition.",
          icon: "edit",
        },
        {
          title: "Keeping themes too separate",
          description:
            "Mixed-topic review prepares students for less predictable exam texts and audio.",
          icon: "layers",
        },
      ]}
      courseFitTitle="The course can make vocabulary reappear in useful places."
      courseFitDescription="Words are strongest when students meet them in lessons, revision, question sets, and paper practice rather than one isolated list."
      courseFitItems={[
        {
          title: "Reusable sets",
          description:
            "Vocabulary can be grouped with examples, notes, and tier context.",
          icon: "vocabulary",
        },
        {
          title: "Lesson links",
          description:
            "Words become more memorable when they appear in model sentences and tasks.",
          icon: "lessonContent",
        },
        {
          title: "Paper practice",
          description:
            "Students can practise vocabulary through listening, reading, speaking, and writing.",
          icon: "exam",
        },
      ]}
      relatedLinks={[
        {
          title: "GCSE Russian listening exam",
          description: "Use word recognition to improve audio comprehension.",
          href: "/gcse-russian-listening-exam",
          icon: "listening",
        },
        {
          title: "GCSE Russian grammar guide",
          description: "Connect word learning to sentence control.",
          href: "/gcse-russian-grammar",
          icon: "grammar",
        },
        {
          title: "GCSE Russian revision guide",
          description: "Put vocabulary into a weekly revision cycle.",
          href: "/gcse-russian-revision",
          icon: "calendar",
        },
        {
          title: "GCSE Russian course",
          description: "Practise vocabulary inside a structured route.",
          href: "/gcse-russian-course",
          icon: "courses",
        },
      ]}
      faqs={[
        {
          question: "How should GCSE Russian vocabulary be organised?",
          answer:
            "Use themes, tier, and purpose: some words need active production for speaking and writing, while others mainly need recognition.",
        },
        {
          question: "Is a vocabulary list enough?",
          answer:
            "No. Lists are a starting point, but students need retrieval, examples, listening and reading recognition, and sentence practice.",
        },
        {
          question: "How often should vocabulary be reviewed?",
          answer:
            "Short repeated reviews work best. Students should revisit difficult words across several weeks and connect them to exam tasks.",
        },
      ]}
      ctaTitle="Move from word lists to active revision."
      ctaDescription="Start with trial access and use the platform to revise GCSE Russian vocabulary with structure and purpose."
      secondaryHref="/gcse-russian-revision"
      secondaryLabel="Revision guide"
    />
  );
}

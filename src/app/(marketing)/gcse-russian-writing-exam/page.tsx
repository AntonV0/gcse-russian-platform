import type { Metadata } from "next";
import ExamPaperGuidePage from "@/components/marketing/exam-paper-guide-page";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Writing Exam Guide",
  description:
    "Prepare for GCSE Russian Paper 4 writing with guidance on translation into Russian, accurate grammar, opinions, justifications, and extended answers.",
  path: "/gcse-russian-writing-exam",
  ogTitle: "GCSE Russian Writing Exam Guide",
  ogDescription:
    "Build more accurate GCSE Russian writing through grammar, translation, planning, and review.",
  ogImagePath: getOgImagePath("writing"),
  ogImageAlt: "GCSE Russian writing exam guide",
});

export default function GcseRussianWritingExamPage() {
  return (
    <ExamPaperGuidePage
      path="/gcse-russian-writing-exam"
      eyebrow="Paper 4: Writing"
      paperLabel="Paper 4"
      badgeLabel="Writing"
      title="Turn vocabulary and grammar into controlled written answers."
      description="GCSE Russian writing preparation should help students produce accurate Russian, answer the task, translate into Russian, and use language that fits the tier."
      keywords={["GCSE Russian writing", "Paper 4 writing", "Russian writing exam"]}
      heroIcon="write"
      heroMetric="Accuracy, translation, answers"
      heroFocus="Core structures, task coverage, and controlled range"
      heroSupport="Teacher feedback can help repeated grammar errors"
      secondaryHref="/online-gcse-russian-lessons"
      secondaryLabel="Online lessons"
      skillFocus={[
        {
          title: "Accurate core structures",
          description:
            "Students need reliable sentence patterns for opinions, reasons, time frames, comparisons, and preferences.",
          icon: "grammar",
        },
        {
          title: "Translation into Russian",
          description:
            "Translation exposes gaps in vocabulary, cases, verbs, word order, spelling, and sentence control.",
          icon: "translation",
        },
        {
          title: "Extended answers",
          description:
            "Higher-level writing needs development and range, but only when the sentence remains accurate.",
          icon: "write",
        },
      ]}
      practiceRoutine={[
        {
          title: "Prepare useful language",
          description:
            "Build active vocabulary, sentence starters, opinions, reasons, and time phrases before longer tasks.",
          icon: "vocabulary",
        },
        {
          title: "Write to the task",
          description:
            "Students should answer every bullet point rather than forcing in a favourite prepared paragraph.",
          icon: "questionSet",
        },
        {
          title: "Check before adding more",
          description:
            "Verb endings, tense, case, spelling, and task coverage should be checked before extra ambition.",
          icon: "completed",
        },
      ]}
      commonErrors={[
        {
          title: "Memorised paragraphs that miss the task",
          description:
            "Prepared language can help, but it must be adapted to the specific bullet points.",
          icon: "warning",
        },
        {
          title: "Ambition without control",
          description:
            "Connectives, opinions, and comparisons help only when the grammar still works.",
          icon: "grammar",
        },
        {
          title: "Skipping translation practice",
          description:
            "Translation into Russian quickly reveals whether vocabulary and grammar are truly usable.",
          icon: "translation",
        },
      ]}
      courseFit={[
        {
          title: "Grammar before output",
          description:
            "Students write better when grammar points are practised before exam-style tasks.",
          icon: "grammar",
        },
        {
          title: "Active vocabulary",
          description:
            "Writing vocabulary needs active recall, not only recognition in reading or listening.",
          icon: "vocabulary",
        },
        {
          title: "Feedback when useful",
          description:
            "Longer writing can benefit from teacher review for accuracy, range, and task fulfilment.",
          icon: "teacher",
        },
      ]}
      relatedLinks={[
        {
          title: "GCSE Russian grammar guide",
          description: "Build the grammar base that writing depends on.",
          href: "/gcse-russian-grammar",
          icon: "grammar",
        },
        {
          title: "GCSE Russian vocabulary guide",
          description: "Separate active writing vocabulary from recognition vocabulary.",
          href: "/gcse-russian-vocabulary",
          icon: "vocabulary",
        },
        {
          title: "Online GCSE Russian lessons",
          description: "Use teacher support for correction and writing confidence.",
          href: "/online-gcse-russian-lessons",
          icon: "teacher",
        },
      ]}
      faqs={[
        {
          question: "How can students improve GCSE Russian writing?",
          answer:
            "They should practise accurate core sentences, translation into Russian, theme vocabulary, varied opinions, and a final checking routine.",
        },
        {
          question: "Should students memorise writing paragraphs?",
          answer:
            "Prepared language can help, but students need to adapt it to the task. Memorised paragraphs can miss bullet points or sound irrelevant.",
        },
        {
          question: "What does teacher feedback help with?",
          answer:
            "Teacher feedback is useful for repeated grammar errors, sentence range, spelling, task coverage, and choosing language that fits the student's tier.",
        },
      ]}
      ctaTitle="Turn grammar and vocabulary into written answers."
      ctaDescription="Trial access lets students practise the language foundations that make GCSE Russian writing more accurate and less improvised."
    />
  );
}

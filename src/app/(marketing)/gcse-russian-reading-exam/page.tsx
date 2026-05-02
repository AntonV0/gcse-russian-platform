import type { Metadata } from "next";
import ExamPaperGuidePage from "@/components/marketing/exam-paper-guide-page";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Reading Exam Guide",
  description:
    "Prepare for GCSE Russian Paper 3 reading with guidance on comprehension, inference, vocabulary recognition, grammar clues, and translation into English.",
  path: "/gcse-russian-reading-exam",
  ogTitle: "GCSE Russian Reading Exam Guide",
  ogDescription:
    "Build reading strategy for comprehension, inference, grammar clues, and translation into English.",
  ogImagePath: getOgImagePath("reading"),
  ogImageAlt: "GCSE Russian reading exam guide",
});

export default function GcseRussianReadingExamPage() {
  return (
    <ExamPaperGuidePage
      path="/gcse-russian-reading-exam"
      eyebrow="Paper 3: Reading"
      paperLabel="Paper 3"
      badgeLabel="Reading"
      title="Read for the answer, not just a word you recognise."
      description="GCSE Russian reading preparation should build vocabulary recognition, grammar awareness, inference, and calm handling of unfamiliar language."
      keywords={["GCSE Russian reading", "Paper 3 reading", "Russian reading exam"]}
      heroIcon="lessonContent"
      heroMetric="Texts, questions, translation"
      heroFocus="Recognise meaning, not only isolated vocabulary"
      heroSupport="Grammar and vocabulary review after each task"
      skillFocus={[
        {
          title: "Vocabulary recognition",
          description:
            "Students need regular contact with topic words, high-frequency words, cognates, and word families.",
          icon: "vocabulary",
        },
        {
          title: "Grammar awareness",
          description:
            "Cases, verb endings, tense, negatives, and word order can change the meaning of a sentence.",
          icon: "grammar",
        },
        {
          title: "Translation into English",
          description:
            "Students need to transfer meaning accurately without producing awkward literal English.",
          icon: "translation",
        },
      ]}
      practiceRoutine={[
        {
          title: "Read the question first",
          description:
            "Students should know what information they are looking for before rereading the text.",
          icon: "question",
        },
        {
          title: "Scan before translating",
          description:
            "Names, places, time phrases, negatives, and question words often reveal the structure of the task.",
          icon: "search",
        },
        {
          title: "Review unknown words",
          description:
            "After the attempt, unknown words should be sorted into essential vocabulary, useful clues, and non-essential noise.",
          icon: "vocabulary",
        },
      ]}
      commonErrors={[
        {
          title: "Translating every word in order",
          description:
            "Students can lose the point of the text when they treat reading as line-by-line dictionary work.",
          icon: "warning",
        },
        {
          title: "Ignoring grammar clues",
          description:
            "Verb tense, case endings, agreement, and negatives can reveal who is doing what.",
          icon: "grammar",
        },
        {
          title: "Writing English that misses the detail",
          description:
            "Comprehension and translation answers must make sense in English and match the Russian detail.",
          icon: "edit",
        },
      ]}
      courseFit={[
        {
          title: "Theme vocabulary",
          description:
            "Reading improves when students see topic vocabulary repeatedly across lessons and revision.",
          icon: "vocabulary",
        },
        {
          title: "Grammar in context",
          description:
            "Grammar is easier to use in reading when students have practised it through examples.",
          icon: "grammar",
        },
        {
          title: "Past-paper links",
          description:
            "Official resources can be used more deliberately once task habits are in place.",
          icon: "pastPapers",
        },
      ]}
      relatedLinks={[
        {
          title: "GCSE Russian vocabulary guide",
          description: "Organise vocabulary revision for stronger reading recognition.",
          href: "/gcse-russian-vocabulary",
          icon: "vocabulary",
        },
        {
          title: "GCSE Russian grammar guide",
          description: "Review grammar that changes meaning in reading passages.",
          href: "/gcse-russian-grammar",
          icon: "grammar",
        },
        {
          title: "GCSE Russian past papers",
          description: "Use official resources to practise reading under exam conditions.",
          href: "/gcse-russian-past-papers",
          icon: "pastPapers",
        },
      ]}
      faqs={[
        {
          question: "How should students revise for GCSE Russian reading?",
          answer:
            "They should combine theme vocabulary, grammar recognition, question-first reading, translation practice, and review of unknown words after each task.",
        },
        {
          question: "Is reading only vocabulary memorisation?",
          answer:
            "No. Vocabulary matters, but grammar, inference, negatives, time markers, and careful question reading can change the answer.",
        },
        {
          question: "How can students handle unknown words?",
          answer:
            "They should use context, word families, cognates, grammar clues, and the question focus before deciding whether the unknown word is essential.",
        },
      ]}
      ctaTitle="Make reading practice less random."
      ctaDescription="Trial access lets students see how vocabulary, grammar, reading tasks, and progress tracking can work together inside the course."
    />
  );
}

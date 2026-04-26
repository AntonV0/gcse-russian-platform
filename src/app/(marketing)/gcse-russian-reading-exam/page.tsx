import type { Metadata } from "next";
import EvergreenGuidePage from "@/components/marketing/evergreen-guide-page";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Reading Exam Guide",
  description:
    "Prepare for the GCSE Russian reading exam with guidance on comprehension, inference, vocabulary recognition, translation into English, and exam strategy.",
  path: "/gcse-russian-reading-exam",
});

export default function GcseRussianReadingExamPage() {
  return (
    <EvergreenGuidePage
      eyebrow="Paper 3: Reading"
      title="GCSE Russian reading exam guide"
      description="Reading preparation develops vocabulary recognition, grammar awareness, inference, and calm handling of unfamiliar language."
      path="/gcse-russian-reading-exam"
      keywords={["GCSE Russian reading", "Paper 3 reading", "Russian reading exam"]}
      badges={[
        { label: "Paper 3", icon: "lessonContent", tone: "info" },
        { label: "Comprehension and translation", icon: "translation" },
        { label: "Foundation and Higher", icon: "layers" },
      ]}
      sections={[
        {
          title: "What reading revision should build",
          description:
            "Students need to understand texts at different levels: overall meaning, detail, opinion, and implication.",
          items: [
            {
              title: "Vocabulary recognition",
              description:
                "Reading is easier when topic vocabulary and high-frequency words are revised regularly.",
            },
            {
              title: "Grammar awareness",
              description:
                "Cases, verb endings, tense, and word order can change the meaning of a sentence.",
            },
            {
              title: "Translation into English",
              description:
                "Students need to transfer meaning accurately without producing awkward literal English.",
            },
          ],
        },
        {
          title: "How structured practice helps",
          description:
            "Reading improves when students practise with purpose rather than simply looking up every word.",
          items: [
            {
              title: "Question-first strategy",
              description:
                "Students should know what information they are looking for before rereading a text.",
            },
            {
              title: "Theme-based revision",
              description:
                "Texts become less intimidating when students recognise themes, situations, and familiar vocabulary families.",
            },
            {
              title: "Review and repeat",
              description:
                "The app can connect reading tasks to progress and revision so difficult content is not forgotten.",
            },
          ],
        },
        {
          title: "Reading exam habits",
          description:
            "Reading improves when students stop treating every unknown word as a blocker.",
          items: [
            {
              title: "Scan before translating",
              description:
                "Students should identify names, places, time phrases, negatives, and question words before trying to translate a full passage.",
            },
            {
              title: "Use grammar clues",
              description:
                "Verb tense, case endings, and agreement can reveal who is doing what even when one word is unfamiliar.",
            },
            {
              title: "Check English answers",
              description:
                "For comprehension and translation into English, the answer must make sense in English and match the detail of the Russian.",
            },
          ],
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
          description:
            "Use official resources to practise reading under exam conditions.",
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
      ctaTitle="Make reading practice less random"
      ctaDescription="Start with trial access and use the platform to connect vocabulary, grammar, reading tasks, and progress tracking."
    />
  );
}

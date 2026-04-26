import type { Metadata } from "next";
import EvergreenGuidePage from "@/components/marketing/evergreen-guide-page";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Writing Exam Guide",
  description:
    "Prepare for the GCSE Russian writing exam with guidance on translation into Russian, accurate grammar, opinions, justifications, and extended written answers.",
  path: "/gcse-russian-writing-exam",
});

export default function GcseRussianWritingExamPage() {
  return (
    <EvergreenGuidePage
      eyebrow="Paper 4: Writing"
      title="GCSE Russian writing exam guide"
      description="Writing preparation should help students produce accurate Russian, express ideas clearly, and use language that fits the task and tier."
      path="/gcse-russian-writing-exam"
      keywords={["GCSE Russian writing", "Paper 4 writing", "Russian writing exam"]}
      badges={[
        { label: "Paper 4", icon: "write", tone: "info" },
        { label: "Translation into Russian", icon: "translation" },
        { label: "Grammar accuracy", icon: "grammar", tone: "success" },
      ]}
      sections={[
        {
          title: "What writing revision should build",
          description:
            "Good writing preparation combines vocabulary, grammar, sentence control, and task planning.",
          items: [
            {
              title: "Accurate core structures",
              description:
                "Students need reliable sentence patterns for opinions, reasons, time frames, and comparisons.",
            },
            {
              title: "Translation into Russian",
              description:
                "Translation practice exposes gaps in vocabulary, cases, verbs, word order, and spelling.",
            },
            {
              title: "Extended answers",
              description:
                "Higher-level writing needs range, development, and control rather than memorised sentences alone.",
            },
          ],
        },
        {
          title: "How the platform can support writing",
          description:
            "The locked app can give students writing prompts, grammar preparation, and structured revision before longer tasks.",
          items: [
            {
              title: "Grammar before output",
              description:
                "Students write better when grammar points are practised before they appear in exam-style tasks.",
            },
            {
              title: "Vocabulary by purpose",
              description:
                "Productive vocabulary for speaking and writing needs more active recall than recognition-only words.",
            },
            {
              title: "Teacher feedback when useful",
              description:
                "Longer writing can benefit from teacher review, especially for accuracy, range, and task fulfilment.",
            },
          ],
        },
        {
          title: "Writing checklist before submission",
          description:
            "A short checking routine helps students catch errors that cost marks even when the ideas are good.",
          items: [
            {
              title: "Check task coverage",
              description:
                "Students should answer every bullet point and avoid spending too much time on a favourite prepared paragraph.",
            },
            {
              title: "Check verbs and endings",
              description:
                "Tense, person, case, agreement, and spelling should be checked before adding more ambitious language.",
            },
            {
              title: "Add range with control",
              description:
                "Connectives, opinions, reasons, comparisons, and time frames help, but only when the sentence remains accurate.",
            },
          ],
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
          icon: "school",
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
      ctaTitle="Turn grammar and vocabulary into written answers"
      ctaDescription="Start with trial access and practise the language foundations that make GCSE Russian writing more accurate."
    />
  );
}

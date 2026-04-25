import type { Metadata } from "next";
import EvergreenGuidePage from "@/components/marketing/evergreen-guide-page";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Listening Exam Guide",
  description:
    "Prepare for the GCSE Russian listening exam with practical guidance on audio practice, question types, vocabulary recognition, and structured revision.",
  path: "/marketing/gcse-russian-listening-exam",
});

export default function GcseRussianListeningExamPage() {
  return (
    <EvergreenGuidePage
      eyebrow="Paper 1: Listening"
      title="GCSE Russian listening exam guide"
      description="Listening preparation is about more than playing audio. Students need habits for gist, detail, opinions, unknown vocabulary, and exam timing."
      path="/marketing/gcse-russian-listening-exam"
      keywords={["GCSE Russian listening", "Paper 1 listening", "Edexcel GCSE Russian"]}
      badges={[
        { label: "Paper 1", icon: "listening", tone: "info" },
        { label: "Pearson Edexcel 1RU0", icon: "school" },
        { label: "Foundation and Higher", icon: "layers" },
      ]}
      sections={[
        {
          title: "What listening revision should build",
          description:
            "Students need repeated exposure to Russian audio, but they also need a method for extracting meaning under exam pressure.",
          items: [
            {
              title: "Listening for gist",
              description:
                "Students should learn to identify the overall situation before worrying about every word.",
            },
            {
              title: "Listening for detail",
              description:
                "Exam questions often depend on specific times, people, opinions, reasons, or changes of meaning.",
            },
            {
              title: "Handling unknown words",
              description:
                "Good preparation teaches students to use context and familiar language instead of freezing when a word is new.",
            },
          ],
        },
        {
          title: "How the course can support listening",
          description:
            "The logged-in platform is the right place for audio tasks, question attempts, progress, and repeat practice.",
          items: [
            {
              title: "Audio with questions",
              description:
                "Listening tasks can connect audio prompts to multiple-choice, short-answer, and comprehension questions.",
            },
            {
              title: "Vocabulary before audio",
              description:
                "Pre-teaching topic vocabulary helps students recognise more language when they hear it.",
            },
            {
              title: "Review after attempts",
              description:
                "Students need to revisit difficult clips and learn why a distractor or detail mattered.",
            },
          ],
        },
      ]}
      relatedLinks={[
        {
          title: "GCSE Russian exam guide",
          description: "See how listening fits alongside the other three papers.",
          href: "/marketing/gcse-russian-exam-guide",
          icon: "exam",
        },
        {
          title: "GCSE Russian vocabulary guide",
          description: "Build the word recognition needed for listening tasks.",
          href: "/marketing/gcse-russian-vocabulary",
          icon: "vocabulary",
        },
        {
          title: "Online GCSE Russian course",
          description: "Move from guide reading into structured practice.",
          href: "/marketing/gcse-russian-course",
          icon: "courses",
        },
      ]}
      ctaTitle="Practise listening with structure"
      ctaDescription="Start with trial access, then use the course platform to connect vocabulary, audio, questions, and progress tracking."
    />
  );
}

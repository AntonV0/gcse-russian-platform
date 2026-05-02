import type { Metadata } from "next";
import ExamPaperGuidePage from "@/components/marketing/exam-paper-guide-page";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Listening Exam Guide",
  description:
    "Prepare for GCSE Russian Paper 1 listening with practical guidance on audio practice, question strategy, vocabulary recognition, and structured revision.",
  path: "/gcse-russian-listening-exam",
  ogTitle: "GCSE Russian Listening Exam Guide",
  ogDescription:
    "Build better listening habits for gist, detail, opinions, distractors, and vocabulary recognition.",
  ogImagePath: getOgImagePath("listening"),
  ogImageAlt: "GCSE Russian listening exam guide",
});

export default function GcseRussianListeningExamPage() {
  return (
    <ExamPaperGuidePage
      path="/gcse-russian-listening-exam"
      eyebrow="Paper 1: Listening"
      paperLabel="Paper 1"
      badgeLabel="Listening"
      title="Listen for meaning, not just familiar words."
      description="GCSE Russian listening preparation should teach students how to follow spoken Russian under pressure: gist, detail, opinions, time markers, negatives, and distractors."
      keywords={["GCSE Russian listening", "Paper 1 listening", "Edexcel GCSE Russian"]}
      heroIcon="listening"
      heroMetric="Audio, questions, review"
      heroFocus="Gist, detail, opinions, and distractors"
      heroSupport="Vocabulary before audio and careful review after attempts"
      skillFocus={[
        {
          title: "Listening for gist",
          description:
            "Students should identify the situation and speaker attitude before trying to decode every word.",
          icon: "listening",
        },
        {
          title: "Listening for detail",
          description:
            "Marks often depend on small details: times, people, opinions, reasons, negatives, or changes of plan.",
          icon: "search",
        },
        {
          title: "Handling unknown words",
          description:
            "Good listening practice teaches students to use context instead of freezing when one word is unfamiliar.",
          icon: "brain",
        },
      ]}
      practiceRoutine={[
        {
          title: "Preview the question",
          description:
            "Students should know what detail they are listening for before the audio begins.",
          icon: "question",
        },
        {
          title: "Listen for the whole message",
          description:
            "Audio can mention several options, so students need to follow corrections, contrast, and final opinion.",
          icon: "listening",
        },
        {
          title: "Review with vocabulary",
          description:
            "Missed answers should feed back into topic words, sound patterns, and future listening practice.",
          icon: "vocabulary",
        },
      ]}
      commonErrors={[
        {
          title: "Answering from a keyword only",
          description:
            "A familiar word can be a distractor if the speaker rejects it, changes their mind, or gives a different final answer.",
          icon: "warning",
        },
        {
          title: "Missing time markers",
          description:
            "Words such as yesterday, next year, usually, never, and after school can change the answer completely.",
          icon: "calendar",
        },
        {
          title: "Using transcripts too early",
          description:
            "Transcripts are useful after an attempt, but students need realistic listening practice first.",
          icon: "text",
        },
      ]}
      courseFit={[
        {
          title: "Audio tasks",
          description:
            "Listening work can connect audio prompts to questions, attempts, and review.",
          icon: "audio",
        },
        {
          title: "Vocabulary prep",
          description:
            "Topic vocabulary is easier to recognise in audio when it has been practised before the task.",
          icon: "vocabulary",
        },
        {
          title: "Progress review",
          description:
            "Difficult clips and missed details should become part of the student's next revision step.",
          icon: "completed",
        },
      ]}
      relatedLinks={[
        {
          title: "GCSE Russian vocabulary guide",
          description: "Build the word recognition needed for listening tasks.",
          href: "/gcse-russian-vocabulary",
          icon: "vocabulary",
        },
        {
          title: "GCSE Russian exam guide",
          description: "See how listening fits alongside the other three papers.",
          href: "/gcse-russian-exam-guide",
          icon: "exam",
        },
        {
          title: "Online GCSE Russian course",
          description: "Move from guide reading into structured practice.",
          href: "/gcse-russian-course",
          icon: "courses",
        },
      ]}
      faqs={[
        {
          question: "How can students improve GCSE Russian listening?",
          answer:
            "They should combine topic vocabulary, repeated audio practice, question-first listening, and careful review of distractors and missed details.",
        },
        {
          question: "Should listening practice use transcripts?",
          answer:
            "Transcripts are useful after an attempt. Students should first listen under realistic conditions, then use the transcript to diagnose vocabulary and sound patterns.",
        },
        {
          question: "What makes listening hard at Higher tier?",
          answer:
            "Higher listening can include less predictable vocabulary, faster processing, more inference, and distractors that require students to follow the whole meaning.",
        },
      ]}
      ctaTitle="Practise listening with a clearer routine."
      ctaDescription="Trial access lets students see how vocabulary, audio, questions, and progress tracking can work together inside the course."
    />
  );
}

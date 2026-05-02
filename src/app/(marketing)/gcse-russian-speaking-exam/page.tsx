import type { Metadata } from "next";
import ExamPaperGuidePage from "@/components/marketing/exam-paper-guide-page";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Speaking Exam Guide",
  description:
    "Prepare for GCSE Russian Paper 2 speaking with guidance on role play, picture-based tasks, conversation, pronunciation, and teacher-supported practice.",
  path: "/gcse-russian-speaking-exam",
  ogTitle: "GCSE Russian Speaking Exam Guide",
  ogDescription:
    "Build speaking confidence for role play, picture-based tasks, conversation, and live response.",
  ogImagePath: getOgImagePath("speaking"),
  ogImageAlt: "GCSE Russian speaking exam guide",
});

export default function GcseRussianSpeakingExamPage() {
  return (
    <ExamPaperGuidePage
      path="/gcse-russian-speaking-exam"
      eyebrow="Paper 2: Speaking"
      paperLabel="Paper 2"
      badgeLabel="Speaking"
      title="Speaking confidence needs repetition, not memorised paragraphs alone."
      description="GCSE Russian speaking preparation should build answer patterns, pronunciation, flexible responses, and confidence before the speaking window arrives."
      keywords={["GCSE Russian speaking", "Paper 2 speaking", "Russian speaking exam"]}
      heroIcon="speaking"
      heroMetric="Role play, picture, conversation"
      heroFocus="Answer clearly, extend ideas, and recover from prompts"
      heroSupport="Live feedback is often useful for pronunciation and confidence"
      secondaryHref="/online-gcse-russian-lessons"
      secondaryLabel="Online lessons"
      skillFocus={[
        {
          title: "Role play responses",
          description:
            "Students need concise answers, simple questions, requests, and the ability to handle an unexpected prompt.",
          icon: "chat",
        },
        {
          title: "Picture-based answers",
          description:
            "Students should describe people, actions, opinions, and reasons without relying on one fixed paragraph.",
          icon: "image",
        },
        {
          title: "Conversation confidence",
          description:
            "The strongest preparation helps students expand answers, justify opinions, and repair mistakes.",
          icon: "speaking",
        },
      ]}
      practiceRoutine={[
        {
          title: "Build flexible answer banks",
          description:
            "Prepare useful phrases for opinions, reasons, preferences, time frames, and asking simple questions.",
          icon: "vocabulary",
        },
        {
          title: "Practise prompt changes",
          description:
            "Students should adapt to changed questions rather than depend on one memorised version.",
          icon: "sync",
        },
        {
          title: "Record and review",
          description:
            "Short recordings reveal hesitation, pronunciation issues, missing verbs, and answers that are too brief.",
          icon: "audio",
        },
      ]}
      commonErrors={[
        {
          title: "Over-memorising",
          description:
            "Prepared language helps, but memorised answers can fail when the question changes.",
          icon: "warning",
        },
        {
          title: "Short answers with no reason",
          description:
            "Students often need to add why, when, with whom, or what changed to show more useful language.",
          icon: "idea",
        },
        {
          title: "Leaving speaking too late",
          description:
            "Speaking confidence, pronunciation, and spontaneous response need time and repetition.",
          icon: "calendar",
        },
      ]}
      courseFit={[
        {
          title: "Lesson language",
          description:
            "Course lessons can build reusable opinions, reasons, tense patterns, and topic vocabulary.",
          icon: "lessonContent",
        },
        {
          title: "Teacher support",
          description:
            "Live support can help with pronunciation, question handling, and confidence under pressure.",
          icon: "teacher",
        },
        {
          title: "Private candidates",
          description:
            "Families should confirm speaking arrangements directly with their exam centre.",
          icon: "userCheck",
        },
      ]}
      relatedLinks={[
        {
          title: "Online GCSE Russian lessons",
          description: "Explore teacher-supported speaking and writing preparation.",
          href: "/online-gcse-russian-lessons",
          icon: "teacher",
        },
        {
          title: "Russian GCSE private candidate guide",
          description: "Plan speaking preparation outside a school timetable.",
          href: "/russian-gcse-private-candidate",
          icon: "userCheck",
        },
        {
          title: "GCSE Russian writing exam guide",
          description: "Pair speaking confidence with stronger written accuracy.",
          href: "/gcse-russian-writing-exam",
          icon: "write",
        },
      ]}
      faqs={[
        {
          question: "When is the GCSE Russian speaking exam?",
          answer:
            "Pearson Edexcel GCSE Russian speaking is completed in the April/May assessment window, before the main written papers.",
        },
        {
          question: "Can students prepare speaking without a teacher?",
          answer:
            "They can practise vocabulary and answer structures independently, but live feedback is valuable for pronunciation, spontaneous responses, and confidence.",
        },
        {
          question: "What should private candidates check for speaking?",
          answer:
            "They should confirm with the exam centre how speaking will be arranged, who conducts it, what deadlines apply, and what preparation is expected.",
        },
      ]}
      ctaTitle="Build speaking confidence before exam season."
      ctaDescription="Trial access lets students inspect the course route, then online support can be added when correction, fluency, and accountability matter."
    />
  );
}

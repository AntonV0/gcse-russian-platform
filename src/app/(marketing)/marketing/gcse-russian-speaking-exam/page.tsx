import type { Metadata } from "next";
import EvergreenGuidePage from "@/components/marketing/evergreen-guide-page";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Speaking Exam Guide",
  description:
    "Prepare for the GCSE Russian speaking exam with guidance on role play, picture-based tasks, conversation, pronunciation, and teacher-supported practice.",
  path: "/marketing/gcse-russian-speaking-exam",
});

export default function GcseRussianSpeakingExamPage() {
  return (
    <EvergreenGuidePage
      eyebrow="Paper 2: Speaking"
      title="GCSE Russian speaking exam guide"
      description="Speaking preparation needs confidence, accuracy, pronunciation, and the ability to respond naturally. It is one of the strongest reasons to combine platform study with teacher support."
      path="/marketing/gcse-russian-speaking-exam"
      keywords={["GCSE Russian speaking", "Paper 2 speaking", "Russian speaking exam"]}
      badges={[
        { label: "Paper 2", icon: "speaking", tone: "info" },
        { label: "Role play and conversation", icon: "chat" },
        { label: "Teacher feedback useful", icon: "school", tone: "success" },
      ]}
      sections={[
        {
          title: "What speaking preparation should include",
          description:
            "Students need both prepared language and flexible response habits for the unpredictable parts of speaking.",
          items: [
            {
              title: "Role play practice",
              description:
                "Students should practise concise answers, questions, requests, and unexpected prompts.",
            },
            {
              title: "Picture-based answers",
              description:
                "Photo description works best when students have reusable structures for people, actions, opinions, and reasons.",
            },
            {
              title: "Conversation confidence",
              description:
                "Students need to expand answers, justify opinions, repair mistakes, and respond without memorising every sentence.",
            },
          ],
        },
        {
          title: "Where live support helps",
          description:
            "Speaking can be practised independently, but correction and confidence often grow faster with a teacher.",
          items: [
            {
              title: "Pronunciation",
              description:
                "A teacher can catch sound patterns, stress, and clarity issues that students may not notice alone.",
            },
            {
              title: "Spontaneous response",
              description:
                "Live questioning helps students move beyond memorised paragraphs into real exam readiness.",
            },
            {
              title: "Exam technique",
              description:
                "Feedback can help students answer what was asked and use the best language they already know.",
            },
          ],
        },
      ]}
      relatedLinks={[
        {
          title: "Online GCSE Russian lessons",
          description: "Explore teacher-supported speaking and writing preparation.",
          href: "/marketing/online-gcse-russian-lessons",
          icon: "school",
        },
        {
          title: "Russian GCSE private candidate guide",
          description: "Plan speaking preparation outside a school timetable.",
          href: "/marketing/russian-gcse-private-candidate",
          icon: "userCheck",
        },
        {
          title: "GCSE Russian writing exam guide",
          description: "Pair speaking confidence with stronger written accuracy.",
          href: "/marketing/gcse-russian-writing-exam",
          icon: "write",
        },
      ]}
      ctaTitle="Build speaking confidence before exam season"
      ctaDescription="Use trial access to explore the platform, then add live teaching support when the student needs correction, fluency, and accountability."
      ctaSecondaryHref="/marketing/online-gcse-russian-lessons"
      ctaSecondaryLabel="Online lessons"
    />
  );
}

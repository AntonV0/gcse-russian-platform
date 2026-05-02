import type { Metadata } from "next";
import StudyGuidePage from "@/components/marketing/study-guide-page";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Higher Tier Guide",
  description:
    "A GCSE Russian Higher tier guide for Pearson Edexcel 1RU0 students, covering complex language, accuracy, exam technique, and revision planning.",
  path: "/gcse-russian-higher-tier",
  ogTitle: "GCSE Russian Higher Tier Guide",
  ogDescription:
    "Prepare for GCSE Russian Higher tier with wider vocabulary, grammar accuracy, translation, and developed answers.",
  ogImagePath: getOgImagePath("higher"),
  ogImageAlt: "GCSE Russian Higher tier guide",
});

export default function GcseRussianHigherTierPage() {
  return (
    <StudyGuidePage
      path="/gcse-russian-higher-tier"
      eyebrow="Higher tier"
      title="Build range without losing accuracy."
      description="Higher tier preparation should help students handle wider vocabulary, more complex grammar, less predictable tasks, and developed answers while staying controlled."
      keywords={[
        "GCSE Russian Higher tier",
        "Russian GCSE Higher",
        "Edexcel Russian Higher tier",
      ]}
      badges={[
        { label: "Higher tier", icon: "star", tone: "info" },
        { label: "Complex language", icon: "grammar" },
        { label: "Exam technique", icon: "exam" },
      ]}
      heroIcon="star"
      heroLabel="Higher route"
      heroMetric="Range, accuracy, control"
      heroRows={[
        ["Vocabulary", "Wider and less predictable language", "vocabulary"],
        ["Grammar", "More control across tenses and structures", "grammar"],
        ["Output", "Developed speaking and writing answers", "write"],
      ]}
      focusTitle="Higher preparation moves beyond recognition into flexible production."
      focusDescription="Students need to understand harder language, but also use Russian accurately when the task changes."
      focusItems={[
        {
          title: "Wider vocabulary range",
          description:
            "Students should recognise less predictable language and choose precise vocabulary in speaking and writing.",
          icon: "vocabulary",
        },
        {
          title: "Secure grammar control",
          description:
            "Higher answers benefit from tense control, cases, connectives, comparisons, opinions, and varied sentence patterns.",
          icon: "grammar",
        },
        {
          title: "Extended response planning",
          description:
            "Students need reasons, examples, time frames, opinions, and clear structure under exam conditions.",
          icon: "write",
        },
      ]}
      routineTitle="Higher progress comes from targeted correction."
      routineDescription="Students should not simply do harder tasks; they need to know which accuracy patterns, vocabulary gaps, or paper habits are holding them back."
      routineItems={[
        {
          title: "Translate both ways",
          description:
            "Translation reveals gaps in grammar, word order, spelling, and meaning more clearly than recognition tasks alone.",
          icon: "translation",
        },
        {
          title: "Adapt model answers",
          description:
            "Model language can build range, but students must adapt it actively rather than memorise fixed paragraphs.",
          icon: "edit",
        },
        {
          title: "Track accuracy patterns",
          description:
            "Repeated errors in endings, tense, agreement, and spelling should become revision targets.",
          icon: "search",
        },
        {
          title: "Practise under pressure",
          description:
            "Higher students need timed practice so ambition remains controlled in exam conditions.",
          icon: "pending",
        },
      ]}
      warningTitle="Higher tier can punish ambition without control."
      warningDescription="More advanced language helps only when the sentence still answers the task accurately."
      warningItems={[
        {
          title: "Memorising impressive paragraphs",
          description:
            "Prepared language can fall apart when the prompt changes or the bullet points do not match.",
          icon: "warning",
        },
        {
          title: "Ignoring repeated small errors",
          description:
            "Endings, tense, spelling, and agreement errors can undermine otherwise strong answers.",
          icon: "grammar",
        },
        {
          title: "Only practising strong skills",
          description:
            "A strong reader may still need speaking, writing, translation, or listening work.",
          icon: "exam",
        },
      ]}
      courseFitTitle="The course can stretch students while keeping the route visible."
      courseFitDescription="Higher students need challenge, but challenge should be organised so weak points are repaired rather than hidden."
      courseFitItems={[
        {
          title: "Advanced pathway",
          description:
            "Higher content can introduce wider vocabulary, richer grammar, and harder paper practice.",
          icon: "star",
        },
        {
          title: "Exam transfer",
          description:
            "The same language should support listening, reading, speaking, writing, and translation.",
          icon: "exam",
        },
        {
          title: "Mistake review",
          description:
            "Recurring weak points can feed back into targeted revision and practice.",
          icon: "completed",
        },
      ]}
      relatedLinks={[
        {
          title: "GCSE Russian Foundation tier",
          description: "Compare Higher with the core-confidence route.",
          href: "/gcse-russian-foundation-tier",
          icon: "layers",
        },
        {
          title: "GCSE Russian writing exam",
          description: "Plan longer Higher tier written responses.",
          href: "/gcse-russian-writing-exam",
          icon: "write",
        },
        {
          title: "GCSE Russian speaking exam",
          description: "Prepare more developed spoken answers.",
          href: "/gcse-russian-speaking-exam",
          icon: "speaking",
        },
        {
          title: "GCSE Russian grammar guide",
          description: "Strengthen grammar that lifts Higher responses.",
          href: "/gcse-russian-grammar",
          icon: "grammar",
        },
      ]}
      faqs={[
        {
          question: "Who should consider Higher tier GCSE Russian?",
          answer:
            "Higher is usually best for students who can handle wider vocabulary, more complex grammar, longer answers, and less predictable exam language.",
        },
        {
          question: "What makes Higher tier preparation different?",
          answer:
            "Higher preparation needs more flexible language production, stronger translation accuracy, extended speaking and writing, and precise review of recurring errors.",
        },
        {
          question: "Should Higher students memorise model answers?",
          answer:
            "Model answers can help with range, but students should adapt language actively. Fixed memorisation can fall apart when the prompt changes.",
        },
      ]}
      ctaTitle="Prepare for Higher tier with structure."
      ctaDescription="Use the course platform to connect grammar, vocabulary, exam practice, and progress tracking across the full GCSE Russian course."
      secondaryHref="/gcse-russian-foundation-tier"
      secondaryLabel="Foundation guide"
    />
  );
}

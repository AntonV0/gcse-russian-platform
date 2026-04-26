import type { Metadata } from "next";
import EvergreenGuidePage from "@/components/marketing/evergreen-guide-page";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Tutor and Course Guide",
  description:
    "Compare GCSE Russian tutors, online lessons, and structured course access for Pearson Edexcel 1RU0 preparation.",
  path: "/gcse-russian-tutor",
});

export default function GcseRussianTutorPage() {
  return (
    <EvergreenGuidePage
      eyebrow="Tutor comparison"
      title="GCSE Russian tutor or online course?"
      description="Families often compare a GCSE Russian tutor, online classes, and a structured course platform. The best choice depends on the student's confidence, independence, and exam goals."
      path="/gcse-russian-tutor"
      keywords={[
        "GCSE Russian tutor",
        "Russian GCSE tutor",
        "online Russian lessons GCSE",
      ]}
      badges={[
        { label: "Tutor search", icon: "school", tone: "info" },
        { label: "Online lessons", icon: "speaking" },
        { label: "Course platform", icon: "courses" },
      ]}
      sections={[
        {
          title: "When a tutor is useful",
          description:
            "A tutor can add explanation, feedback, and accountability, especially for productive skills.",
          items: [
            {
              title: "Speaking practice",
              description:
                "A teacher can correct pronunciation, prompt longer answers, and help students practise role play, picture tasks, and conversation.",
            },
            {
              title: "Writing feedback",
              description:
                "Written Russian benefits from correction on endings, tense, word choice, spelling, and sentence structure.",
            },
            {
              title: "Confidence and routine",
              description:
                "Some students revise better when a lesson gives them a weekly rhythm and a clear next step.",
            },
          ],
        },
        {
          title: "When a course platform helps",
          description:
            "A structured platform can make independent study more organised and give tutors better material to build from.",
          items: [
            {
              title: "Clear learning sequence",
              description:
                "Students can follow lessons, vocabulary, grammar, and exam practice in a planned order rather than starting from random resources.",
            },
            {
              title: "Practice between lessons",
              description:
                "A weekly tutor session works better when students also practise vocabulary, grammar, and exam tasks during the week.",
            },
            {
              title: "Progress visibility",
              description:
                "Course access can help families see what has been covered and where the student still needs support.",
            },
          ],
        },
      ]}
      relatedLinks={[
        {
          title: "Online GCSE Russian lessons",
          description: "See how teacher-supported lessons can fit alongside the platform.",
          href: "/online-gcse-russian-lessons",
          icon: "school",
        },
        {
          title: "Online GCSE Russian course",
          description: "Review the structured course route before choosing support.",
          href: "/gcse-russian-course",
          icon: "courses",
        },
        {
          title: "GCSE Russian for parents",
          description: "Understand what families should check before committing.",
          href: "/gcse-russian-for-parents",
          icon: "users",
        },
      ]}
      ctaTitle="Compare support with a trial account"
      ctaDescription="Start by seeing the course structure, then decide whether self-study, online lessons, or a blended route is the best fit."
      ctaSecondaryHref="/online-gcse-russian-lessons"
      ctaSecondaryLabel="Online lessons"
    />
  );
}

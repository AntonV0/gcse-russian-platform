import type { Metadata } from "next";
import EvergreenGuidePage from "@/components/marketing/evergreen-guide-page";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Vocabulary Guide",
  description:
    "A practical GCSE Russian vocabulary guide for Edexcel 1RU0 students, covering themes, tiers, active recall, receptive vocabulary, and exam preparation.",
  path: "/gcse-russian-vocabulary",
});

export default function GcseRussianVocabularyPage() {
  return (
    <EvergreenGuidePage
      eyebrow="GCSE Russian vocabulary"
      title="GCSE Russian vocabulary guide"
      description="Vocabulary revision works best when students know which words they need to recognise, which they need to produce, and how vocabulary connects to exam tasks."
      path="/gcse-russian-vocabulary"
      keywords={["GCSE Russian vocabulary", "Edexcel Russian vocabulary", "Russian GCSE word list"]}
      badges={[
        { label: "Vocabulary revision", icon: "vocabulary", tone: "info" },
        { label: "Themes and topics", icon: "vocabularySet" },
        { label: "Foundation and Higher", icon: "layers" },
      ]}
      sections={[
        {
          title: "How to organise GCSE Russian vocabulary",
          description:
            "Students should not treat vocabulary as one huge list. Grouping by theme, tier, and use makes revision more effective.",
          items: [
            {
              title: "Theme-based learning",
              description:
                "Topic groups help students predict the language they will meet in reading, listening, speaking, and writing.",
            },
            {
              title: "Productive vocabulary",
              description:
                "Words needed for speaking and writing require active recall, spelling, and confident use in sentences.",
            },
            {
              title: "Receptive vocabulary",
              description:
                "Some words mainly need recognition in listening and reading, so revision can focus on meaning and context.",
            },
          ],
        },
        {
          title: "How the platform can help",
          description:
            "The public site can explain the vocabulary strategy. The app can organise sets, examples, and revision flow.",
          items: [
            {
              title: "Vocabulary sets",
              description:
                "Sets can group Russian, English, transliteration, examples, notes, and tier metadata in one place.",
            },
            {
              title: "Grammar links",
              description:
                "Vocabulary becomes more useful when students understand forms, endings, and sentence patterns.",
            },
            {
              title: "Exam-linked use",
              description:
                "Students should revise vocabulary with the skill they need: listening, reading, speaking, or writing.",
            },
          ],
        },
      ]}
      relatedLinks={[
        {
          title: "GCSE Russian listening exam guide",
          description: "Use vocabulary recognition to improve audio comprehension.",
          href: "/gcse-russian-listening-exam",
          icon: "listening",
        },
        {
          title: "GCSE Russian grammar guide",
          description: "Connect word learning to sentence control.",
          href: "/gcse-russian-grammar",
          icon: "grammar",
        },
        {
          title: "GCSE Russian past papers",
          description: "Use past papers to find vocabulary gaps before the exam.",
          href: "/gcse-russian-past-papers",
          icon: "pastPapers",
        },
      ]}
      ctaTitle="Move from word lists to active revision"
      ctaDescription="Start with trial access and use the platform to revise GCSE Russian vocabulary with structure and purpose."
    />
  );
}

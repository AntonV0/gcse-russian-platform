import type { Metadata } from "next";
import EvergreenGuidePage from "@/components/marketing/evergreen-guide-page";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Higher Tier Guide",
  description:
    "A GCSE Russian Higher tier guide for Pearson Edexcel 1RU0 students, covering complex language, accuracy, exam technique, and revision planning.",
  path: "/gcse-russian-higher-tier",
});

export default function GcseRussianHigherTierPage() {
  return (
    <EvergreenGuidePage
      eyebrow="Higher tier"
      title="GCSE Russian Higher tier guide"
      description="Higher tier students need range, accuracy, and flexibility. Strong preparation connects grammar, vocabulary, opinions, translation, and extended answers."
      path="/gcse-russian-higher-tier"
      keywords={[
        "GCSE Russian Higher tier",
        "Russian GCSE Higher",
        "Edexcel Russian Higher tier",
      ]}
      badges={[
        { label: "Higher tier", icon: "layers", tone: "info" },
        { label: "Complex language", icon: "grammar" },
        { label: "Exam technique", icon: "exam" },
      ]}
      sections={[
        {
          title: "Higher tier priorities",
          description:
            "Higher preparation should move students beyond recognition into flexible language production.",
          items: [
            {
              title: "Wider vocabulary range",
              description:
                "Students should recognise less predictable language and be able to choose precise vocabulary in speaking and writing.",
            },
            {
              title: "Secure grammar control",
              description:
                "Higher answers benefit from accurate tense use, case control, connectives, comparisons, opinions, and more varied sentence patterns.",
            },
            {
              title: "Extended response planning",
              description:
                "Students need to develop answers with reasons, examples, time frames, opinions, and clear structure under exam conditions.",
            },
          ],
        },
        {
          title: "How to raise Higher tier performance",
          description:
            "Higher students often need targeted correction, timed practice, and careful review of recurring weak points.",
          items: [
            {
              title: "Practise translation both ways",
              description:
                "Translation reveals gaps in grammar, word order, spelling, and meaning more clearly than recognition tasks alone.",
            },
            {
              title: "Use model answers carefully",
              description:
                "Model answers can build range, but students should adapt language actively rather than memorising fixed paragraphs.",
            },
            {
              title: "Track accuracy patterns",
              description:
                "Repeated errors in endings, tense, agreement, and spelling should become revision targets, not one-off corrections.",
            },
          ],
        },
      ]}
      relatedLinks={[
        {
          title: "GCSE Russian writing exam guide",
          description: "Plan longer Higher tier writing responses with accuracy.",
          href: "/gcse-russian-writing-exam",
          icon: "write",
        },
        {
          title: "GCSE Russian speaking exam guide",
          description: "Prepare more developed speaking answers.",
          href: "/gcse-russian-speaking-exam",
          icon: "speaking",
        },
        {
          title: "GCSE Russian grammar guide",
          description: "Strengthen grammar that lifts Higher tier responses.",
          href: "/gcse-russian-grammar",
          icon: "grammar",
        },
      ]}
      ctaTitle="Prepare for Higher tier with structure"
      ctaDescription="Use the course platform to connect grammar, vocabulary, exam practice, and progress tracking across the full GCSE Russian course."
    />
  );
}

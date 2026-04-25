import type { Metadata } from "next";
import EvergreenGuidePage from "@/components/marketing/evergreen-guide-page";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Past Papers",
  description:
    "Use GCSE Russian past papers effectively with guidance on official Pearson resources, paper-by-paper revision, mock practice, and structured course preparation.",
  path: "/marketing/gcse-russian-past-papers",
});

export default function GcseRussianPastPapersPage() {
  return (
    <EvergreenGuidePage
      eyebrow="GCSE Russian past papers"
      title="GCSE Russian past papers and revision strategy"
      description="Past papers are useful, but they work best when students know how to review mistakes, connect gaps to lessons, and practise before using full exam papers."
      badges={[
        { label: "Official resources", icon: "pastPapers", tone: "info" },
        { label: "Pearson Edexcel 1RU0", icon: "school" },
        { label: "Mocks and review", icon: "mockExam" },
      ]}
      sections={[
        {
          title: "How to use past papers well",
          description:
            "A past paper is not just a test score. It should reveal exactly what the student needs to revise next.",
          items: [
            {
              title: "Start with the right paper",
              description:
                "Choose listening, speaking, reading, or writing practice according to the skill you want to diagnose.",
            },
            {
              title: "Review mistakes by cause",
              description:
                "A wrong answer may come from vocabulary, grammar, timing, question interpretation, or exam technique.",
            },
            {
              title: "Do not use papers too early",
              description:
                "Students often benefit from topic practice and guided tasks before sitting a full paper.",
            },
          ],
        },
        {
          title: "Where the platform fits",
          description:
            "Public pages can link to official resources. The app can support mock exams, attempts, review, and next-step practice.",
          items: [
            {
              title: "Official Pearson links",
              description:
                "Public pages should direct students to official source material rather than duplicating copyrighted exam files.",
            },
            {
              title: "Original mock practice",
              description:
                "The app can provide platform-created GCSE-style mocks that sit separately from official past papers.",
            },
            {
              title: "Targeted follow-up",
              description:
                "After a paper, students need to return to vocabulary, grammar, and lesson practice instead of only doing another paper.",
            },
          ],
        },
      ]}
      relatedLinks={[
        {
          title: "GCSE Russian exam guide",
          description: "Understand the four papers before choosing practice resources.",
          href: "/marketing/gcse-russian-exam-guide",
          icon: "exam",
        },
        {
          title: "GCSE Russian reading exam guide",
          description: "Use Paper 3 resources to practise comprehension and translation.",
          href: "/marketing/gcse-russian-reading-exam",
          icon: "lessonContent",
        },
        {
          title: "GCSE Russian writing exam guide",
          description: "Prepare for writing tasks before attempting full papers.",
          href: "/marketing/gcse-russian-writing-exam",
          icon: "write",
        },
      ]}
      ctaTitle="Use papers as diagnosis, not just revision"
      ctaDescription="Start with trial access and use the app to turn past-paper weaknesses into targeted GCSE Russian practice."
    />
  );
}

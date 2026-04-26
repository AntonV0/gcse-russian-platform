import type { Metadata } from "next";
import EvergreenGuidePage from "@/components/marketing/evergreen-guide-page";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Past Papers",
  description:
    "Use GCSE Russian past papers effectively with guidance on official Pearson resources, paper-by-paper revision, mock practice, and structured course preparation.",
  path: "/gcse-russian-past-papers",
  ogTitle: "GCSE Russian Past Papers",
  ogDescription:
    "Use official Pearson materials, mocks, mark schemes, and mistake review more effectively.",
  ogImagePath: getOgImagePath("past-papers"),
  ogImageAlt: "GCSE Russian past papers and revision strategy",
});

export default function GcseRussianPastPapersPage() {
  return (
    <EvergreenGuidePage
      eyebrow="GCSE Russian past papers"
      title="GCSE Russian past papers and revision strategy"
      description="Past papers are useful, but they work best when students know how to review mistakes, connect gaps to lessons, and practise before using full exam papers."
      path="/gcse-russian-past-papers"
      keywords={[
        "GCSE Russian past papers",
        "Edexcel Russian past papers",
        "Russian GCSE revision",
      ]}
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
        {
          title: "Past-paper review checklist",
          description:
            "The review after a paper is where most of the learning happens. Students should leave with a specific next action.",
          items: [
            {
              title: "Separate skill gaps from knowledge gaps",
              description:
                "A student may know the Russian but lose marks through timing, task interpretation, spelling, or incomplete answers.",
            },
            {
              title: "Track recurring vocabulary",
              description:
                "Add repeated unknown words, cognates, distractors, and topic phrases to the next revision cycle.",
            },
            {
              title: "Revisit grammar errors",
              description:
                "Writing and translation mistakes often point back to tense, case, agreement, word order, or verb forms.",
            },
            {
              title: "Practise one paper at a time",
              description:
                "Listening, speaking, reading, and writing papers test different habits, so full-paper practice should be targeted.",
            },
            {
              title: "Use official source material",
              description:
                "Use Pearson's qualification materials for official papers and mark schemes, and keep platform-created mocks separate.",
            },
            {
              title: "Repeat the weak task type",
              description:
                "After reviewing a paper, practise the weakest task type before attempting another complete paper.",
            },
          ],
        },
      ]}
      relatedLinks={[
        {
          title: "GCSE Russian exam guide",
          description: "Understand the four papers before choosing practice resources.",
          href: "/gcse-russian-exam-guide",
          icon: "exam",
        },
        {
          title: "GCSE Russian reading exam guide",
          description: "Use Paper 3 resources to practise comprehension and translation.",
          href: "/gcse-russian-reading-exam",
          icon: "lessonContent",
        },
        {
          title: "GCSE Russian writing exam guide",
          description: "Prepare for writing tasks before attempting full papers.",
          href: "/gcse-russian-writing-exam",
          icon: "write",
        },
        {
          title: "Official Pearson GCSE Russian materials",
          description:
            "Use Pearson's page for official papers, mark schemes, and audio files.",
          href: "https://qualifications.pearson.com/en/qualifications/edexcel-gcses/russian-2017.coursematerials.html",
          icon: "pastPapers",
        },
      ]}
      faqs={[
        {
          question: "Where should students find official GCSE Russian past papers?",
          answer:
            "Use Pearson's official GCSE Russian qualification materials so papers, mark schemes, and audio files come from the awarding body.",
        },
        {
          question: "Should students do a full past paper every week?",
          answer:
            "Not necessarily. Full papers are useful checkpoints, but most weeks should include targeted practice on the specific skill or task type that needs work.",
        },
        {
          question: "How should students review a low past-paper score?",
          answer:
            "Break the score down by cause: vocabulary, grammar, timing, listening speed, question interpretation, translation accuracy, or writing range.",
        },
        {
          question: "Can platform mock exams replace official past papers?",
          answer:
            "No. Platform-created mocks can build skill and confidence, but official Pearson papers remain the best source for real exam format and mark schemes.",
        },
      ]}
      ctaTitle="Use papers as diagnosis, not just revision"
      ctaDescription="Start with trial access and use the app to turn past-paper weaknesses into targeted GCSE Russian practice."
    />
  );
}

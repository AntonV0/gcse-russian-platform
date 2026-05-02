import type { Metadata } from "next";
import StudyGuidePage from "@/components/marketing/study-guide-page";
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
    <StudyGuidePage
      path="/gcse-russian-past-papers"
      eyebrow="GCSE Russian past papers"
      title="Use past papers as diagnosis, not just a score."
      description="GCSE Russian past papers are useful when students know how to review mistakes, connect gaps to lessons, and practise before attempting another full paper."
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
      heroIcon="pastPapers"
      heroLabel="Paper practice"
      heroMetric="Attempt, review, target"
      heroRows={[
        ["Official papers", "Use Pearson source materials", "externalLink"],
        ["Mock practice", "Keep platform-created mocks separate", "mockExam"],
        ["Follow-up", "Return to the weak skill", "completed"],
      ]}
      focusTitle="A paper should reveal the next revision action."
      focusDescription="The score matters less than the reason marks were lost. Vocabulary, grammar, timing, question interpretation, and technique all need different follow-up."
      focusItems={[
        {
          title: "Start with the right paper",
          description:
            "Choose listening, speaking, reading, or writing according to the skill you want to diagnose.",
          icon: "exam",
        },
        {
          title: "Review mistakes by cause",
          description:
            "A wrong answer may come from vocabulary, grammar, timing, question interpretation, or technique.",
          icon: "search",
        },
        {
          title: "Avoid papers too early",
          description:
            "Students often benefit from topic practice and guided tasks before sitting a full paper.",
          icon: "warning",
        },
      ]}
      routineTitle="The review after a paper is where most learning happens."
      routineDescription="Students should finish a paper with a short, specific action list rather than only a percentage or mark."
      routineItems={[
        {
          title: "Mark the paper",
          description:
            "Use official mark schemes where available and avoid guessing why marks were lost.",
          icon: "marked",
        },
        {
          title: "Name the gap",
          description:
            "Separate skill gaps from knowledge gaps: timing, vocabulary, grammar, task reading, or answer quality.",
          icon: "search",
        },
        {
          title: "Practise the weak task",
          description:
            "Repeat the weakest task type before attempting another complete paper.",
          icon: "questionSet",
        },
        {
          title: "Return to lessons",
          description:
            "Use course content to repair the vocabulary or grammar behind repeated mistakes.",
          icon: "lessons",
        },
      ]}
      warningTitle="More papers do not automatically mean better preparation."
      warningDescription="Full papers can expose weak points, but targeted follow-up is what turns that exposure into progress."
      warningItems={[
        {
          title: "Chasing scores",
          description:
            "A score without mistake review does not tell the student what to change next.",
          icon: "warning",
        },
        {
          title: "Mixing official and mock materials",
          description:
            "Official Pearson papers and platform-created mocks should be clearly separated.",
          icon: "pastPapers",
        },
        {
          title: "Ignoring the paper difference",
          description:
            "Listening, speaking, reading, and writing test different habits, so practice should be targeted.",
          icon: "exam",
        },
      ]}
      courseFitTitle="The platform can turn paper weaknesses into targeted practice."
      courseFitDescription="Public pages can point families to official resources. The app can organise mock practice, attempts, review, and next-step learning."
      courseFitItems={[
        {
          title: "Official links",
          description:
            "Students should use Pearson’s source material for official papers, mark schemes, and audio.",
          icon: "externalLink",
        },
        {
          title: "Mock practice",
          description:
            "Platform-created GCSE-style mocks can build skill without replacing official papers.",
          icon: "mockExam",
        },
        {
          title: "Targeted follow-up",
          description:
            "After a paper, students can return to vocabulary, grammar, or lesson practice.",
          icon: "completed",
        },
      ]}
      relatedLinks={[
        {
          title: "GCSE Russian exam guide",
          description: "Understand the four papers before choosing resources.",
          href: "/gcse-russian-exam-guide",
          icon: "exam",
        },
        {
          title: "GCSE Russian revision guide",
          description: "Put papers into a weekly revision cycle.",
          href: "/gcse-russian-revision",
          icon: "calendar",
        },
        {
          title: "GCSE Russian reading exam",
          description: "Use Paper 3 resources for comprehension and translation.",
          href: "/gcse-russian-reading-exam",
          icon: "lessonContent",
        },
        {
          title: "Official Pearson GCSE Russian materials",
          description:
            "Use Pearson's page for official papers, mark schemes, and audio files.",
          href: "https://qualifications.pearson.com/en/qualifications/edexcel-gcses/russian-2017.coursematerials.html",
          icon: "externalLink",
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
          question: "Can platform mock exams replace official past papers?",
          answer:
            "No. Platform-created mocks can build skill and confidence, but official Pearson papers remain the best source for real exam format and mark schemes.",
        },
      ]}
      ctaTitle="Use papers to find the next useful practice."
      ctaDescription="Start with trial access and use the app to turn past-paper weaknesses into targeted GCSE Russian practice."
      secondaryHref="/gcse-russian-revision"
      secondaryLabel="Revision guide"
    />
  );
}

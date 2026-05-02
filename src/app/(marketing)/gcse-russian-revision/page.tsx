import type { Metadata } from "next";
import StudyGuidePage from "@/components/marketing/study-guide-page";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Revision Guide",
  description:
    "A practical GCSE Russian revision guide for Pearson Edexcel 1RU0 students, covering planning, vocabulary, grammar, past papers, and exam skills.",
  path: "/gcse-russian-revision",
  ogTitle: "GCSE Russian Revision Guide",
  ogDescription:
    "Build a weekly GCSE Russian revision plan across vocabulary, grammar, exam papers, and review.",
  ogImagePath: getOgImagePath("revision"),
  ogImageAlt: "GCSE Russian revision guide",
});

export default function GcseRussianRevisionPage() {
  return (
    <StudyGuidePage
      path="/gcse-russian-revision"
      eyebrow="GCSE Russian revision"
      title="Turn GCSE Russian revision into a weekly rhythm."
      description="Effective revision is not a pile of last-minute word lists. Students need a repeatable plan that combines vocabulary, grammar, paper skills, and mistake review."
      keywords={[
        "GCSE Russian revision",
        "Russian GCSE revision",
        "Edexcel Russian revision",
      ]}
      badges={[
        { label: "Revision planning", icon: "calendar", tone: "info" },
        { label: "Exam practice", icon: "exam" },
        { label: "Vocabulary and grammar", icon: "vocabulary" },
      ]}
      heroIcon="calendar"
      heroLabel="Weekly revision"
      heroMetric="Language, papers, review"
      heroRows={[
        ["Foundation", "Vocabulary and grammar that can be reused", "vocabulary"],
        ["Paper practice", "Listening, speaking, reading, writing", "exam"],
        ["Review", "Mistakes become the next action", "completed"],
      ]}
      focusTitle="A good revision plan balances exam papers with language foundations."
      focusDescription="Students often spend too long on either notes or full papers. The useful middle ground is targeted practice that tells them what to revise next."
      focusItems={[
        {
          title: "High-frequency vocabulary",
          description:
            "Themes, opinions, time phrases, question words, common verbs, and words that appear across several papers.",
          icon: "vocabulary",
        },
        {
          title: "Grammar that changes meaning",
          description:
            "Tense, cases, agreement, negatives, comparisons, and sentence structures that affect comprehension and output.",
          icon: "grammar",
        },
        {
          title: "Paper-specific technique",
          description:
            "Listening, speaking, reading, writing, and translation each need their own habits and review routine.",
          icon: "exam",
        },
      ]}
      routineTitle="Revision should repeat the same clear cycle."
      routineDescription="The exact topics can change, but the rhythm should stay familiar enough that students do not have to reinvent their plan every week."
      routineItems={[
        {
          title: "Vocabulary retrieval",
          description:
            "Review one theme, then test recall both ways: Russian to English and English to Russian.",
          icon: "vocabulary",
        },
        {
          title: "Grammar in sentences",
          description:
            "Practise one grammar point in short sentences before using it in translation or writing.",
          icon: "grammar",
        },
        {
          title: "One paper task",
          description:
            "Use listening, reading, speaking, or writing practice to turn knowledge into exam behaviour.",
          icon: "questionSet",
        },
        {
          title: "Mistake review",
          description:
            "Turn errors into a short action list instead of simply recording a score.",
          icon: "completed",
        },
      ]}
      warningTitle="Revision becomes weaker when it only looks productive."
      warningDescription="Open notes, colour-coded lists, and repeated full papers can feel reassuring while still avoiding the actual weak points."
      warningItems={[
        {
          title: "Rereading instead of retrieval",
          description:
            "Students need to recall Russian, produce answers, and check what is missing.",
          icon: "warning",
        },
        {
          title: "Doing papers without review",
          description:
            "Past papers help only when the student knows why marks were lost and what to practise next.",
          icon: "pastPapers",
        },
        {
          title: "Avoiding the hardest paper",
          description:
            "Speaking and writing often need earlier attention because confidence and accuracy take repetition.",
          icon: "speaking",
        },
      ]}
      courseFitTitle="The course turns revision topics into next steps."
      courseFitDescription="The platform can connect lessons, vocabulary, grammar, practice, and progress so revision feels less like guesswork."
      courseFitItems={[
        {
          title: "Guided lessons",
          description:
            "Students can revisit the topic or grammar point behind a weak answer.",
          icon: "lessonContent",
        },
        {
          title: "Practice surfaces",
          description:
            "Vocabulary, grammar, question sets, and mocks each have a clearer place.",
          icon: "surfaces",
        },
        {
          title: "Visible progress",
          description:
            "A revision plan is easier to keep when the next useful step remains visible.",
          icon: "completed",
        },
      ]}
      relatedLinks={[
        {
          title: "GCSE Russian past papers",
          description: "Use papers as diagnosis, not only as tests.",
          href: "/gcse-russian-past-papers",
          icon: "pastPapers",
        },
        {
          title: "GCSE Russian vocabulary guide",
          description: "Organise words by theme, tier, and exam use.",
          href: "/gcse-russian-vocabulary",
          icon: "vocabulary",
        },
        {
          title: "GCSE Russian grammar guide",
          description: "Prioritise grammar that changes meaning and output.",
          href: "/gcse-russian-grammar",
          icon: "grammar",
        },
        {
          title: "GCSE Russian exam guide",
          description: "Review how the four papers shape revision.",
          href: "/gcse-russian-exam-guide",
          icon: "exam",
        },
      ]}
      faqs={[
        {
          question: "How early should GCSE Russian revision start?",
          answer:
            "Students should start steady revision well before exam season because vocabulary, grammar, listening confidence, and speaking fluency need repeated practice.",
        },
        {
          question: "Should revision begin with past papers?",
          answer:
            "Not usually. Past papers are most useful after students have enough vocabulary and grammar to learn from the result rather than simply feel exposed by it.",
        },
        {
          question: "What should students revise every week?",
          answer:
            "A balanced week should include vocabulary retrieval, one grammar focus, one listening or reading task, one speaking or writing task, and mistake review.",
        },
      ]}
      ctaTitle="Turn revision into a visible plan."
      ctaDescription="Use the public guides to choose what matters, then use the course platform for structured lessons, practice, and progress tracking."
    />
  );
}

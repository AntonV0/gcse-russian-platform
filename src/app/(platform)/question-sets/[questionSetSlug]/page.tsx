import { notFound } from "next/navigation";
import QuestionSetBlock from "@/components/lesson-blocks/question-set-block";
import LearningSheet, {
  LearningSheetHeader,
  LearningSheetSection,
} from "@/components/ui/learning-sheet";
import { getQuestionSetBySlugDb } from "@/lib/questions/question-helpers-db";

type QuestionSetPageProps = {
  params: Promise<{
    questionSetSlug: string;
  }>;
};

export default async function QuestionSetPage({ params }: QuestionSetPageProps) {
  const { questionSetSlug } = await params;

  const questionSet = await getQuestionSetBySlugDb(questionSetSlug);

  if (!questionSet) {
    notFound();
  }

  return (
    <main data-workspace-kind="practice">
      <LearningSheet>
      <LearningSheetHeader
        eyebrow="Practice questions"
        title={questionSet.title}
        description={questionSet.description ?? undefined}
      />

      <LearningSheetSection>
        <QuestionSetBlock questionSetSlug={questionSetSlug} />
      </LearningSheetSection>
      </LearningSheet>
    </main>
  );
}

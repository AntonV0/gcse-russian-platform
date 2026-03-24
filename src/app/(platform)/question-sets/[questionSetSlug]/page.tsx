import PageHeader from "@/components/layout/page-header";
import QuestionSetBlock from "@/components/lesson-blocks/question-set-block";
import { getQuestionSetBySlugDb } from "@/lib/question-helpers-db";

type QuestionSetPageProps = {
  params: Promise<{
    questionSetSlug: string;
  }>;
};

export default async function QuestionSetPage({ params }: QuestionSetPageProps) {
  const { questionSetSlug } = await params;

  const questionSet = await getQuestionSetBySlugDb(questionSetSlug);

  if (!questionSet) {
    return <main>Question set not found.</main>;
  }

  return (
    <main>
      <PageHeader
        title={questionSet.title}
        description={questionSet.description ?? undefined}
      />

      <QuestionSetBlock questionSetSlug={questionSetSlug} />
    </main>
  );
}

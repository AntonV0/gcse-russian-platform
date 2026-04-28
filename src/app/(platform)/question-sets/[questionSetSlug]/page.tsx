import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import QuestionSetBlock from "@/components/lesson-blocks/question-set-block";
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
    <main className="space-y-4">
      <PageHeader
        title={questionSet.title}
        description={questionSet.description ?? undefined}
      />

      <QuestionSetBlock questionSetSlug={questionSetSlug} />
    </main>
  );
}

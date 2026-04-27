import { loadRuntimeQuestionSetBySlugDb } from "@/lib/questions/question-helpers-db";
import QuestionRenderer from "@/components/questions/question-renderer";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import { Heading, type HeadingLevel } from "@/components/ui/heading";

type QuestionSetBlockProps = {
  title?: string;
  questionSetSlug: string;
  lessonId?: string | null;
  headingLevel?: HeadingLevel;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default async function QuestionSetBlock({
  title,
  questionSetSlug,
  lessonId = null,
  headingLevel = 3,
}: QuestionSetBlockProps) {
  const { questionSet, questions } =
    await loadRuntimeQuestionSetBySlugDb(questionSetSlug);

  if (!questionSet) {
    return (
      <div className="rounded-xl border border-[color-mix(in_srgb,var(--danger)_24%,transparent)] bg-[var(--danger-soft)] p-4 text-sm text-[var(--danger)]">
        Question set not found: {questionSetSlug}
      </div>
    );
  }

  return (
    <section className="dev-marker-host relative app-card app-section-padding space-y-5">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="QuestionSetBlock"
          filePath="src/components/lesson-blocks/question-set-block.tsx"
          tier="semantic"
          componentRole="Lesson block that loads and renders a linked runtime question set"
          bestFor="Practice sections where saved GCSE Russian question sets need to appear inside lesson content."
          usageExamples={[
            "Lesson practice questions",
            "Listening/reading question set",
            "Grammar check exercise",
            "Past paper practice area",
          ]}
          notes="Use for linked question sets. Do not use for single hardcoded questions or admin question-set editing screens."
        />
      ) : null}

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <span className="app-pill app-pill-info">Question set</span>
          <span className="app-pill app-pill-muted">
            {questions.length} question{questions.length === 1 ? "" : "s"}
          </span>
        </div>

        {title ? (
          <Heading level={headingLevel} className="app-heading-subsection">
            {title}
          </Heading>
        ) : null}

        {questionSet.instructions ? (
          <p className="app-text-body-muted">{questionSet.instructions}</p>
        ) : null}
      </div>

      <div className="space-y-5">
        {questions.map((question, index) => (
          <div key={question.id} className="space-y-3">
            <div className="app-text-meta">Question {index + 1}</div>

            <QuestionRenderer question={question} lessonId={lessonId} />
          </div>
        ))}
      </div>
    </section>
  );
}

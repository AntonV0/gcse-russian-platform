import { insertLessonTemplateAction } from "@/app/actions/admin/admin-lesson-builder-actions";
import type {
  LessonBuilderTemplateOptions,
  RouteFields,
} from "@/components/admin/lesson-builder/lesson-builder-types";
import {
  BuilderHiddenFields,
  CompactDisclosure,
  PendingStatusText,
  PendingSubmitButton,
  BUILDER_DASHED_EMPTY_STATE_CLASS,
  BUILDER_SECONDARY_BUTTON_CLASS,
} from "@/components/admin/lesson-builder/lesson-builder-ui";

type LessonTemplateInserterProps = {
  routeFields: RouteFields;
  lessonTemplates: LessonBuilderTemplateOptions["lessonTemplates"];
};

export default function LessonTemplateInserter({
  routeFields,
  lessonTemplates,
}: LessonTemplateInserterProps) {
  return (
    <CompactDisclosure
      title={`Lesson templates (${lessonTemplates.length})`}
      description="Create several structured sections at once for faster lesson setup."
    >
      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {lessonTemplates.length === 0 ? (
          <div className={BUILDER_DASHED_EMPTY_STATE_CLASS}>
            No DB lesson templates found yet.
          </div>
        ) : (
          lessonTemplates.map((template) => (
            <form
              key={template.id}
              action={insertLessonTemplateAction}
              className="app-card p-4"
            >
              <BuilderHiddenFields {...routeFields} />
              <input type="hidden" name="templateId" value={template.id} />

              <div className="mb-3">
                <div className="font-semibold text-[var(--text-primary)]">
                  {template.label}
                </div>
                <div className="mt-1 text-sm app-text-muted">
                  {template.description}
                </div>
              </div>

              <div className="mb-3 text-xs app-text-soft">
                {template.sectionsCount} section
                {template.sectionsCount === 1 ? "" : "s"}
              </div>

              <div className="space-y-2">
                <PendingSubmitButton
                  idleLabel="Insert lesson template"
                  pendingLabel="Inserting lesson template..."
                  className={BUILDER_SECONDARY_BUTTON_CLASS}
                />
                <PendingStatusText pendingText="Creating sections and starter blocks..." />
              </div>
            </form>
          ))
        )}
      </div>
    </CompactDisclosure>
  );
}

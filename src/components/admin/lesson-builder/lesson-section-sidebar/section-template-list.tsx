"use client";

import { insertSectionTemplateAction } from "@/app/actions/admin/admin-lesson-builder-actions";
import type { RouteFields } from "@/components/admin/lesson-builder/lesson-builder-types";
import {
  BuilderHiddenFields,
  PendingStatusText,
  PendingSubmitButton,
  BUILDER_DASHED_EMPTY_STATE_CLASS,
} from "@/components/admin/lesson-builder/lesson-builder-ui";

type SectionTemplateOption = {
  id: string;
  label: string;
  description: string;
  defaultSectionTitle: string;
  defaultSectionKind: string;
  presetCount: number;
};

export function SectionTemplateList(props: {
  routeFields: RouteFields;
  sectionTemplateOptions: SectionTemplateOption[];
}) {
  if (props.sectionTemplateOptions.length === 0) {
    return (
      <div className={BUILDER_DASHED_EMPTY_STATE_CLASS}>
        No DB section templates found yet.
      </div>
    );
  }

  return (
    <>
      {props.sectionTemplateOptions.map((template) => (
        <form
          key={template.id}
          action={insertSectionTemplateAction}
          className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/45 p-4"
        >
          <BuilderHiddenFields {...props.routeFields} />
          <input type="hidden" name="templateId" value={template.id} />

          <div className="mb-2">
            <div className="font-semibold text-[var(--text-primary)]">
              {template.label}
            </div>
            <div className="text-sm app-text-muted">{template.description}</div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs app-text-soft">
              <span>{template.defaultSectionTitle}</span>
              <span>Â·</span>
              <span>{template.defaultSectionKind}</span>
              <span>Â·</span>
              <span>
                {template.presetCount} preset{template.presetCount === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <PendingSubmitButton
              idleLabel="Insert section template"
              pendingLabel="Inserting section template..."
              className="w-full inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-2 text-sm font-medium text-[var(--text-primary)] shadow-[0_1px_2px_rgba(16,32,51,0.04)] transition-[background-color,border-color,box-shadow] hover:border-[var(--border-strong)] hover:bg-[var(--background-muted)] disabled:opacity-60"
            />
            <PendingStatusText pendingText="Creating the section and starter blocks..." />
          </div>
        </form>
      ))}
    </>
  );
}

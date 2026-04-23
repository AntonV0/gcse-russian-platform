"use client";

import {
  deleteBlockAction,
  deleteSectionAction,
  duplicateBlockAction,
  duplicateSectionAction,
  moveBlockAction,
  moveBlockToSectionAction,
  moveSectionAction,
  toggleBlockPublishedAction,
  toggleSectionPublishedAction,
} from "@/app/actions/admin/admin-lesson-builder-actions";
import { BlockEditPanel } from "@/components/admin/lesson-builder/block-editors";
import type {
  LessonBlock,
  LessonBuilderVocabularySetOption,
  LessonSection,
  RouteFields,
} from "@/components/admin/lesson-builder/lesson-builder-types";
import {
  Badge,
  BuilderHiddenFields,
  ConfirmSubmitButton,
  Panel,
  PendingStatusText,
  PendingSubmitButton,
  BUILDER_DASHED_EMPTY_STATE_CLASS,
  BUILDER_MUTED_INFO_BOX_CLASS,
  BUILDER_SECONDARY_BUTTON_CLASS,
  BUILDER_SELECT_CLASS,
} from "@/components/admin/lesson-builder/lesson-builder-ui";
import {
  getLessonBlockAccentClass,
  getLessonBlockGroupLabel,
  getLessonBlockLabel,
  getLessonBlockPreview,
} from "@/lib/lessons/lesson-blocks";

export default function LessonInspectorPanel(props: {
  section: LessonSection | null;
  block: LessonBlock | null;
  sections: LessonSection[];
  routeFields: RouteFields;
  sectionIndex: number;
  totalSections: number;
  blockIndex: number;
  vocabularySetOptions: LessonBuilderVocabularySetOption[];
}) {
  if (!props.section) {
    return (
      <Panel title="Inspector" description="Select a section to begin editing.">
        <div className={BUILDER_DASHED_EMPTY_STATE_CLASS}>No section selected yet.</div>
      </Panel>
    );
  }

  if (props.block) {
    return (
      <Panel title="Block inspector" description="Edit the selected block.">
        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/45 p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${getLessonBlockAccentClass(
                  props.block.block_type
                )}`}
              >
                {getLessonBlockGroupLabel(props.block.block_type)}
              </span>

              <span className="font-semibold text-[var(--text-primary)]">
                {getLessonBlockLabel(props.block.block_type)}
              </span>

              <Badge tone={props.block.is_published ? "success" : "warning"}>
                {props.block.is_published ? "Published" : "Draft"}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-[var(--text-primary)]">Position:</span>{" "}
                <span className="app-text-muted">{props.block.position}</span>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-3 break-words app-text-muted">
                {getLessonBlockPreview(props.block)}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/35 p-3">
            <BlockEditPanel
              block={props.block}
              routeFields={props.routeFields}
              vocabularySetOptions={props.vocabularySetOptions}
            />
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-3">
            <div className="mb-2 text-sm font-semibold text-[var(--text-primary)]">
              Move to another section
            </div>

            <form action={moveBlockToSectionAction} className="space-y-2">
              <BuilderHiddenFields {...props.routeFields} />
              <input type="hidden" name="blockId" value={props.block.id} />
              <input type="hidden" name="sourceSectionId" value={props.section.id} />

              <select
                name="targetSectionId"
                defaultValue=""
                className={BUILDER_SELECT_CLASS}
              >
                <option value="" disabled>
                  Select target section
                </option>
                {props.sections
                  .filter((section) => section.id !== props.section?.id)
                  .map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.position}. {section.title}
                    </option>
                  ))}
              </select>

              <div className="space-y-2">
                <PendingSubmitButton
                  idleLabel="Move block to section"
                  pendingLabel="Moving block..."
                  className={`w-full ${BUILDER_SECONDARY_BUTTON_CLASS}`}
                />
                <PendingStatusText pendingText="Moving block and reordering sections..." />
              </div>
            </form>
          </div>

          <div className="grid gap-2">
            <form action={moveBlockAction}>
              <BuilderHiddenFields {...props.routeFields} />
              <input type="hidden" name="sectionId" value={props.section.id} />
              <input type="hidden" name="blockId" value={props.block.id} />
              <input type="hidden" name="direction" value="up" />
              <button
                type="submit"
                disabled={props.blockIndex === 0}
                className={`w-full ${BUILDER_SECONDARY_BUTTON_CLASS}`}
              >
                Move block up
              </button>
            </form>

            <form action={moveBlockAction}>
              <BuilderHiddenFields {...props.routeFields} />
              <input type="hidden" name="sectionId" value={props.section.id} />
              <input type="hidden" name="blockId" value={props.block.id} />
              <input type="hidden" name="direction" value="down" />
              <button
                type="submit"
                disabled={props.blockIndex === props.section.blocks.length - 1}
                className={`w-full ${BUILDER_SECONDARY_BUTTON_CLASS}`}
              >
                Move block down
              </button>
            </form>

            <form action={duplicateBlockAction}>
              <BuilderHiddenFields {...props.routeFields} />
              <input type="hidden" name="sectionId" value={props.section.id} />
              <input type="hidden" name="blockId" value={props.block.id} />
              <button
                type="submit"
                className={`w-full ${BUILDER_SECONDARY_BUTTON_CLASS}`}
              >
                Duplicate block
              </button>
            </form>

            <form action={toggleBlockPublishedAction}>
              <BuilderHiddenFields {...props.routeFields} />
              <input type="hidden" name="blockId" value={props.block.id} />
              <input
                type="hidden"
                name="nextState"
                value={props.block.is_published ? "draft" : "published"}
              />
              <button
                type="submit"
                className={`w-full ${BUILDER_SECONDARY_BUTTON_CLASS}`}
              >
                {props.block.is_published ? "Unpublish block" : "Publish block"}
              </button>
            </form>

            <form action={deleteBlockAction}>
              <BuilderHiddenFields {...props.routeFields} />
              <input type="hidden" name="blockId" value={props.block.id} />
              <ConfirmSubmitButton
                confirmMessage={`Delete this ${getLessonBlockLabel(
                  props.block.block_type
                ).toLowerCase()} block?`}
                className="w-full rounded-xl border border-[rgba(194,59,59,0.28)] bg-[var(--danger-soft)] px-3 py-2 text-sm font-medium text-[var(--danger)] hover:border-[rgba(194,59,59,0.42)]"
              >
                Delete block
              </ConfirmSubmitButton>
            </form>
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <Panel
      title="Section inspector"
      description="Quick actions for the selected section."
    >
      <div className="space-y-4">
        <div className={BUILDER_MUTED_INFO_BOX_CLASS}>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-[var(--text-primary)]">Section:</span>{" "}
              <span className="app-text-muted">{props.section.title}</span>
            </div>
            <div>
              <span className="font-medium text-[var(--text-primary)]">Kind:</span>{" "}
              <span className="app-text-muted">{props.section.section_kind}</span>
            </div>
            <div>
              <span className="font-medium text-[var(--text-primary)]">Position:</span>{" "}
              <span className="app-text-muted">{props.section.position}</span>
            </div>
            <div>
              <span className="font-medium text-[var(--text-primary)]">Status:</span>{" "}
              <span className="app-text-muted">
                {props.section.is_published ? "Published" : "Draft"}
              </span>
            </div>
            <div>
              <span className="font-medium text-[var(--text-primary)]">Blocks:</span>{" "}
              <span className="app-text-muted">{props.section.blocks.length}</span>
            </div>
          </div>
        </div>

        <div className={BUILDER_DASHED_EMPTY_STATE_CLASS}>
          <div>Select a block in the center column to edit its content here.</div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`mt-3 ${BUILDER_SECONDARY_BUTTON_CLASS}`}
          >
            Back to top
          </button>
        </div>

        <div className="grid gap-2">
          <form action={moveSectionAction}>
            <BuilderHiddenFields {...props.routeFields} />
            <input type="hidden" name="sectionId" value={props.section.id} />
            <input type="hidden" name="direction" value="up" />
            <button
              type="submit"
              disabled={props.sectionIndex === 0}
              className={`w-full ${BUILDER_SECONDARY_BUTTON_CLASS}`}
            >
              Move section up
            </button>
          </form>

          <form action={moveSectionAction}>
            <BuilderHiddenFields {...props.routeFields} />
            <input type="hidden" name="sectionId" value={props.section.id} />
            <input type="hidden" name="direction" value="down" />
            <button
              type="submit"
              disabled={props.sectionIndex === props.totalSections - 1}
              className={`w-full ${BUILDER_SECONDARY_BUTTON_CLASS}`}
            >
              Move section down
            </button>
          </form>

          <form action={duplicateSectionAction}>
            <BuilderHiddenFields {...props.routeFields} />
            <input type="hidden" name="sectionId" value={props.section.id} />
            <button type="submit" className={`w-full ${BUILDER_SECONDARY_BUTTON_CLASS}`}>
              Duplicate section
            </button>
          </form>

          <form action={toggleSectionPublishedAction}>
            <BuilderHiddenFields {...props.routeFields} />
            <input type="hidden" name="sectionId" value={props.section.id} />
            <input
              type="hidden"
              name="nextState"
              value={props.section.is_published ? "draft" : "published"}
            />
            <button type="submit" className={`w-full ${BUILDER_SECONDARY_BUTTON_CLASS}`}>
              {props.section.is_published ? "Unpublish section" : "Publish section"}
            </button>
          </form>

          <form action={deleteSectionAction}>
            <BuilderHiddenFields {...props.routeFields} />
            <input type="hidden" name="sectionId" value={props.section.id} />
            <ConfirmSubmitButton
              confirmMessage={`Delete section "${props.section.title}"? This will remove the section and all blocks inside it.`}
              className="w-full rounded-xl border border-[rgba(194,59,59,0.28)] bg-[var(--danger-soft)] px-3 py-2 text-sm font-medium text-[var(--danger)] hover:border-[rgba(194,59,59,0.42)]"
            >
              Delete section
            </ConfirmSubmitButton>
          </form>
        </div>
      </div>
    </Panel>
  );
}

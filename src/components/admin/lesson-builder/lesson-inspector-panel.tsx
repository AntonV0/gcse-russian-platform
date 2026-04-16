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
}) {
  if (!props.section) {
    return (
      <Panel title="Inspector" description="Select a section to begin editing.">
        <div className="rounded-xl border border-dashed bg-gray-50 px-4 py-8 text-sm text-gray-500">
          No section selected yet.
        </div>
      </Panel>
    );
  }

  if (props.block) {
    return (
      <Panel title="Block inspector" description="Edit the selected block.">
        <div className="space-y-4">
          <div className="rounded-xl border bg-gray-50 p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${getLessonBlockAccentClass(
                  props.block.block_type
                )}`}
              >
                {getLessonBlockGroupLabel(props.block.block_type)}
              </span>

              <span className="font-medium text-gray-900">
                {getLessonBlockLabel(props.block.block_type)}
              </span>

              <Badge tone={props.block.is_published ? "success" : "warning"}>
                {props.block.is_published ? "Published" : "Draft"}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Position:</span> {props.block.position}
              </div>
              <div className="rounded-lg bg-white px-3 py-2 text-gray-600 break-words">
                {getLessonBlockPreview(props.block)}
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-gray-50 p-3">
            <BlockEditPanel block={props.block} routeFields={props.routeFields} />
          </div>

          <div className="rounded-xl border bg-white p-3">
            <div className="mb-2 text-sm font-medium text-gray-900">
              Move to another section
            </div>

            <form action={moveBlockToSectionAction} className="space-y-2">
              <BuilderHiddenFields {...props.routeFields} />
              <input type="hidden" name="blockId" value={props.block.id} />
              <input type="hidden" name="sourceSectionId" value={props.section.id} />

              <select
                name="targetSectionId"
                defaultValue=""
                className="w-full rounded-xl border px-3 py-2 text-sm"
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
                  className="w-full rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
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
                className="w-full rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
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
                className="w-full rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
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
                className="w-full rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
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
                className="w-full rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
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
                className="w-full rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
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
        <div className="rounded-xl border bg-gray-50 p-4">
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Section:</span> {props.section.title}
            </div>
            <div>
              <span className="font-medium">Kind:</span> {props.section.section_kind}
            </div>
            <div>
              <span className="font-medium">Position:</span> {props.section.position}
            </div>
            <div>
              <span className="font-medium">Status:</span>{" "}
              {props.section.is_published ? "Published" : "Draft"}
            </div>
            <div>
              <span className="font-medium">Blocks:</span> {props.section.blocks.length}
            </div>
          </div>
        </div>

        <div className="space-y-2 rounded-xl border border-dashed bg-white px-4 py-4 text-sm text-gray-500">
          <div>Select a block in the center column to edit its content here.</div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="rounded-lg border px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
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
              className="w-full rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
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
              className="w-full rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
            >
              Move section down
            </button>
          </form>

          <form action={duplicateSectionAction}>
            <BuilderHiddenFields {...props.routeFields} />
            <input type="hidden" name="sectionId" value={props.section.id} />
            <button
              type="submit"
              className="w-full rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
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
            <button
              type="submit"
              className="w-full rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
              {props.section.is_published ? "Unpublish section" : "Publish section"}
            </button>
          </form>

          <form action={deleteSectionAction}>
            <BuilderHiddenFields {...props.routeFields} />
            <input type="hidden" name="sectionId" value={props.section.id} />
            <ConfirmSubmitButton
              confirmMessage={`Delete section "${props.section.title}"? This will remove the section and all blocks inside it.`}
              className="w-full rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
            >
              Delete section
            </ConfirmSubmitButton>
          </form>
        </div>
      </div>
    </Panel>
  );
}

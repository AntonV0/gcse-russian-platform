"use client";

import AddBlockComposer from "@/components/admin/lesson-builder/add-block-composer";
import DraggableBlockList from "@/components/admin/lesson-builder/draggable-block-list";
import type {
  LessonBuilderTemplateOptions,
  LessonBuilderVocabularySetOption,
  LessonSection,
  RouteFields,
} from "@/components/admin/lesson-builder/lesson-builder-types";
import {
  Badge,
  CompactDisclosure,
  MiniStatPill,
  Panel,
  PendingStatusText,
  PendingSubmitButton,
  BuilderHiddenFields,
  BUILDER_DASHED_EMPTY_STATE_CLASS,
  BUILDER_FIELD_CLASS,
  BUILDER_MUTED_INFO_BOX_CLASS,
  BUILDER_SECONDARY_BUTTON_CLASS,
  BUILDER_SELECT_CLASS,
} from "@/components/admin/lesson-builder/lesson-builder-ui";
import { updateSectionAction } from "@/app/actions/admin/admin-lesson-builder-actions";
import { SECTION_KIND_OPTIONS } from "@/components/admin/lesson-builder/lesson-builder-types";
import { getLessonBlockLabel, getLessonBlockPreview } from "@/lib/lessons/lesson-blocks";

const VARIANT_VISIBILITY_OPTIONS = [
  { value: "shared", label: "Shared" },
  { value: "foundation_only", label: "Foundation only" },
  { value: "higher_only", label: "Higher only" },
  { value: "volna_only", label: "Volna only" },
] as const;

function formatVariantVisibility(value: LessonSection["variant_visibility"]) {
  return (
    VARIANT_VISIBILITY_OPTIONS.find((option) => option.value === value)?.label ?? value
  );
}

function MetadataField({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/35 p-4">
      <label className="block text-sm font-semibold text-[var(--text-primary)]">
        {label}
      </label>
      <p className="mt-1 text-xs app-text-muted">{description}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default function LessonSectionEditor(props: {
  section: LessonSection | null;
  routeFields: RouteFields;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string | null) => void;
  blockSearch: string;
  onBlockSearchChange: (value: string) => void;
  onJumpToAddBlock: () => void;
  onBlockDragStart: (payload: { blockId: string; sourceSectionId: string }) => void;
  onBlockDragEnd: () => void;
  templateOptions: LessonBuilderTemplateOptions;
  vocabularySetOptions: LessonBuilderVocabularySetOption[];
}) {
  if (!props.section) {
    return (
      <Panel
        title="Lesson editor"
        description="Select a section from the left to start editing."
      >
        <div className={BUILDER_DASHED_EMPTY_STATE_CLASS}>
          <div className="mb-2">No section selected.</div>
          <div>Use the sections panel to choose a section or create a new one.</div>
        </div>
      </Panel>
    );
  }

  const section = props.section;
  const normalizedQuery = props.blockSearch.trim().toLowerCase();

  const filteredBlocks = section.blocks.filter((block) => {
    if (!normalizedQuery) return true;

    const typeLabel = getLessonBlockLabel(block.block_type).toLowerCase();
    const preview = getLessonBlockPreview(block).toLowerCase();

    return typeLabel.includes(normalizedQuery) || preview.includes(normalizedQuery);
  });

  const blockTypeCounts = section.blocks.reduce<Record<string, number>>((acc, block) => {
    acc[block.block_type] = (acc[block.block_type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <CompactDisclosure
        title={section.title}
        description={`${section.blocks.length} block${
          section.blocks.length === 1 ? "" : "s"
        } · ${formatVariantVisibility(section.variant_visibility)}`}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge tone={section.is_published ? "success" : "warning"}>
              {section.is_published ? "Published" : "Draft"}
            </Badge>
            <Badge tone="muted">{section.section_kind}</Badge>
            <Badge tone="default">{section.blocks.length} block(s)</Badge>
            <Badge tone="muted">
              {formatVariantVisibility(section.variant_visibility)}
            </Badge>
          </div>

          {section.description ? (
            <p className="text-sm app-text-muted">{section.description}</p>
          ) : (
            <p className="text-sm app-text-soft">No section description yet.</p>
          )}

          <div className="grid gap-3 md:grid-cols-2">
            <div className={BUILDER_MUTED_INFO_BOX_CLASS}>
              <div className="text-xs font-medium uppercase tracking-wide app-text-soft">
                Variant visibility
              </div>
              <div className="mt-1 text-[var(--text-primary)]">
                {formatVariantVisibility(section.variant_visibility)}
              </div>
            </div>

            <div className={BUILDER_MUTED_INFO_BOX_CLASS}>
              <div className="text-xs font-medium uppercase tracking-wide app-text-soft">
                Canonical section key
              </div>
              <div className="mt-1 text-[var(--text-primary)]">
                {section.canonical_section_key || "Not set"}
              </div>
            </div>
          </div>

          {section.blocks.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {Object.entries(blockTypeCounts)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([blockType, count]) => (
                  <MiniStatPill
                    key={blockType}
                    label={getLessonBlockLabel(blockType)}
                    value={count}
                  />
                ))}
            </div>
          ) : null}
        </div>
      </CompactDisclosure>

      <div id="add-block-composer">
        <CompactDisclosure
          title="Create a new block"
          description="Choose a block type, then fill in the form."
          defaultOpen={section.blocks.length === 0}
        >
          <AddBlockComposer
            section={section}
            routeFields={props.routeFields}
            blockPresetOptions={props.templateOptions.blockPresets}
            vocabularySetOptions={props.vocabularySetOptions}
          />
        </CompactDisclosure>
      </div>

      <Panel title="Blocks" description="Select a block to edit it in the inspector.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-sm app-text-muted">
              Showing {filteredBlocks.length} of {section.blocks.length} block
              {section.blocks.length === 1 ? "" : "s"}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={props.blockSearch}
                onChange={(event) => props.onBlockSearchChange(event.target.value)}
                placeholder="Search blocks..."
                className={`${BUILDER_FIELD_CLASS} sm:w-64`}
              />
              <button
                type="button"
                onClick={props.onJumpToAddBlock}
                className={BUILDER_SECONDARY_BUTTON_CLASS}
              >
                Jump to block creator
              </button>
            </div>
          </div>

          <div className={BUILDER_MUTED_INFO_BOX_CLASS}>
            Drag a block to reorder it within this section, or drag it onto a section in
            the left sidebar to move it there.
          </div>

          {section.blocks.length === 0 ? (
            <div className={`${BUILDER_DASHED_EMPTY_STATE_CLASS} py-8`}>
              <div className="mb-2">No blocks in this section yet.</div>
              <button
                type="button"
                onClick={props.onJumpToAddBlock}
                className={BUILDER_SECONDARY_BUTTON_CLASS}
              >
                Create your first block
              </button>
            </div>
          ) : filteredBlocks.length === 0 ? (
            <div className={`${BUILDER_DASHED_EMPTY_STATE_CLASS} py-8`}>
              No blocks match your search.
            </div>
          ) : (
            <DraggableBlockList
              section={section}
              filteredBlocks={filteredBlocks}
              routeFields={props.routeFields}
              selectedBlockId={props.selectedBlockId}
              onSelectBlock={props.onSelectBlock}
              onBlockDragStart={props.onBlockDragStart}
              onBlockDragEnd={props.onBlockDragEnd}
            />
          )}
        </div>
      </Panel>

      <CompactDisclosure
        title="Edit section metadata"
        description="Update section title, description, section kind, visibility, and shared progress key."
        defaultOpen={section.blocks.length === 0}
      >
        <form action={updateSectionAction} className="space-y-4">
          <BuilderHiddenFields {...props.routeFields} />
          <input type="hidden" name="sectionId" value={section.id} />

          <MetadataField
            label="Section title"
            description="Shown in the lesson builder and used as the section heading."
          >
            <input
              name="title"
              required
              defaultValue={section.title}
              className={BUILDER_FIELD_CLASS}
            />
          </MetadataField>

          <MetadataField
            label="Description"
            description="Optional short admin note describing the purpose of this section."
          >
            <input
              name="description"
              defaultValue={section.description ?? ""}
              className={BUILDER_FIELD_CLASS}
              placeholder="Optional short description"
            />
          </MetadataField>

          <MetadataField
            label="Section kind"
            description="Classifies the section for structure, filtering, and future lesson logic."
          >
            <select
              name="sectionKind"
              defaultValue={section.section_kind}
              className={BUILDER_SELECT_CLASS}
            >
              {SECTION_KIND_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </MetadataField>

          <MetadataField
            label="Variant visibility"
            description="Controls which course variant should include this section."
          >
            <select
              name="variantVisibility"
              defaultValue={section.variant_visibility}
              className={BUILDER_SELECT_CLASS}
            >
              {VARIANT_VISIBILITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </MetadataField>

          <MetadataField
            label="Canonical section key"
            description="Optional shared progress key for matching equivalent sections across variants."
          >
            <input
              name="canonicalSectionKey"
              defaultValue={section.canonical_section_key ?? ""}
              className={BUILDER_FIELD_CLASS}
              placeholder="e.g. food-drink-core-vocab"
            />
          </MetadataField>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <PendingSubmitButton
              idleLabel="Save section"
              pendingLabel="Saving section..."
              className={BUILDER_SECONDARY_BUTTON_CLASS}
            />
            <PendingStatusText pendingText="Updating section metadata..." />
          </div>
        </form>
      </CompactDisclosure>
    </div>
  );
}

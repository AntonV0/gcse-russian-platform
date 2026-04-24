"use client";

import { useState } from "react";
import type {
  LessonBuilderVocabularySetOption,
  LessonSection,
  NewBlockType,
  RouteFields,
} from "@/components/admin/lesson-builder/lesson-builder-types";
import {
  CompactDisclosure,
  BUILDER_DASHED_EMPTY_STATE_CLASS,
} from "@/components/admin/lesson-builder/lesson-builder-ui";
import { BlockPresetList } from "@/components/admin/lesson-builder/add-block-composer/block-preset-list";
import { BlockTypeButton } from "@/components/admin/lesson-builder/add-block-composer/block-type-button";
import { SelectedBlockForm } from "@/components/admin/lesson-builder/add-block-composer/selected-block-form";

function getDefaultComposerSelection(section: LessonSection): NewBlockType | null {
  return section.blocks.length === 0 ? "text" : null;
}

export default function AddBlockComposer(props: {
  section: LessonSection;
  routeFields: RouteFields;
  blockPresetOptions: {
    id: string;
    label: string;
    description: string;
    blocksCount: number;
  }[];
  vocabularySetOptions: LessonBuilderVocabularySetOption[];
}) {
  const [composerState, setComposerState] = useState<{
    sectionId: string;
    selectedNewBlockType: NewBlockType | null;
  }>(() => ({
    sectionId: props.section.id,
    selectedNewBlockType: getDefaultComposerSelection(props.section),
  }));

  const selectedNewBlockType =
    composerState.sectionId === props.section.id
      ? composerState.selectedNewBlockType
      : getDefaultComposerSelection(props.section);

  function updateSelectedNewBlockType(value: NewBlockType | null) {
    setComposerState({
      sectionId: props.section.id,
      selectedNewBlockType: value,
    });
  }

  return (
    <div className="space-y-4">
      <CompactDisclosure
        title={`Quick presets (${props.blockPresetOptions.length})`}
        description="Insert a ready-made starter structure for this section."
      >
        <div className="grid gap-3">
          <BlockPresetList
            sectionId={props.section.id}
            routeFields={props.routeFields}
            blockPresetOptions={props.blockPresetOptions}
          />
        </div>
      </CompactDisclosure>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4 shadow-[0_1px_2px_rgba(16,32,51,0.04)]">
        <div className="mb-4">
          <div className="font-semibold text-[var(--text-primary)]">
            Choose a block type
          </div>
          <div className="text-sm app-text-muted">
            Pick a block below, then fill in the form underneath.
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide app-text-soft">
              Structure
            </div>
            <div className="flex flex-wrap gap-2">
              <BlockTypeButton
                label="Header"
                value="header"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
              <BlockTypeButton
                label="Subheader"
                value="subheader"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
              <BlockTypeButton
                label="Divider"
                value="divider"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide app-text-soft">
              Teaching
            </div>
            <div className="flex flex-wrap gap-2">
              <BlockTypeButton
                label="Text"
                value="text"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
              <BlockTypeButton
                label="Note"
                value="note"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
              <BlockTypeButton
                label="Callout"
                value="callout"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
              <BlockTypeButton
                label="Exam tip"
                value="exam-tip"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
              <BlockTypeButton
                label="Vocabulary"
                value="vocabulary"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide app-text-soft">
              Media
            </div>
            <div className="flex flex-wrap gap-2">
              <BlockTypeButton
                label="Image"
                value="image"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
              <BlockTypeButton
                label="Audio"
                value="audio"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide app-text-soft">
              Practice
            </div>
            <div className="flex flex-wrap gap-2">
              <BlockTypeButton
                label="Question set"
                value="question-set"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
              <BlockTypeButton
                label="Vocabulary set"
                value="vocabulary-set"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
            </div>
          </div>
        </div>
      </div>

      {!selectedNewBlockType ? (
        <div className={BUILDER_DASHED_EMPTY_STATE_CLASS}>
          Choose a block type above to add it to this section.
        </div>
      ) : (
        <SelectedBlockForm
          sectionId={props.section.id}
          routeFields={props.routeFields}
          selectedNewBlockType={selectedNewBlockType}
          vocabularySetOptions={props.vocabularySetOptions}
          onClear={() => updateSelectedNewBlockType(null)}
        />
      )}
    </div>
  );
}

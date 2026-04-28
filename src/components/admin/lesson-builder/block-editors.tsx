"use client";

import {
  updateCalloutBlockAction,
  updateExamTipBlockAction,
  updateHeaderBlockAction,
  updateNoteBlockAction,
  updateQuestionSetBlockAction,
  updateSubheaderBlockAction,
  updateTextBlockAction,
} from "@/app/actions/admin/admin-lesson-builder-actions";
import type {
  LessonBuilderGrammarSetOption,
  LessonBuilderVocabularySetOption,
  RouteFields,
} from "@/components/admin/lesson-builder/lesson-builder-types";
import {
  AudioBlockEditor,
  ImageBlockEditor,
} from "@/components/admin/lesson-builder/block-editors/media-editors";
import { SlugBlockEditor } from "@/components/admin/lesson-builder/block-editors/slug-block-editor";
import {
  TextLikeEditor,
  TitledContentEditor,
} from "@/components/admin/lesson-builder/block-editors/text-editors";
import { VocabularyBlockEditor } from "@/components/admin/lesson-builder/block-editors/vocabulary-block-editor";
import { VocabularySetBlockEditor } from "@/components/admin/lesson-builder/block-editors/vocabulary-set-block-editor";
import { GrammarSetBlockEditor } from "@/components/admin/lesson-builder/block-editors/grammar-set-block-editor";

function getStringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function BlockEditPanel(props: {
  block: {
    id: string;
    block_type: string;
    data: Record<string, unknown>;
  };
  routeFields: RouteFields;
  vocabularySetOptions: LessonBuilderVocabularySetOption[];
  grammarSetOptions: LessonBuilderGrammarSetOption[];
}) {
  switch (props.block.block_type) {
    case "header":
      return (
        <TextLikeEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultValue={getStringValue(props.block.data.content)}
          action={updateHeaderBlockAction}
          label="header block"
        />
      );

    case "subheader":
      return (
        <TextLikeEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultValue={getStringValue(props.block.data.content)}
          action={updateSubheaderBlockAction}
          label="subheader block"
        />
      );

    case "text":
      return (
        <TextLikeEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultValue={getStringValue(props.block.data.content)}
          action={updateTextBlockAction}
          label="text block"
        />
      );

    case "note":
      return (
        <TitledContentEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultTitle={getStringValue(props.block.data.title)}
          defaultContent={getStringValue(props.block.data.content)}
          action={updateNoteBlockAction}
          label="note block"
          titleRequired
        />
      );

    case "callout":
      return (
        <TitledContentEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultTitle={getStringValue(props.block.data.title)}
          defaultContent={getStringValue(props.block.data.content)}
          action={updateCalloutBlockAction}
          label="callout block"
        />
      );

    case "exam-tip":
      return (
        <TitledContentEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultTitle={getStringValue(props.block.data.title)}
          defaultContent={getStringValue(props.block.data.content)}
          action={updateExamTipBlockAction}
          label="exam tip block"
        />
      );

    case "image":
      return (
        <ImageBlockEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultSrc={getStringValue(props.block.data.src)}
          defaultAlt={getStringValue(props.block.data.alt)}
          defaultCaption={getStringValue(props.block.data.caption)}
        />
      );

    case "audio":
      return (
        <AudioBlockEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultTitle={getStringValue(props.block.data.title)}
          defaultSrc={getStringValue(props.block.data.src)}
          defaultCaption={getStringValue(props.block.data.caption)}
          defaultAutoPlay={
            typeof props.block.data.autoPlay === "boolean"
              ? props.block.data.autoPlay
              : false
          }
        />
      );

    case "vocabulary":
      return (
        <VocabularyBlockEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultTitle={getStringValue(props.block.data.title)}
          defaultItems={props.block.data.items}
        />
      );

    case "question-set":
      return (
        <SlugBlockEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultTitle={getStringValue(props.block.data.title)}
          defaultSlug={getStringValue(props.block.data.questionSetSlug)}
          slugFieldName="questionSetSlug"
          action={updateQuestionSetBlockAction}
          label="question-set block"
        />
      );

    case "vocabulary-set":
      return (
        <VocabularySetBlockEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultTitle={getStringValue(props.block.data.title)}
          defaultSlug={getStringValue(props.block.data.vocabularySetSlug)}
          defaultListSlug={getStringValue(props.block.data.vocabularyListSlug)}
          vocabularySetOptions={props.vocabularySetOptions}
        />
      );

    case "grammar-set":
      return (
        <GrammarSetBlockEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultTitle={getStringValue(props.block.data.title)}
          defaultSlug={getStringValue(props.block.data.grammarSetSlug)}
          grammarSetOptions={props.grammarSetOptions}
        />
      );

    case "divider":
      return (
        <div className="text-sm app-text-muted">Divider blocks do not need editing.</div>
      );

    default:
      return (
        <div className="text-sm app-text-muted">
          Editing is not supported yet for this block type.
        </div>
      );
  }
}

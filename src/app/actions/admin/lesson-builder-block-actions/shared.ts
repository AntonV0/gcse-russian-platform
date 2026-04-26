import { createClient } from "@/lib/supabase/server";
import {
  getVocabularyListsBySetIdDb,
  getVocabularySetBySlugDb,
} from "@/lib/vocabulary/vocabulary-helpers-db";
import {
  finalizeLessonMutation,
  getNextBlockPosition,
} from "@/app/actions/admin/admin-lesson-builder-shared";

export type CreatableLessonBlockType =
  | "header"
  | "subheader"
  | "divider"
  | "text"
  | "note"
  | "callout"
  | "exam-tip"
  | "image"
  | "audio"
  | "vocabulary"
  | "question-set"
  | "vocabulary-set";

export type SimpleContentBlockType =
  | "header"
  | "subheader"
  | "text"
  | "callout"
  | "exam-tip";

export async function createBlockRow(params: {
  sectionId: string;
  blockType: CreatableLessonBlockType;
  data: Record<string, unknown>;
  isPublished?: boolean;
  settings?: Record<string, unknown>;
}) {
  const supabase = await createClient();
  const nextPosition = await getNextBlockPosition(params.sectionId);

  const { error } = await supabase.from("lesson_blocks").insert({
    lesson_section_id: params.sectionId,
    block_type: params.blockType,
    position: nextPosition,
    is_published: params.isPublished ?? true,
    data: params.data,
    settings: params.settings ?? {},
  });

  if (error) {
    console.error(`Error creating ${params.blockType} block:`, error);
    throw new Error(`Failed to create ${params.blockType} block`);
  }
}

async function updateBlockRow(params: {
  blockId: string;
  blockType: Exclude<CreatableLessonBlockType, "divider">;
  data: Record<string, unknown>;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_blocks")
    .update({
      data: params.data,
    })
    .eq("id", params.blockId)
    .eq("block_type", params.blockType);

  if (error) {
    console.error(`Error updating ${params.blockType} block:`, error);
    throw new Error(`Failed to update ${params.blockType} block`);
  }
}

export async function createValidatedBlock(params: {
  formData: FormData;
  sectionId: string;
  blockType: Exclude<CreatableLessonBlockType, "divider">;
  buildData: () => Promise<Record<string, unknown>> | Record<string, unknown>;
}) {
  const data = await params.buildData();

  await createBlockRow({
    sectionId: params.sectionId,
    blockType: params.blockType,
    data,
  });

  await finalizeLessonMutation(params.formData);
}

export async function updateValidatedBlock(params: {
  formData: FormData;
  blockId: string;
  blockType: Exclude<CreatableLessonBlockType, "divider">;
  buildData: () => Promise<Record<string, unknown>> | Record<string, unknown>;
}) {
  const data = await params.buildData();

  await updateBlockRow({
    blockId: params.blockId,
    blockType: params.blockType,
    data,
  });

  await finalizeLessonMutation(params.formData);
}

export async function createSimpleContentBlock(params: {
  formData: FormData;
  sectionId: string;
  blockType: SimpleContentBlockType;
  data: Record<string, unknown>;
}) {
  await createValidatedBlock({
    formData: params.formData,
    sectionId: params.sectionId,
    blockType: params.blockType,
    buildData: () => params.data,
  });
}

export async function updateSimpleContentBlock(params: {
  formData: FormData;
  blockId: string;
  blockType: SimpleContentBlockType;
  data: Record<string, unknown>;
}) {
  await updateValidatedBlock({
    formData: params.formData,
    blockId: params.blockId,
    blockType: params.blockType,
    buildData: () => params.data,
  });
}

export async function ensureVocabularySetExists(vocabularySetSlug: string) {
  const vocabularySet = await getVocabularySetBySlugDb(vocabularySetSlug);

  if (!vocabularySet) {
    throw new Error("Selected vocabulary set does not exist");
  }

  return vocabularySet;
}

export async function ensureVocabularyListBelongsToSet(
  vocabularySetSlug: string,
  vocabularyListSlug: string
) {
  const vocabularySet = await ensureVocabularySetExists(vocabularySetSlug);

  if (!vocabularyListSlug) {
    return null;
  }

  const lists = await getVocabularyListsBySetIdDb(vocabularySet.id);
  const vocabularyList = lists.find((list) => list.slug === vocabularyListSlug);

  if (!vocabularyList) {
    throw new Error("Selected vocabulary list does not exist in this set");
  }

  return vocabularyList;
}

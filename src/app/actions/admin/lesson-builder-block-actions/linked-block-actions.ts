"use server";

import { requireAdminAccess } from "@/lib/auth/admin-auth";
import {
  normalizeQuestionSetBlockData,
  normalizeVocabularyBlockData,
  normalizeVocabularySetBlockData,
} from "@/lib/lessons/lesson-blocks";
import { getTrimmedString } from "@/app/actions/admin/admin-lesson-builder-shared";
import {
  createValidatedBlock,
  ensureVocabularyListBelongsToSet,
  updateValidatedBlock,
} from "./shared";

export async function createVocabularyBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const title = getTrimmedString(formData, "title");
  const itemsRaw = getTrimmedString(formData, "items");

  if (!sectionId || !title || !itemsRaw) {
    throw new Error("Missing required fields");
  }

  await createValidatedBlock({
    formData,
    sectionId,
    blockType: "vocabulary",
    buildData: () =>
      normalizeVocabularyBlockData({
        title,
        items: itemsRaw,
      }),
  });
}

export async function updateVocabularyBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const title = getTrimmedString(formData, "title");
  const itemsRaw = getTrimmedString(formData, "items");

  if (!blockId || !title || !itemsRaw) {
    throw new Error("Missing required fields");
  }

  await updateValidatedBlock({
    formData,
    blockId,
    blockType: "vocabulary",
    buildData: () =>
      normalizeVocabularyBlockData({
        title,
        items: itemsRaw,
      }),
  });
}

export async function createQuestionSetBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const title = getTrimmedString(formData, "title");
  const questionSetSlug = getTrimmedString(formData, "questionSetSlug");

  if (!sectionId || !questionSetSlug) {
    throw new Error("Missing required fields");
  }

  await createValidatedBlock({
    formData,
    sectionId,
    blockType: "question-set",
    buildData: () =>
      normalizeQuestionSetBlockData({
        title,
        questionSetSlug,
      }),
  });
}

export async function updateQuestionSetBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const title = getTrimmedString(formData, "title");
  const questionSetSlug = getTrimmedString(formData, "questionSetSlug");

  if (!blockId || !questionSetSlug) {
    throw new Error("Missing required fields");
  }

  await updateValidatedBlock({
    formData,
    blockId,
    blockType: "question-set",
    buildData: () =>
      normalizeQuestionSetBlockData({
        title,
        questionSetSlug,
      }),
  });
}

export async function createVocabularySetBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const title = getTrimmedString(formData, "title");
  const vocabularySetSlug = getTrimmedString(formData, "vocabularySetSlug");
  const vocabularyListSlug = getTrimmedString(formData, "vocabularyListSlug");

  if (!sectionId || !vocabularySetSlug) {
    throw new Error("Missing required fields");
  }

  await createValidatedBlock({
    formData,
    sectionId,
    blockType: "vocabulary-set",
    buildData: async () => {
      await ensureVocabularyListBelongsToSet(vocabularySetSlug, vocabularyListSlug);

      return normalizeVocabularySetBlockData({
        title,
        vocabularySetSlug,
        vocabularyListSlug,
      });
    },
  });
}

export async function updateVocabularySetBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const title = getTrimmedString(formData, "title");
  const vocabularySetSlug = getTrimmedString(formData, "vocabularySetSlug");
  const vocabularyListSlug = getTrimmedString(formData, "vocabularyListSlug");

  if (!blockId || !vocabularySetSlug) {
    throw new Error("Missing required fields");
  }

  await updateValidatedBlock({
    formData,
    blockId,
    blockType: "vocabulary-set",
    buildData: async () => {
      await ensureVocabularyListBelongsToSet(vocabularySetSlug, vocabularyListSlug);

      return normalizeVocabularySetBlockData({
        title,
        vocabularySetSlug,
        vocabularyListSlug,
      });
    },
  });
}

"use server";

import { requireAdminAccess } from "@/lib/auth/admin-auth";
import {
  normalizeCalloutBlockData,
  normalizeExamTipBlockData,
  normalizeHeaderBlockData,
  normalizeNoteBlockData,
  normalizeSubheaderBlockData,
  normalizeTextBlockData,
} from "@/lib/lessons/lesson-blocks";
import {
  finalizeLessonMutation,
  getTrimmedString,
} from "@/app/actions/admin/admin-lesson-builder-shared";
import {
  createBlockRow,
  createSimpleContentBlock,
  createValidatedBlock,
  updateSimpleContentBlock,
  updateValidatedBlock,
} from "./shared";

export async function createHeaderBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const content = getTrimmedString(formData, "content");

  if (!sectionId || !content) {
    throw new Error("Missing required fields");
  }

  await createSimpleContentBlock({
    formData,
    sectionId,
    blockType: "header",
    data: normalizeHeaderBlockData({ content }),
  });
}

export async function updateHeaderBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const content = getTrimmedString(formData, "content");

  if (!blockId || !content) {
    throw new Error("Missing required fields");
  }

  await updateSimpleContentBlock({
    formData,
    blockId,
    blockType: "header",
    data: normalizeHeaderBlockData({ content }),
  });
}

export async function createSubheaderBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const content = getTrimmedString(formData, "content");

  if (!sectionId || !content) {
    throw new Error("Missing required fields");
  }

  await createSimpleContentBlock({
    formData,
    sectionId,
    blockType: "subheader",
    data: normalizeSubheaderBlockData({ content }),
  });
}

export async function updateSubheaderBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const content = getTrimmedString(formData, "content");

  if (!blockId || !content) {
    throw new Error("Missing required fields");
  }

  await updateSimpleContentBlock({
    formData,
    blockId,
    blockType: "subheader",
    data: normalizeSubheaderBlockData({ content }),
  });
}

export async function createDividerBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");

  if (!sectionId) {
    throw new Error("Missing required fields");
  }

  await createBlockRow({
    sectionId,
    blockType: "divider",
    data: {},
  });

  await finalizeLessonMutation(formData);
}

export async function createTextBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const content = getTrimmedString(formData, "content");

  if (!sectionId || !content) {
    throw new Error("Missing required fields");
  }

  await createSimpleContentBlock({
    formData,
    sectionId,
    blockType: "text",
    data: normalizeTextBlockData({ content }),
  });
}

export async function updateTextBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const content = getTrimmedString(formData, "content");

  if (!blockId || !content) {
    throw new Error("Missing required fields");
  }

  await updateSimpleContentBlock({
    formData,
    blockId,
    blockType: "text",
    data: normalizeTextBlockData({ content }),
  });
}

export async function createNoteBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const title = getTrimmedString(formData, "title");
  const content = getTrimmedString(formData, "content");

  if (!sectionId || !title || !content) {
    throw new Error("Missing required fields");
  }

  await createValidatedBlock({
    formData,
    sectionId,
    blockType: "note",
    buildData: () => normalizeNoteBlockData({ title, content }),
  });
}

export async function updateNoteBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const title = getTrimmedString(formData, "title");
  const content = getTrimmedString(formData, "content");

  if (!blockId || !title || !content) {
    throw new Error("Missing required fields");
  }

  await updateValidatedBlock({
    formData,
    blockId,
    blockType: "note",
    buildData: () => normalizeNoteBlockData({ title, content }),
  });
}

export async function createCalloutBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const title = getTrimmedString(formData, "title");
  const content = getTrimmedString(formData, "content");

  if (!sectionId || !content) {
    throw new Error("Missing required fields");
  }

  await createSimpleContentBlock({
    formData,
    sectionId,
    blockType: "callout",
    data: normalizeCalloutBlockData({ title, content }),
  });
}

export async function updateCalloutBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const title = getTrimmedString(formData, "title");
  const content = getTrimmedString(formData, "content");

  if (!blockId || !content) {
    throw new Error("Missing required fields");
  }

  await updateSimpleContentBlock({
    formData,
    blockId,
    blockType: "callout",
    data: normalizeCalloutBlockData({ title, content }),
  });
}

export async function createExamTipBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const title = getTrimmedString(formData, "title");
  const content = getTrimmedString(formData, "content");

  if (!sectionId || !content) {
    throw new Error("Missing required fields");
  }

  await createSimpleContentBlock({
    formData,
    sectionId,
    blockType: "exam-tip",
    data: normalizeExamTipBlockData({ title, content }),
  });
}

export async function updateExamTipBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const title = getTrimmedString(formData, "title");
  const content = getTrimmedString(formData, "content");

  if (!blockId || !content) {
    throw new Error("Missing required fields");
  }

  await updateSimpleContentBlock({
    formData,
    blockId,
    blockType: "exam-tip",
    data: normalizeExamTipBlockData({ title, content }),
  });
}

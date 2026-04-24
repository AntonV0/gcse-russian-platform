"use server";

import { requireAdminAccess } from "@/lib/auth/admin-auth";
import {
  normalizeAudioBlockData,
  normalizeImageBlockData,
} from "@/lib/lessons/lesson-blocks";
import {
  getBoolean,
  getTrimmedString,
} from "@/app/actions/admin/admin-lesson-builder-shared";
import { createValidatedBlock, updateValidatedBlock } from "./shared";

export async function createImageBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const src = getTrimmedString(formData, "src");
  const alt = getTrimmedString(formData, "alt");
  const caption = getTrimmedString(formData, "caption");

  if (!sectionId || !src) {
    throw new Error("Missing required fields");
  }

  await createValidatedBlock({
    formData,
    sectionId,
    blockType: "image",
    buildData: () => normalizeImageBlockData({ src, alt, caption }),
  });
}

export async function updateImageBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const src = getTrimmedString(formData, "src");
  const alt = getTrimmedString(formData, "alt");
  const caption = getTrimmedString(formData, "caption");

  if (!blockId || !src) {
    throw new Error("Missing required fields");
  }

  await updateValidatedBlock({
    formData,
    blockId,
    blockType: "image",
    buildData: () => normalizeImageBlockData({ src, alt, caption }),
  });
}

export async function createAudioBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const title = getTrimmedString(formData, "title");
  const src = getTrimmedString(formData, "src");
  const caption = getTrimmedString(formData, "caption");
  const autoPlay = getBoolean(formData, "autoPlay");

  if (!sectionId || !src) {
    throw new Error("Missing required fields");
  }

  await createValidatedBlock({
    formData,
    sectionId,
    blockType: "audio",
    buildData: () => normalizeAudioBlockData({ title, src, caption, autoPlay }),
  });
}

export async function updateAudioBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const title = getTrimmedString(formData, "title");
  const src = getTrimmedString(formData, "src");
  const caption = getTrimmedString(formData, "caption");
  const autoPlay = getBoolean(formData, "autoPlay");

  if (!blockId || !src) {
    throw new Error("Missing required fields");
  }

  await updateValidatedBlock({
    formData,
    blockId,
    blockType: "audio",
    buildData: () => normalizeAudioBlockData({ title, src, caption, autoPlay }),
  });
}

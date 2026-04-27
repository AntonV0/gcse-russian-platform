"use server";

import { requireAdminAccess } from "@/lib/auth/admin-auth";
import {
  createCourseAction as createCourse,
  updateCourseAction as updateCourse,
} from "@/app/actions/admin/content/course-actions";
import {
  archiveVariantAction as archiveVariant,
  createVariantAction as createVariant,
  moveVariantAction as moveVariant,
  updateVariantAction as updateVariant,
} from "@/app/actions/admin/content/variant-actions";
import {
  createModuleAction as createModule,
  moveModuleAction as moveModule,
  unpublishModuleAction as unpublishModule,
  updateModuleAction as updateModule,
} from "@/app/actions/admin/content/module-actions";
import {
  createLessonAction as createLesson,
  moveLessonAction as moveLesson,
  unpublishLessonAction as unpublishLesson,
  updateLessonAction as updateLesson,
} from "@/app/actions/admin/content/lesson-actions";

async function requireAdminContentMutationAccess() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }
}

export async function createCourseAction(formData: FormData) {
  await requireAdminContentMutationAccess();
  return createCourse(formData);
}

export async function updateCourseAction(formData: FormData) {
  await requireAdminContentMutationAccess();
  return updateCourse(formData);
}

export async function archiveVariantAction(formData: FormData) {
  await requireAdminContentMutationAccess();
  return archiveVariant(formData);
}

export async function createVariantAction(formData: FormData) {
  await requireAdminContentMutationAccess();
  return createVariant(formData);
}

export async function moveVariantAction(formData: FormData) {
  await requireAdminContentMutationAccess();
  return moveVariant(formData);
}

export async function updateVariantAction(formData: FormData) {
  await requireAdminContentMutationAccess();
  return updateVariant(formData);
}

export async function createModuleAction(formData: FormData) {
  await requireAdminContentMutationAccess();
  return createModule(formData);
}

export async function moveModuleAction(formData: FormData) {
  await requireAdminContentMutationAccess();
  return moveModule(formData);
}

export async function unpublishModuleAction(formData: FormData) {
  await requireAdminContentMutationAccess();
  return unpublishModule(formData);
}

export async function updateModuleAction(formData: FormData) {
  await requireAdminContentMutationAccess();
  return updateModule(formData);
}

export async function createLessonAction(formData: FormData) {
  await requireAdminContentMutationAccess();
  return createLesson(formData);
}

export async function moveLessonAction(formData: FormData) {
  await requireAdminContentMutationAccess();
  return moveLesson(formData);
}

export async function unpublishLessonAction(formData: FormData) {
  await requireAdminContentMutationAccess();
  return unpublishLesson(formData);
}

export async function updateLessonAction(formData: FormData) {
  await requireAdminContentMutationAccess();
  return updateLesson(formData);
}

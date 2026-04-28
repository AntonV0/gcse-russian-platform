"use server";

import { assertAdminAccess } from "@/lib/auth/admin-auth";
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

export async function createCourseAction(formData: FormData) {
  await assertAdminAccess();
  return createCourse(formData);
}

export async function updateCourseAction(formData: FormData) {
  await assertAdminAccess();
  return updateCourse(formData);
}

export async function archiveVariantAction(formData: FormData) {
  await assertAdminAccess();
  return archiveVariant(formData);
}

export async function createVariantAction(formData: FormData) {
  await assertAdminAccess();
  return createVariant(formData);
}

export async function moveVariantAction(formData: FormData) {
  await assertAdminAccess();
  return moveVariant(formData);
}

export async function updateVariantAction(formData: FormData) {
  await assertAdminAccess();
  return updateVariant(formData);
}

export async function createModuleAction(formData: FormData) {
  await assertAdminAccess();
  return createModule(formData);
}

export async function moveModuleAction(formData: FormData) {
  await assertAdminAccess();
  return moveModule(formData);
}

export async function unpublishModuleAction(formData: FormData) {
  await assertAdminAccess();
  return unpublishModule(formData);
}

export async function updateModuleAction(formData: FormData) {
  await assertAdminAccess();
  return updateModule(formData);
}

export async function createLessonAction(formData: FormData) {
  await assertAdminAccess();
  return createLesson(formData);
}

export async function moveLessonAction(formData: FormData) {
  await assertAdminAccess();
  return moveLesson(formData);
}

export async function unpublishLessonAction(formData: FormData) {
  await assertAdminAccess();
  return unpublishLesson(formData);
}

export async function updateLessonAction(formData: FormData) {
  await assertAdminAccess();
  return updateLesson(formData);
}

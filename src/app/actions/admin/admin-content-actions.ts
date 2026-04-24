"use server";

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
  return createCourse(formData);
}

export async function updateCourseAction(formData: FormData) {
  return updateCourse(formData);
}

export async function archiveVariantAction(formData: FormData) {
  return archiveVariant(formData);
}

export async function createVariantAction(formData: FormData) {
  return createVariant(formData);
}

export async function moveVariantAction(formData: FormData) {
  return moveVariant(formData);
}

export async function updateVariantAction(formData: FormData) {
  return updateVariant(formData);
}

export async function createModuleAction(formData: FormData) {
  return createModule(formData);
}

export async function moveModuleAction(formData: FormData) {
  return moveModule(formData);
}

export async function unpublishModuleAction(formData: FormData) {
  return unpublishModule(formData);
}

export async function updateModuleAction(formData: FormData) {
  return updateModule(formData);
}

export async function createLessonAction(formData: FormData) {
  return createLesson(formData);
}

export async function moveLessonAction(formData: FormData) {
  return moveLesson(formData);
}

export async function unpublishLessonAction(formData: FormData) {
  return unpublishLesson(formData);
}

export async function updateLessonAction(formData: FormData) {
  return updateLesson(formData);
}

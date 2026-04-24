"use server";

import {
  createPastPaperResourceAction as createPastPaperResource,
  deletePastPaperResourceAction as deletePastPaperResource,
  updatePastPaperResourceAction as updatePastPaperResource,
} from "@/app/actions/admin/past-papers/past-paper-actions";

export async function createPastPaperResourceAction(formData: FormData) {
  return createPastPaperResource(formData);
}

export async function updatePastPaperResourceAction(formData: FormData) {
  return updatePastPaperResource(formData);
}

export async function deletePastPaperResourceAction(formData: FormData) {
  return deletePastPaperResource(formData);
}

"use server";

import { redirect } from "next/navigation";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { getTrimmedString } from "@/app/actions/shared/form-data";
import {
  getExamPayload,
  getQuestionPayload,
  getSectionPayload,
} from "@/app/actions/admin/mock-exams/mock-exam-form-payloads";

export async function createMockExamSetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const payload = getExamPayload(formData);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mock_exam_sets")
    .insert(payload)
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error creating mock exam set:", { payload, error });
    throw new Error(`Failed to create mock exam set: ${error?.message ?? "unknown"}`);
  }

  redirect(`/admin/mock-exams/${data.id}`);
}

export async function updateMockExamSetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const mockExamId = getTrimmedString(formData, "mockExamId");

  if (!mockExamId) {
    throw new Error("Missing mock exam id");
  }

  const payload = getExamPayload(formData);
  const supabase = await createClient();

  const { error } = await supabase
    .from("mock_exam_sets")
    .update(payload)
    .eq("id", mockExamId);

  if (error) {
    console.error("Error updating mock exam set:", { mockExamId, payload, error });
    throw new Error(`Failed to update mock exam set: ${error.message}`);
  }

  redirect(`/admin/mock-exams/${mockExamId}`);
}

export async function deleteMockExamSetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const mockExamId = getTrimmedString(formData, "mockExamId");

  if (!mockExamId) {
    throw new Error("Missing mock exam id");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("mock_exam_sets").delete().eq("id", mockExamId);

  if (error) {
    console.error("Error deleting mock exam set:", { mockExamId, error });
    throw new Error(`Failed to delete mock exam set: ${error.message}`);
  }

  redirect("/admin/mock-exams");
}

export async function createMockExamSectionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const mockExamId = getTrimmedString(formData, "mockExamId");

  if (!mockExamId) {
    throw new Error("Missing mock exam id");
  }

  const payload = {
    mock_exam_id: mockExamId,
    ...getSectionPayload(formData),
  };
  const supabase = await createClient();

  const { error } = await supabase.from("mock_exam_sections").insert(payload);

  if (error) {
    console.error("Error creating mock exam section:", { payload, error });
    throw new Error(`Failed to create mock exam section: ${error.message}`);
  }

  redirect(`/admin/mock-exams/${mockExamId}`);
}

export async function updateMockExamSectionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const mockExamId = getTrimmedString(formData, "mockExamId");
  const sectionId = getTrimmedString(formData, "sectionId");

  if (!mockExamId || !sectionId) {
    throw new Error("Missing section id");
  }

  const payload = getSectionPayload(formData);
  const supabase = await createClient();

  const { error } = await supabase
    .from("mock_exam_sections")
    .update(payload)
    .eq("id", sectionId)
    .eq("mock_exam_id", mockExamId);

  if (error) {
    console.error("Error updating mock exam section:", {
      mockExamId,
      sectionId,
      payload,
      error,
    });
    throw new Error(`Failed to update mock exam section: ${error.message}`);
  }

  redirect(`/admin/mock-exams/${mockExamId}`);
}

export async function deleteMockExamSectionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const mockExamId = getTrimmedString(formData, "mockExamId");
  const sectionId = getTrimmedString(formData, "sectionId");

  if (!mockExamId || !sectionId) {
    throw new Error("Missing section id");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("mock_exam_sections")
    .delete()
    .eq("id", sectionId)
    .eq("mock_exam_id", mockExamId);

  if (error) {
    console.error("Error deleting mock exam section:", {
      mockExamId,
      sectionId,
      error,
    });
    throw new Error(`Failed to delete mock exam section: ${error.message}`);
  }

  redirect(`/admin/mock-exams/${mockExamId}`);
}

export async function createMockExamQuestionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const mockExamId = getTrimmedString(formData, "mockExamId");
  const sectionId = getTrimmedString(formData, "sectionId");

  if (!mockExamId || !sectionId) {
    throw new Error("Missing section id");
  }

  const payload = {
    section_id: sectionId,
    ...getQuestionPayload(formData),
  };
  const supabase = await createClient();

  const { error } = await supabase.from("mock_exam_questions").insert(payload);

  if (error) {
    console.error("Error creating mock exam question:", { payload, error });
    throw new Error(`Failed to create mock exam question: ${error.message}`);
  }

  redirect(`/admin/mock-exams/${mockExamId}`);
}

export async function updateMockExamQuestionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const mockExamId = getTrimmedString(formData, "mockExamId");
  const questionId = getTrimmedString(formData, "questionId");

  if (!mockExamId || !questionId) {
    throw new Error("Missing question id");
  }

  const payload = getQuestionPayload(formData);
  const supabase = await createClient();

  const { error } = await supabase
    .from("mock_exam_questions")
    .update(payload)
    .eq("id", questionId);

  if (error) {
    console.error("Error updating mock exam question:", {
      mockExamId,
      questionId,
      payload,
      error,
    });
    throw new Error(`Failed to update mock exam question: ${error.message}`);
  }

  redirect(`/admin/mock-exams/${mockExamId}`);
}

export async function deleteMockExamQuestionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const mockExamId = getTrimmedString(formData, "mockExamId");
  const questionId = getTrimmedString(formData, "questionId");

  if (!mockExamId || !questionId) {
    throw new Error("Missing question id");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("mock_exam_questions")
    .delete()
    .eq("id", questionId);

  if (error) {
    console.error("Error deleting mock exam question:", {
      mockExamId,
      questionId,
      error,
    });
    throw new Error(`Failed to delete mock exam question: ${error.message}`);
  }

  redirect(`/admin/mock-exams/${mockExamId}`);
}

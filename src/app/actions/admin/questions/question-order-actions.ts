"use server";

import { redirect } from "next/navigation";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { getTrimmedString } from "./shared";

export async function moveQuestionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const questionId = getTrimmedString(formData, "questionId");
  const questionSetId = getTrimmedString(formData, "questionSetId");
  const direction = getTrimmedString(formData, "direction");

  if (!questionId || !questionSetId) {
    throw new Error("Missing required fields");
  }

  if (direction !== "up" && direction !== "down") {
    throw new Error("Invalid move direction");
  }

  const supabase = await createClient();

  const { data: currentQuestion, error: currentQuestionError } = await supabase
    .from("questions")
    .select("id, question_set_id, position")
    .eq("id", questionId)
    .eq("question_set_id", questionSetId)
    .maybeSingle();

  if (currentQuestionError || !currentQuestion) {
    console.error("Error loading current question:", currentQuestionError);
    throw new Error("Failed to load current question");
  }

  const targetPosition =
    direction === "up" ? currentQuestion.position - 1 : currentQuestion.position + 1;

  if (targetPosition < 1) {
    redirect(`/admin/question-sets/${questionSetId}`);
  }

  const { data: swapQuestion, error: swapQuestionError } = await supabase
    .from("questions")
    .select("id, position")
    .eq("question_set_id", questionSetId)
    .eq("position", targetPosition)
    .maybeSingle();

  if (swapQuestionError) {
    console.error("Error loading swap question:", swapQuestionError);
    throw new Error("Failed to load target question");
  }

  if (!swapQuestion) {
    redirect(`/admin/question-sets/${questionSetId}`);
  }

  const { error: firstUpdateError } = await supabase
    .from("questions")
    .update({ position: 0 })
    .eq("id", currentQuestion.id);

  if (firstUpdateError) {
    console.error("Error setting temporary position:", firstUpdateError);
    throw new Error("Failed to reorder question");
  }

  const { error: secondUpdateError } = await supabase
    .from("questions")
    .update({ position: currentQuestion.position })
    .eq("id", swapQuestion.id);

  if (secondUpdateError) {
    console.error("Error updating swap question position:", secondUpdateError);
    throw new Error("Failed to reorder question");
  }

  const { error: thirdUpdateError } = await supabase
    .from("questions")
    .update({ position: swapQuestion.position })
    .eq("id", currentQuestion.id);

  if (thirdUpdateError) {
    console.error("Error updating current question position:", thirdUpdateError);
    throw new Error("Failed to reorder question");
  }

  redirect(`/admin/question-sets/${questionSetId}`);
}

export async function normalizeQuestionPositionsAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const questionSetId = getTrimmedString(formData, "questionSetId");

  if (!questionSetId) {
    throw new Error("Missing question set id");
  }

  const supabase = await createClient();

  const { data: questions, error: loadError } = await supabase
    .from("questions")
    .select("id, position")
    .eq("question_set_id", questionSetId)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (loadError) {
    console.error("Error loading questions for normalization:", loadError);
    throw new Error("Failed to load questions");
  }

  const rows = questions ?? [];

  for (let index = 0; index < rows.length; index += 1) {
    const question = rows[index];
    const nextPosition = index + 1;

    if (question.position === nextPosition) {
      continue;
    }

    const { error: updateError } = await supabase
      .from("questions")
      .update({ position: nextPosition })
      .eq("id", question.id);

    if (updateError) {
      console.error("Error normalizing question position:", updateError);
      throw new Error("Failed to normalize question positions");
    }
  }

  redirect(`/admin/question-sets/${questionSetId}`);
}

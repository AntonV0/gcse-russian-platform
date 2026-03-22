"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/lib/admin-auth";

export async function createQuestionSetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;
  const instructions =
    String(formData.get("instructions") || "").trim() || null;

  if (!title || !slug) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("question_sets")
    .insert({
      title,
      slug,
      description,
      instructions,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error creating question set:", error);
    throw new Error("Failed to create question set");
  }

  redirect(`/admin/question-sets/${data.id}`);
}
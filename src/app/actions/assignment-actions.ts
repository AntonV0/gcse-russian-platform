"use server";

import { createClient } from "@/lib/supabase/server";

type SubmitAssignmentInput = {
  assignmentId: string;
  submittedText: string;
  submittedFilePath?: string | null;
  submittedFileName?: string | null;
};

export async function submitAssignmentAction({
  assignmentId,
  submittedText,
  submittedFilePath = null,
  submittedFileName = null,
}: SubmitAssignmentInput) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "not_authenticated" as const };
  }

  const now = new Date().toISOString();

  const { data: existing, error: existingError } = await supabase
    .from("assignment_submissions")
    .select("id")
    .eq("assignment_id", assignmentId)
    .eq("student_user_id", user.id)
    .maybeSingle();

  if (existingError) {
    console.error("Error checking existing assignment submission:", existingError);
    return { success: false, error: "submission_lookup_failed" as const };
  }

  if (!existing) {
    const { error: insertError } = await supabase.from("assignment_submissions").insert({
      assignment_id: assignmentId,
      student_user_id: user.id,
      status: "submitted",
      submitted_text: submittedText.trim() || null,
      submitted_file_path: submittedFilePath,
      submitted_file_name: submittedFileName,
      submitted_at: now,
    });

    if (insertError) {
      console.error("Error inserting assignment submission:", insertError);
      return { success: false, error: "submission_insert_failed" as const };
    }
  } else {
    const { error: updateError } = await supabase
      .from("assignment_submissions")
      .update({
        status: "submitted",
        submitted_text: submittedText.trim() || null,
        submitted_file_path: submittedFilePath,
        submitted_file_name: submittedFileName,
        submitted_at: now,
      })
      .eq("id", existing.id);

    if (updateError) {
      console.error("Error updating assignment submission:", updateError);
      return { success: false, error: "submission_update_failed" as const };
    }
  }

  return { success: true };
}

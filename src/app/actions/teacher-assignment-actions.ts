"use server";

import { createClient } from "@/lib/supabase/server";

type ReviewAssignmentSubmissionInput = {
  submissionId: string;
  mark?: number | null;
  feedback?: string | null;
};

export async function reviewAssignmentSubmissionAction({
  submissionId,
  mark = null,
  feedback = null,
}: ReviewAssignmentSubmissionInput) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "not_authenticated" as const };
  }

  const { error } = await supabase
    .from("assignment_submissions")
    .update({
      status: "reviewed",
      mark,
      feedback,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  if (error) {
    console.error("Error reviewing assignment submission:", error);
    return { success: false, error: "review_failed" as const };
  }

  return { success: true };
}
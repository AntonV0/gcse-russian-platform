"use server";

import { redirect } from "next/navigation";
import { getTrimmedString } from "@/app/actions/shared/form-data";
import { getCurrentUser } from "@/lib/auth/auth";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import {
  AI_MARKING_PROMPT_VERSION,
  AI_MARKING_RUBRIC_VERSION,
  detectAiMarkingInputKind,
  generateMockExamAiMarking,
  getAiMarkingModel,
  getAiTranscriptionModel,
} from "@/lib/ai-marking/mock-exam-ai-marking";
import {
  getAiMarkingActiveJobCutoff,
  getAiMarkingRateLimitCutoff,
  isAiMarkingRateLimited,
} from "@/lib/ai-marking/mock-exam-ai-marking-guards";
import { loadMockExamAttemptDb } from "@/lib/mock-exams/loaders";
import { createClient } from "@/lib/supabase/server";

export async function generateAiMockExamMarkingAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const attemptId = getTrimmedString(formData, "attemptId");
  const questionId = getTrimmedString(formData, "questionId");

  if (!attemptId || !questionId) {
    throw new Error("Missing attempt or question id");
  }

  if (!process.env.OPENAI_API_KEY) {
    redirect(
      `/admin/mock-exams/review/${attemptId}?aiError=${encodeURIComponent(
        "OPENAI_API_KEY is not configured for this environment."
      )}`
    );
  }

  const { attempt, sections, questionsBySectionId, responsesByQuestionId } =
    await loadMockExamAttemptDb(attemptId);

  if (!attempt) {
    throw new Error("Mock exam attempt not found");
  }

  if (attempt.status === "draft") {
    throw new Error("Draft attempts cannot be AI marked until submitted");
  }

  const question = sections
    .flatMap((section) => questionsBySectionId[section.id] ?? [])
    .find((entry) => entry.id === questionId);
  const response = responsesByQuestionId[questionId];

  if (!question) {
    throw new Error("Question not found");
  }

  if (!response) {
    throw new Error("No response has been saved for this question");
  }

  const supabase = await createClient();
  const now = new Date().toISOString();
  const inputKind = detectAiMarkingInputKind(response);
  let jobId: string | null = null;

  const { data: activeJobs, error: activeJobError } = await supabase
    .from("ai_marking_jobs")
    .select("id")
    .eq("response_id", response.id)
    .eq("question_id", question.id)
    .eq("prompt_version", AI_MARKING_PROMPT_VERSION)
    .eq("rubric_version", AI_MARKING_RUBRIC_VERSION)
    .in("status", ["queued", "running"])
    .gte("created_at", getAiMarkingActiveJobCutoff())
    .order("created_at", { ascending: false })
    .limit(1);

  if (activeJobError) {
    throw new Error(`Failed to check active AI marking jobs: ${activeJobError.message}`);
  }

  if ((activeJobs?.length ?? 0) > 0) {
    redirect(
      `/admin/mock-exams/review/${attempt.id}?aiError=${encodeURIComponent(
        "An AI suggestion is already being generated for this response."
      )}`
    );
  }

  const { count: recentJobCount, error: rateLimitError } = await supabase
    .from("ai_marking_jobs")
    .select("id", { count: "exact", head: true })
    .eq("created_by", user.id)
    .gte("created_at", getAiMarkingRateLimitCutoff());

  if (rateLimitError) {
    throw new Error(`Failed to check AI marking rate limit: ${rateLimitError.message}`);
  }

  if (isAiMarkingRateLimited(recentJobCount)) {
    redirect(
      `/admin/mock-exams/review/${attempt.id}?aiError=${encodeURIComponent(
        "AI marking is cooling down after several recent requests. Try again shortly."
      )}`
    );
  }

  try {
    const { data: job, error: jobError } = await supabase
      .from("ai_marking_jobs")
      .insert({
        attempt_id: attempt.id,
        question_id: question.id,
        response_id: response.id,
        status: "running",
        input_kind: inputKind,
        provider: "openai",
        marking_model: getAiMarkingModel(),
        transcription_model: inputKind === "audio" ? getAiTranscriptionModel() : null,
        prompt_version: AI_MARKING_PROMPT_VERSION,
        rubric_version: AI_MARKING_RUBRIC_VERSION,
        created_by: user.id,
      })
      .select("id")
      .single();

    if (jobError || !job) {
      throw new Error(`Failed to create AI marking job: ${jobError?.message}`);
    }

    jobId = job.id;

    const output = await generateMockExamAiMarking({ question, response });
    const completedStatus =
      output.confidence === "low" || output.flags.includes("teacher_moderation_required")
        ? "requires_review"
        : "succeeded";

    const { error: outputError } = await supabase.from("ai_marking_outputs").insert({
      job_id: jobId,
      extracted_text: output.extractedText,
      transcription_confidence: output.transcriptionConfidence,
      suggested_marks: output.suggestedMarks,
      max_marks: output.maxMarks,
      band: output.band,
      confidence: output.confidence,
      rationale: output.rationale,
      evidence: output.evidence,
      strengths: output.strengths,
      targets: output.targets,
      flags: output.flags,
      raw_json: output.rawJson,
    });

    if (outputError) {
      throw new Error(`Failed to save AI marking output: ${outputError.message}`);
    }

    const aiMarking = {
      suggestedMarks: output.suggestedMarks,
      confidence: output.confidence,
      teacherDecision: "pending",
      teacherNotes: "",
      rationale: output.rationale,
      evidence: output.evidence,
      strengths: output.strengths,
      targets: output.targets,
      extractedText: output.extractedText,
      transcriptionConfidence: output.transcriptionConfidence,
      flags: output.flags,
      band: output.band,
      source: "openai",
      jobId,
      generatedAt: now,
      promptVersion: AI_MARKING_PROMPT_VERSION,
      rubricVersion: AI_MARKING_RUBRIC_VERSION,
      extractionModel: output.models.extractionModel,
      markingModel: output.models.markingModel,
      transcriptionModel: output.models.transcriptionModel,
    };

    const { error: responseError } = await supabase
      .from("mock_exam_responses")
      .update({
        response_payload: {
          ...response.response_payload,
          aiMarking,
        },
        updated_at: now,
      })
      .eq("id", response.id);

    if (responseError) {
      throw new Error(
        `Failed to attach AI marking to response: ${responseError.message}`
      );
    }

    const { error: completionError } = await supabase
      .from("ai_marking_jobs")
      .update({
        status: completedStatus,
        extraction_model: output.models.extractionModel,
        marking_model: output.models.markingModel,
        transcription_model: output.models.transcriptionModel,
        completed_at: now,
        error_message: null,
      })
      .eq("id", jobId);

    if (completionError) {
      throw new Error(`Failed to complete AI marking job: ${completionError.message}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI marking failed";

    if (jobId) {
      await supabase
        .from("ai_marking_jobs")
        .update({
          status: "failed",
          completed_at: new Date().toISOString(),
          error_message: message,
        })
        .eq("id", jobId);
    }

    console.error("Error generating AI mock exam marking:", {
      attemptId,
      questionId,
      jobId,
      error,
    });
    redirect(
      `/admin/mock-exams/review/${attempt.id}?aiError=${encodeURIComponent(message)}`
    );
  }

  redirect(`/admin/mock-exams/review/${attempt.id}?aiMarked=${question.id}`);
}

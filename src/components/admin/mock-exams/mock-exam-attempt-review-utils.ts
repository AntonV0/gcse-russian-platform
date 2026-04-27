import type { MockExamProfileSummary } from "@/lib/mock-exams/mock-exam-helpers-db";

export function getMockExamProfileLabel(profile: MockExamProfileSummary | null) {
  if (!profile) return "Unknown student";
  return profile.full_name || profile.display_name || profile.email || "Unnamed student";
}

export function getString(value: unknown) {
  return typeof value === "string" ? value : "";
}

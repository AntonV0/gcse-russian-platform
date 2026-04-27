import type {
  MockExamQuestionType,
  MockExamSectionType,
  MockExamTier,
} from "@/lib/mock-exams/types";

export function getMockExamTierLabel(tier: MockExamTier) {
  switch (tier) {
    case "foundation":
      return "Foundation";
    case "higher":
      return "Higher";
    case "both":
      return "Both tiers";
    default:
      return tier;
  }
}

export function getMockExamSectionTypeLabel(sectionType: MockExamSectionType) {
  return sectionType.replaceAll("_", " ");
}

export function getMockExamQuestionTypeLabel(questionType: MockExamQuestionType) {
  switch (questionType) {
    case "true_false_not_mentioned":
      return "True / false / not mentioned";
    default:
      return questionType.replaceAll("_", " ");
  }
}

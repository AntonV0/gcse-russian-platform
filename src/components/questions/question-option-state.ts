export type QuestionOptionState =
  | "idle"
  | "selected"
  | "correct"
  | "incorrect"
  | "missed";

type GetQuestionOptionStateInput = {
  optionId: string;
  selectedOptionId: string | null | undefined;
  correctOptionId?: string | null;
  hasSubmitted: boolean;
  isCorrect?: boolean;
};

export function getQuestionOptionState({
  optionId,
  selectedOptionId,
  correctOptionId,
  hasSubmitted,
  isCorrect,
}: GetQuestionOptionStateInput): QuestionOptionState {
  const isSelected = selectedOptionId === optionId;

  if (!hasSubmitted) {
    return isSelected ? "selected" : "idle";
  }

  if (correctOptionId && optionId === correctOptionId) {
    return "correct";
  }

  if (isSelected) {
    return isCorrect ? "correct" : "incorrect";
  }

  return "idle";
}

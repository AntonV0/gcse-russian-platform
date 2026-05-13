export type MockExamAttemptReviewQuestion = {
  label: string;
  sectionTitle: string;
  answerFieldNames: string[];
  persistedAttachmentSaved: boolean;
  anchorId: string;
};

function hasUsableFormValue(value: FormDataEntryValue) {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return typeof value.size === "number" && value.size > 0;
}

export function isMockExamAttemptQuestionAnswered(
  question: MockExamAttemptReviewQuestion,
  formData: FormData
) {
  const hasEnteredResponse = question.answerFieldNames.some((fieldName) =>
    formData.getAll(fieldName).some(hasUsableFormValue)
  );

  return hasEnteredResponse || question.persistedAttachmentSaved;
}

export function getUnansweredMockExamAttemptQuestions(
  questions: MockExamAttemptReviewQuestion[],
  formData: FormData
) {
  return questions.filter(
    (question) => !isMockExamAttemptQuestionAnswered(question, formData)
  );
}

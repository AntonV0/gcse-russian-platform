export const CONTENT_PURPOSES = [
  {
    key: "core_teaching",
    label: "Core teaching",
    order: 1,
  },
  {
    key: "guided_practice",
    label: "Guided practice",
    order: 2,
  },
  {
    key: "retrieval_practice",
    label: "Retrieval practice",
    order: 3,
  },
  {
    key: "exam_technique",
    label: "Exam technique",
    order: 4,
  },
  {
    key: "translation_practice",
    label: "Translation practice",
    order: 5,
  },
  {
    key: "speaking_practice",
    label: "Speaking practice",
    order: 6,
  },
  {
    key: "listening_practice",
    label: "Listening practice",
    order: 7,
  },
  {
    key: "reading_practice",
    label: "Reading practice",
    order: 8,
  },
  {
    key: "writing_practice",
    label: "Writing practice",
    order: 9,
  },
  {
    key: "grammar_focus",
    label: "Grammar focus",
    order: 10,
  },
  {
    key: "vocabulary_focus",
    label: "Vocabulary focus",
    order: 11,
  },
  {
    key: "revision",
    label: "Revision",
    order: 12,
  },
  {
    key: "mock_exam",
    label: "Mock exam",
    order: 13,
  },
  {
    key: "onboarding",
    label: "Onboarding",
    order: 14,
  },
  {
    key: "reference",
    label: "Reference",
    order: 15,
  },
] as const;

export type ContentPurposeKey = (typeof CONTENT_PURPOSES)[number]["key"];

export const ASSESSMENT_OBJECTIVES = [
  {
    key: "ao1_listening",
    label: "AO1 Listening",
    skillKey: "listening",
    order: 1,
  },
  {
    key: "ao2_speaking",
    label: "AO2 Speaking",
    skillKey: "speaking",
    order: 2,
  },
  {
    key: "ao3_reading",
    label: "AO3 Reading",
    skillKey: "reading",
    order: 3,
  },
  {
    key: "ao4_writing",
    label: "AO4 Writing",
    skillKey: "writing",
    order: 4,
  },
] as const;

export type AssessmentObjectiveKey = (typeof ASSESSMENT_OBJECTIVES)[number]["key"];

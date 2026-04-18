export const PAPERS = [
  {
    key: "paper_1_listening",
    label: "Paper 1: Listening",
    shortLabel: "Paper 1",
    paperNumber: 1,
    skillKey: "listening",
    assessmentObjectiveKey: "ao1_listening",
    tier: "both",
    order: 1,
  },
  {
    key: "paper_2_speaking",
    label: "Paper 2: Speaking",
    shortLabel: "Paper 2",
    paperNumber: 2,
    skillKey: "speaking",
    assessmentObjectiveKey: "ao2_speaking",
    tier: "both",
    order: 2,
  },
  {
    key: "paper_3_reading",
    label: "Paper 3: Reading",
    shortLabel: "Paper 3",
    paperNumber: 3,
    skillKey: "reading",
    assessmentObjectiveKey: "ao3_reading",
    tier: "both",
    order: 3,
  },
  {
    key: "paper_4_writing",
    label: "Paper 4: Writing",
    shortLabel: "Paper 4",
    paperNumber: 4,
    skillKey: "writing",
    assessmentObjectiveKey: "ao4_writing",
    tier: "both",
    order: 4,
  },
] as const;

export type PaperKey = (typeof PAPERS)[number]["key"];

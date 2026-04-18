export const SKILLS = [
  {
    key: "listening",
    label: "Listening",
    order: 1,
  },
  {
    key: "speaking",
    label: "Speaking",
    order: 2,
  },
  {
    key: "reading",
    label: "Reading",
    order: 3,
  },
  {
    key: "writing",
    label: "Writing",
    order: 4,
  },
] as const;

export type SkillKey = (typeof SKILLS)[number]["key"];

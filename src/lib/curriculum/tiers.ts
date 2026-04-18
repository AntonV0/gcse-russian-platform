export const TIERS = [
  {
    key: "foundation",
    label: "Foundation",
    shortLabel: "F",
    order: 1,
  },
  {
    key: "higher",
    label: "Higher",
    shortLabel: "H",
    order: 2,
  },
  {
    key: "both",
    label: "Both tiers",
    shortLabel: "Both",
    order: 3,
  },
] as const;

export type TierKey = (typeof TIERS)[number]["key"];

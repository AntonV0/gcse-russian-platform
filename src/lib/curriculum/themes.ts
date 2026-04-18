export const THEMES = [
  {
    key: "identity_and_culture",
    label: "Identity and culture",
    order: 1,
  },
  {
    key: "local_area_holiday_travel",
    label: "Local area, holiday, travel",
    order: 2,
  },
  {
    key: "school",
    label: "School",
    order: 3,
  },
  {
    key: "future_aspirations_study_work",
    label: "Future aspirations, study and work",
    order: 4,
  },
  {
    key: "international_global_dimension",
    label: "International and global dimension",
    order: 5,
  },
] as const;

export type ThemeKey = (typeof THEMES)[number]["key"];

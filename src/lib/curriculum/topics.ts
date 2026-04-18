export const TOPICS = [
  {
    key: "who_am_i",
    themeKey: "identity_and_culture",
    label: "Who am I?",
    order: 1,
  },
  {
    key: "daily_life",
    themeKey: "identity_and_culture",
    label: "Daily life",
    order: 2,
  },
  {
    key: "cultural_life",
    themeKey: "identity_and_culture",
    label: "Cultural life",
    order: 3,
  },

  {
    key: "holidays",
    themeKey: "local_area_holiday_travel",
    label: "Holidays",
    order: 4,
  },
  {
    key: "travel_and_tourist_transactions",
    themeKey: "local_area_holiday_travel",
    label: "Travel and tourist transactions",
    order: 5,
  },
  {
    key: "town_region_country",
    themeKey: "local_area_holiday_travel",
    label: "Town, region and country",
    order: 6,
  },

  {
    key: "what_school_is_like",
    themeKey: "school",
    label: "What school is like",
    order: 7,
  },
  {
    key: "school_activities",
    themeKey: "school",
    label: "School activities",
    order: 8,
  },

  {
    key: "using_languages_beyond_the_classroom",
    themeKey: "future_aspirations_study_work",
    label: "Using languages beyond the classroom",
    order: 9,
  },
  {
    key: "ambitions",
    themeKey: "future_aspirations_study_work",
    label: "Ambitions",
    order: 10,
  },
  {
    key: "work",
    themeKey: "future_aspirations_study_work",
    label: "Work",
    order: 11,
  },

  {
    key: "bringing_the_world_together",
    themeKey: "international_global_dimension",
    label: "Bringing the world together",
    order: 12,
  },
  {
    key: "environmental_issues",
    themeKey: "international_global_dimension",
    label: "Environmental issues",
    order: 13,
  },
] as const;

export type TopicKey = (typeof TOPICS)[number]["key"];

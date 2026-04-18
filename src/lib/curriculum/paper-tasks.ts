export const PAPER_TASKS = [
  {
    key: "listening_comprehension",
    label: "Listening comprehension",
    paperKey: "paper_1_listening",
    tier: "both",
    order: 1,
  },

  {
    key: "speaking_role_play",
    label: "Role play",
    paperKey: "paper_2_speaking",
    tier: "both",
    order: 2,
  },
  {
    key: "speaking_picture_task",
    label: "Picture-based task",
    paperKey: "paper_2_speaking",
    tier: "both",
    order: 3,
  },
  {
    key: "speaking_conversation",
    label: "Conversation",
    paperKey: "paper_2_speaking",
    tier: "both",
    order: 4,
  },

  {
    key: "reading_comprehension",
    label: "Reading comprehension",
    paperKey: "paper_3_reading",
    tier: "both",
    order: 5,
  },
  {
    key: "reading_translation_ru_to_en",
    label: "Translation: Russian to English",
    paperKey: "paper_3_reading",
    tier: "both",
    order: 6,
  },

  {
    key: "writing_short_response",
    label: "Short response",
    paperKey: "paper_4_writing",
    tier: "foundation",
    order: 7,
  },
  {
    key: "writing_formal_response",
    label: "Formal response",
    paperKey: "paper_4_writing",
    tier: "both",
    order: 8,
  },
  {
    key: "writing_informal_extended_response",
    label: "Informal extended response",
    paperKey: "paper_4_writing",
    tier: "both",
    order: 9,
  },
  {
    key: "writing_formal_extended_response",
    label: "Formal extended response",
    paperKey: "paper_4_writing",
    tier: "higher",
    order: 10,
  },
  {
    key: "writing_translation_en_to_ru",
    label: "Translation: English to Russian",
    paperKey: "paper_4_writing",
    tier: "both",
    order: 11,
  },
] as const;

export type PaperTaskKey = (typeof PAPER_TASKS)[number]["key"];

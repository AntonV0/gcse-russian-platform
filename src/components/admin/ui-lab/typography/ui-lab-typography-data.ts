export const TYPOGRAPHY_PAGE_NAV_ITEMS = [
  { id: "hierarchy", label: "Hierarchy" },
  { id: "text-roles", label: "Text roles" },
  { id: "forms", label: "Forms" },
  { id: "tone", label: "Tone" },
  { id: "lesson-copy", label: "Lesson copy" },
  { id: "future-components", label: "Future" },
];

export const TYPOGRAPHY_FONT_EXAMPLES = [
  {
    title: "Page title / English",
    english: "Build confidence before the exam",
    russian: "Уверенность перед экзаменом",
    note: "Main headings should feel premium and reassuring, not stiff.",
    kind: "title",
  },
  {
    title: "Section title / English + Russian",
    english: "Travel and tourist transactions",
    russian: "Путешествия и туристические ситуации",
    note: "Section titles should scan quickly in both languages.",
    kind: "section",
  },
  {
    title: "Body copy / lesson explanation",
    english:
      "Use the target language to describe where you are going, how you will travel, and what you plan to do when you arrive.",
    russian:
      "Используй язык, чтобы описать, куда ты едешь, как ты будешь путешествовать и что ты планируешь делать по прибытии.",
    note: "Body text must stay calm and readable in longer lesson blocks.",
    kind: "body",
  },
  {
    title: "Input and form language",
    english: "Lesson title",
    russian: "Название урока",
    note: "Forms should feel clean and modern without looking too corporate.",
    kind: "form",
  },
] as const;

export const TYPOGRAPHY_RULES = [
  "Page titles should be noticeably stronger than section titles, not just slightly larger.",
  "Use muted text for support, not for primary decisions or actions.",
  "Labels should guide structure, not compete with headings.",
  "Compact admin text can be denser, but should still preserve readable hierarchy.",
  "Student-facing copy can be warmer and more encouraging while staying within the same system.",
  "Keep one global body font for the product unless there is a very strong reason to split experiences.",
];

export const TYPOGRAPHY_FUTURE_ITEMS = [
  "CopyToneMatrix for admin, student, teacher, and parent-facing text.",
  "RussianTextStressTest for long words, mixed scripts, and dense vocabulary.",
  "MetadataTextRow for timestamps, variant labels, and technical details.",
  "InlineDefinition pattern for grammar notes and vocabulary support.",
  "ReadingWidthPreview for long lesson explanations.",
  "ErrorCopyGuide for validation, access, and destructive-action messages.",
];

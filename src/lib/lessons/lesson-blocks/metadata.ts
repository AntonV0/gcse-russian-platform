export function getLessonBlockLabel(blockType: string): string {
  switch (blockType) {
    case "header":
      return "Header";
    case "subheader":
      return "Subheader";
    case "divider":
      return "Divider";
    case "text":
      return "Text";
    case "note":
      return "Note";
    case "callout":
      return "Callout";
    case "exam-tip":
      return "Exam tip";
    case "image":
      return "Image";
    case "audio":
      return "Audio";
    case "vocabulary":
      return "Vocabulary";
    case "vocabulary-set":
      return "Vocabulary set";
    case "question-set":
      return "Question set";
    case "multiple-choice":
      return "Multiple choice";
    case "short-answer":
      return "Short answer";
    default:
      return blockType;
  }
}

export function getLessonBlockGroupLabel(blockType: string): string {
  switch (blockType) {
    case "header":
    case "subheader":
    case "divider":
      return "Structure";
    case "text":
    case "note":
    case "callout":
    case "exam-tip":
      return "Teaching";
    case "vocabulary":
    case "vocabulary-set":
      return "Vocabulary";
    case "image":
    case "audio":
      return "Media";
    case "question-set":
    case "multiple-choice":
    case "short-answer":
      return "Practice";
    default:
      return "Block";
  }
}

export function getLessonBlockAccentClass(blockType: string): string {
  switch (blockType) {
    case "header":
    case "subheader":
    case "divider":
      return "border-[var(--border)] bg-[var(--background-muted)] text-[var(--text-secondary)]";
    case "text":
    case "note":
    case "callout":
    case "exam-tip":
      return "border-[var(--info-border)] bg-[var(--info-surface)] text-[var(--info-text)]";
    case "vocabulary":
    case "vocabulary-set":
      return "border-[var(--success-border)] bg-[var(--success-surface)] text-[var(--success-text)]";
    case "image":
    case "audio":
      return "border-[var(--surface-accent-border)] bg-[var(--accent-selected-bg)] text-[var(--accent-on-soft)]";
    case "question-set":
    case "multiple-choice":
    case "short-answer":
      return "border-[var(--warning-border)] bg-[var(--warning-surface)] text-[var(--warning-text)]";
    default:
      return "border-[var(--border)] bg-[var(--background-muted)] text-[var(--text-secondary)]";
  }
}

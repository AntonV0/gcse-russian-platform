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
      return "border-slate-200 bg-slate-50 text-slate-700";
    case "text":
    case "note":
    case "callout":
    case "exam-tip":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "vocabulary":
    case "vocabulary-set":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "image":
    case "audio":
      return "border-purple-200 bg-purple-50 text-purple-700";
    case "question-set":
    case "multiple-choice":
    case "short-answer":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
}

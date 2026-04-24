import type { LessonBlock } from "@/types/lesson";
import { getLessonBlockLabel } from "./metadata";
import type { DbLessonBlockLike } from "./types";

export function getLessonBlockPreview(block: LessonBlock | DbLessonBlockLike): string {
  if ("type" in block) {
    switch (block.type) {
      case "header":
      case "subheader":
      case "text":
        return block.content;

      case "note":
        return block.title || block.content;

      case "callout":
      case "exam-tip":
        return block.title || block.content;

      case "image":
        return block.caption
          ? `Image Â· ${block.caption}`
          : block.alt
            ? `Image Â· ${block.alt}`
            : block.src
              ? `Image Â· ${block.src}`
              : "Image block";

      case "audio":
        return block.title
          ? `Audio Â· ${block.title}`
          : block.caption
            ? `Audio Â· ${block.caption}`
            : block.src
              ? `Audio Â· ${block.src}`
              : "Audio block";

      case "vocabulary":
        return block.items.length > 0
          ? `${block.items.length} item(s) Â· ${block.items
              .slice(0, 2)
              .map((item) => `${item.russian} = ${item.english}`)
              .join(", ")}`
          : "Vocabulary block";

      case "vocabulary-set":
        return block.title
          ? `Vocabulary set Â· ${block.title}`
          : `Vocabulary set Â· ${block.vocabularySetSlug}`;

      case "question-set":
        return block.title
          ? `Question set Â· ${block.title}`
          : `Question set Â· ${block.questionSetSlug}`;

      case "multiple-choice":
        return `Multiple choice Â· ${block.question}`;

      case "short-answer":
        return `Short answer Â· ${block.question}`;

      case "divider":
        return "Divider";

      default:
        return "Block";
    }
  }

  const data = block.data ?? {};

  switch (block.block_type) {
    case "header":
    case "subheader":
    case "text":
      return typeof data.content === "string" && data.content.trim().length > 0
        ? data.content
        : getLessonBlockLabel(block.block_type);

    case "note":
    case "callout":
    case "exam-tip":
      return typeof data.title === "string" && data.title.trim().length > 0
        ? data.title
        : typeof data.content === "string" && data.content.trim().length > 0
          ? data.content
          : getLessonBlockLabel(block.block_type);

    case "image":
      return typeof data.caption === "string" && data.caption.trim().length > 0
        ? `Image Â· ${data.caption}`
        : typeof data.alt === "string" && data.alt.trim().length > 0
          ? `Image Â· ${data.alt}`
          : typeof data.src === "string" && data.src.trim().length > 0
            ? `Image Â· ${data.src}`
            : "Image block";

    case "audio":
      return typeof data.title === "string" && data.title.trim().length > 0
        ? `Audio Â· ${data.title}`
        : typeof data.caption === "string" && data.caption.trim().length > 0
          ? `Audio Â· ${data.caption}`
          : typeof data.src === "string" && data.src.trim().length > 0
            ? `Audio Â· ${data.src}`
            : "Audio block";

    case "vocabulary":
      if (Array.isArray(data.items) && data.items.length > 0) {
        const preview = data.items
          .slice(0, 2)
          .map((item) => {
            if (!item || typeof item !== "object") return "";
            const record = item as Record<string, unknown>;
            const russian = typeof record.russian === "string" ? record.russian : "";
            const english = typeof record.english === "string" ? record.english : "";
            return russian && english ? `${russian} = ${english}` : "";
          })
          .filter(Boolean)
          .join(", ");

        return `${data.items.length} item(s)${preview ? ` Â· ${preview}` : ""}`;
      }

      return typeof data.title === "string" && data.title.trim().length > 0
        ? data.title
        : "Vocabulary block";

    case "vocabulary-set":
      return typeof data.title === "string" && data.title.trim().length > 0
        ? `Vocabulary set Â· ${data.title}`
        : typeof data.vocabularySetSlug === "string" &&
            data.vocabularySetSlug.trim().length > 0
          ? `Vocabulary set Â· ${data.vocabularySetSlug}`
          : "Vocabulary set block";

    case "question-set":
      return typeof data.title === "string" && data.title.trim().length > 0
        ? `Question set Â· ${data.title}`
        : typeof data.questionSetSlug === "string" &&
            data.questionSetSlug.trim().length > 0
          ? `Question set Â· ${data.questionSetSlug}`
          : "Question set block";

    case "divider":
      return "Divider";

    default:
      return getLessonBlockLabel(block.block_type);
  }
}

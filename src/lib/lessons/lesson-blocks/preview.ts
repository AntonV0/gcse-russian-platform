import type { LessonBlock } from "@/types/lesson";
import { getLessonBlockLabel } from "./metadata";
import type { DbLessonBlockLike } from "./types";

function joinPreview(label: string, value: string) {
  return `${label} - ${value}`;
}

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
          ? joinPreview("Image", block.caption)
          : block.alt
            ? joinPreview("Image", block.alt)
            : block.src
              ? joinPreview("Image", block.src)
              : "Image block";

      case "audio":
        return block.title
          ? joinPreview("Audio", block.title)
          : block.caption
            ? joinPreview("Audio", block.caption)
            : block.src
              ? joinPreview("Audio", block.src)
              : "Audio block";

      case "vocabulary":
        return block.items.length > 0
          ? `${block.items.length} item(s) - ${block.items
              .slice(0, 2)
              .map((item) => `${item.russian} = ${item.english}`)
              .join(", ")}`
          : "Vocabulary block";

      case "vocabulary-set":
        return block.title
          ? joinPreview("Vocabulary set", block.title)
          : joinPreview(
              "Vocabulary set",
              block.vocabularyListSlug
                ? `${block.vocabularySetSlug} / ${block.vocabularyListSlug}`
                : block.vocabularySetSlug
            );

      case "grammar-set":
        return block.title
          ? joinPreview("Grammar set", block.title)
          : joinPreview("Grammar set", block.grammarSetSlug);

      case "question-set":
        return block.title
          ? joinPreview("Question set", block.title)
          : joinPreview("Question set", block.questionSetSlug);

      case "multiple-choice":
        return joinPreview("Multiple choice", block.question);

      case "short-answer":
        return joinPreview("Short answer", block.question);

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
        ? joinPreview("Image", data.caption)
        : typeof data.alt === "string" && data.alt.trim().length > 0
          ? joinPreview("Image", data.alt)
          : typeof data.src === "string" && data.src.trim().length > 0
            ? joinPreview("Image", data.src)
            : "Image block";

    case "audio":
      return typeof data.title === "string" && data.title.trim().length > 0
        ? joinPreview("Audio", data.title)
        : typeof data.caption === "string" && data.caption.trim().length > 0
          ? joinPreview("Audio", data.caption)
          : typeof data.src === "string" && data.src.trim().length > 0
            ? joinPreview("Audio", data.src)
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

        return `${data.items.length} item(s)${preview ? ` - ${preview}` : ""}`;
      }

      return typeof data.title === "string" && data.title.trim().length > 0
        ? data.title
        : "Vocabulary block";

    case "vocabulary-set":
      return typeof data.title === "string" && data.title.trim().length > 0
        ? joinPreview("Vocabulary set", data.title)
        : typeof data.vocabularySetSlug === "string" &&
            data.vocabularySetSlug.trim().length > 0
          ? joinPreview(
              "Vocabulary set",
              typeof data.vocabularyListSlug === "string" &&
                data.vocabularyListSlug.trim().length > 0
                ? `${data.vocabularySetSlug} / ${data.vocabularyListSlug}`
                : data.vocabularySetSlug
            )
          : "Vocabulary set block";

    case "grammar-set":
      return typeof data.title === "string" && data.title.trim().length > 0
        ? joinPreview("Grammar set", data.title)
        : typeof data.grammarSetSlug === "string" &&
            data.grammarSetSlug.trim().length > 0
          ? joinPreview("Grammar set", data.grammarSetSlug)
          : "Grammar set block";

    case "question-set":
      return typeof data.title === "string" && data.title.trim().length > 0
        ? joinPreview("Question set", data.title)
        : typeof data.questionSetSlug === "string" &&
            data.questionSetSlug.trim().length > 0
          ? joinPreview("Question set", data.questionSetSlug)
          : "Question set block";

    case "divider":
      return "Divider";

    default:
      return getLessonBlockLabel(block.block_type);
  }
}

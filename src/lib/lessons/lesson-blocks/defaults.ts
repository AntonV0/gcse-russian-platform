import type { BuilderBlockType } from "./types";

export function getDefaultBlockData(
  blockType: BuilderBlockType
): Record<string, unknown> {
  switch (blockType) {
    case "header":
      return {
        content: "New section heading",
      };

    case "subheader":
      return {
        content: "Subheading",
      };

    case "divider":
      return {};

    case "text":
      return {
        content: "Write the teaching content here.",
      };

    case "note":
      return {
        title: "Study note",
        content: "Add an important note for the student here.",
      };

    case "callout":
      return {
        title: "Remember",
        content: "Highlight something important here.",
      };

    case "exam-tip":
      return {
        title: "Exam tip",
        content: "Add exam-focused advice here.",
      };

    case "vocabulary":
      return {
        title: "Key vocabulary",
        items: [
          { russian: "Ð´Ð¾Ð¼", english: "house" },
          { russian: "ÑˆÐºÐ¾Ð»Ð°", english: "school" },
        ],
      };

    case "image":
      return {
        src: "",
        alt: "",
        caption: "",
      };

    case "audio":
      return {
        title: "",
        src: "",
        caption: "",
        autoPlay: false,
      };

    case "question-set":
      return {
        title: "Practice questions",
        questionSetSlug: "",
      };

    case "vocabulary-set":
      return {
        title: "Vocabulary practice",
        vocabularySetSlug: "",
        vocabularyListSlug: "",
      };

    case "grammar-set":
      return {
        title: "Grammar focus",
        grammarSetSlug: "",
      };

    default:
      return {};
  }
}

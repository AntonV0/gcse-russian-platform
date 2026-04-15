import type { BuilderBlockType } from "@/lib/lesson-blocks";
import { getDefaultBlockData } from "@/lib/lesson-blocks";

export type LessonBlockPreset = {
  id: string;
  label: string;
  description: string;
  blocks: Array<{
    blockType: BuilderBlockType;
    data?: Record<string, unknown>;
  }>;
};

function mergeBlockData(
  blockType: BuilderBlockType,
  data?: Record<string, unknown>
): Record<string, unknown> {
  return {
    ...getDefaultBlockData(blockType),
    ...(data ?? {}),
  };
}

export const lessonBlockPresets: LessonBlockPreset[] = [
  {
    id: "teaching-explanation",
    label: "Teaching explanation",
    description: "Header, explanatory text, and a note.",
    blocks: [
      {
        blockType: "header",
        data: { content: "New concept" },
      },
      {
        blockType: "text",
        data: { content: "Explain the concept clearly here." },
      },
      {
        blockType: "note",
        data: {
          title: "Remember",
          content: "Add a short summary or reminder here.",
        },
      },
    ],
  },
  {
    id: "vocabulary-teach-practice",
    label: "Vocabulary teach + practice",
    description: "Subheader, vocabulary list, then question set.",
    blocks: [
      {
        blockType: "subheader",
        data: { content: "Key vocabulary" },
      },
      {
        blockType: "vocabulary",
        data: {
          title: "Key vocabulary",
          items: [
            { russian: "дом", english: "house" },
            { russian: "школа", english: "school" },
          ],
        },
      },
      {
        blockType: "question-set",
        data: {
          title: "Vocabulary practice",
          questionSetSlug: "",
        },
      },
    ],
  },
  {
    id: "exam-skill",
    label: "Exam skill section",
    description: "Header, teaching text, exam tip, then practice.",
    blocks: [
      {
        blockType: "header",
        data: { content: "Exam skill focus" },
      },
      {
        blockType: "text",
        data: { content: "Explain the exam technique here." },
      },
      {
        blockType: "exam-tip",
        data: {
          title: "Exam tip",
          content: "Add a short exam-focused reminder here.",
        },
      },
      {
        blockType: "question-set",
        data: {
          title: "Apply this skill",
          questionSetSlug: "",
        },
      },
    ],
  },
];

export function getPresetBlocksForInsert(presetId: string) {
  const preset = lessonBlockPresets.find((item) => item.id === presetId);
  if (!preset) {
    throw new Error("Preset not found");
  }

  return preset.blocks.map((block) => ({
    blockType: block.blockType,
    data: mergeBlockData(block.blockType, block.data),
  }));
}

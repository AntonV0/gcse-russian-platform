"use client";

import {
  AlignLeft,
  BookOpen,
  FileQuestion,
  Heading1,
  Heading2,
  Image,
  Lightbulb,
  Megaphone,
  Minus,
  NotebookText,
  Sparkles,
  Type,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import type { NewBlockType } from "@/components/admin/lesson-builder/lesson-builder-types";

const BLOCK_TYPE_ICONS = {
  header: Heading1,
  subheader: Heading2,
  divider: Minus,
  text: AlignLeft,
  note: NotebookText,
  callout: Megaphone,
  "exam-tip": Lightbulb,
  vocabulary: BookOpen,
  image: Image,
  audio: Volume2,
  "question-set": FileQuestion,
  "vocabulary-set": Type,
} satisfies Record<NewBlockType, LucideIcon>;

type BlockTypeButtonProps = {
  label: string;
  value: NewBlockType;
  selectedValue: NewBlockType | null;
  onSelect: (value: NewBlockType) => void;
};

export function BlockTypeButton(props: BlockTypeButtonProps) {
  const isSelected = props.selectedValue === props.value;
  const Icon = BLOCK_TYPE_ICONS[props.value] ?? Sparkles;

  return (
    <button
      type="button"
      onClick={() => props.onSelect(props.value)}
      className={[
        "group inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-[background-color,border-color,box-shadow,transform]",
        isSelected
          ? "border-[var(--brand-blue)] bg-[var(--brand-blue)] text-white shadow-[0_10px_22px_rgba(37,99,235,0.18)]"
          : "border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-primary)] shadow-[0_1px_2px_rgba(16,32,51,0.04)] hover:-translate-y-[1px] hover:border-[var(--border-strong)] hover:bg-[var(--background-muted)] hover:shadow-[0_8px_18px_rgba(16,32,51,0.06)]",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border",
          isSelected
            ? "border-white/25 bg-white/15 text-white"
            : "border-[var(--border)] bg-[var(--background-muted)] text-[var(--text-secondary)]",
        ].join(" ")}
      >
        <Icon size={15} />
      </span>
      <span>{props.label}</span>
    </button>
  );
}

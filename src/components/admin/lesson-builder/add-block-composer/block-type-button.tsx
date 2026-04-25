"use client";

import AppIcon from "@/components/ui/app-icon";
import type { NewBlockType } from "@/components/admin/lesson-builder/lesson-builder-types";
import type { AppIconKey } from "@/lib/shared/icons";

const BLOCK_TYPE_ICONS = {
  header: "heading",
  subheader: "subheader",
  divider: "divider",
  text: "text",
  note: "note",
  callout: "callout",
  "exam-tip": "examTip",
  vocabulary: "vocabulary",
  image: "image",
  audio: "audio",
  "question-set": "questionSet",
  "vocabulary-set": "vocabularySet",
} satisfies Record<NewBlockType, AppIconKey>;

type BlockTypeButtonProps = {
  label: string;
  value: NewBlockType;
  selectedValue: NewBlockType | null;
  onSelect: (value: NewBlockType) => void;
};

export function BlockTypeButton(props: BlockTypeButtonProps) {
  const isSelected = props.selectedValue === props.value;
  const icon = BLOCK_TYPE_ICONS[props.value] ?? "feedback";

  return (
    <button
      type="button"
      onClick={() => props.onSelect(props.value)}
      className={[
        "group inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-[background-color,border-color,box-shadow,transform]",
        isSelected
          ? "border-[var(--accent-fill)] [background:var(--accent-gradient-fill)] text-[var(--accent-on-fill)] shadow-[0_10px_22px_color-mix(in_srgb,var(--accent)_18%,transparent)]"
          : "border-[var(--border)] bg-[var(--surface-plain-bg)] text-[var(--text-primary)] shadow-[var(--shadow-xs)] hover:-translate-y-[1px] hover:border-[var(--border-strong)] hover:bg-[var(--surface-muted-bg)] hover:shadow-[var(--shadow-sm)]",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border",
          isSelected
            ? "border-[color-mix(in_srgb,var(--accent-on-fill)_28%,transparent)] bg-[color-mix(in_srgb,var(--accent-on-fill)_14%,transparent)] text-[var(--accent-on-fill)]"
            : "border-[var(--border)] bg-[var(--surface-muted-bg)] text-[var(--text-secondary)]",
        ].join(" ")}
      >
        <AppIcon icon={icon} size={15} />
      </span>
      <span>{props.label}</span>
    </button>
  );
}

"use client";

import { useState } from "react";
import AppIcon from "@/components/ui/app-icon";
import type { LessonSection } from "@/components/admin/lesson-builder/lesson-builder-types";

export const VARIANT_VISIBILITY_OPTIONS = [
  { value: "shared", label: "Shared", short: "S", tone: "muted" as const },
  {
    value: "foundation_only",
    label: "Foundation only",
    short: "F",
    tone: "info" as const,
  },
  {
    value: "higher_only",
    label: "Higher only",
    short: "H",
    tone: "warning" as const,
  },
  {
    value: "volna_only",
    label: "Volna only",
    short: "V",
    tone: "success" as const,
  },
] as const;

export function getVariantVisibilityMeta(value: LessonSection["variant_visibility"]) {
  return (
    VARIANT_VISIBILITY_OPTIONS.find((option) => option.value === value) ?? {
      value,
      label: value,
      short: value,
      tone: "muted" as const,
    }
  );
}

export function SidebarIconButton(props: {
  children: React.ReactNode;
  ariaLabel: string;
  title: string;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={props.type ?? "submit"}
      aria-label={props.ariaLabel}
      title={props.title}
      disabled={props.disabled}
      className={[
        "flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-primary)] shadow-[0_1px_2px_rgba(16,32,51,0.04)] transition-[background-color,border-color,box-shadow] hover:border-[var(--border-strong)] hover:bg-[var(--background-muted)] disabled:opacity-50",
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {props.children}
    </button>
  );
}

export function SidebarDisclosure(props: {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  count?: number;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(props.defaultOpen ?? false);

  return (
    <div className="overflow-hidden rounded-[1rem] border border-[var(--border)] bg-[var(--background-elevated)] shadow-[0_1px_2px_rgba(16,32,51,0.04)]">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-start justify-between gap-3 px-3 py-3 text-left transition hover:bg-[var(--background-muted)]/45"
        aria-expanded={isOpen}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {props.title}
            </span>
            {typeof props.count === "number" ? (
              <span className="rounded-full border border-[var(--border)] bg-[var(--background-muted)] px-2 py-0.5 text-[11px] text-[var(--text-secondary)]">
                {props.count}
              </span>
            ) : null}
          </div>

          {props.description ? (
            <div className="mt-1 text-xs app-text-muted">{props.description}</div>
          ) : null}
        </div>

        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background-muted)] text-[var(--text-secondary)]">
          <AppIcon icon={isOpen ? "down" : "next"} size={14} />
        </span>
      </button>

      {isOpen ? (
        <div className="border-t border-[var(--border)] px-3 pb-3 pt-3">
          {props.children}
        </div>
      ) : null}
    </div>
  );
}

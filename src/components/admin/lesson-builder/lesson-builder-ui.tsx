"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import PanelCard from "@/components/ui/panel-card";
import BadgePrimitive from "@/components/ui/badge";
import type { RouteFields } from "@/components/admin/lesson-builder/lesson-builder-types";

export const BUILDER_FIELD_CLASS =
  "w-full rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] shadow-[0_1px_2px_rgba(16,32,51,0.04),0_8px_18px_rgba(16,32,51,0.04)] transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-[var(--text-muted)] hover:border-[var(--border-strong)] focus:border-[var(--brand-blue)] focus:outline-none focus:ring-4 focus:ring-[rgba(37,99,235,0.12)]";

export const BUILDER_TEXTAREA_CLASS = BUILDER_FIELD_CLASS;

export const BUILDER_SELECT_CLASS = BUILDER_FIELD_CLASS;

export const BUILDER_SECONDARY_BUTTON_CLASS =
  "inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-2 text-sm font-medium text-[var(--text-primary)] shadow-[0_1px_2px_rgba(16,32,51,0.04)] transition-[background-color,border-color,box-shadow,transform] duration-200 hover:border-[var(--border-strong)] hover:bg-[var(--background-muted)] hover:shadow-[0_10px_20px_rgba(16,32,51,0.06)] disabled:cursor-not-allowed disabled:opacity-60";

export const BUILDER_PRIMARY_BUTTON_CLASS =
  "app-focus-ring inline-flex items-center justify-center rounded-xl border border-transparent bg-[linear-gradient(135deg,#3b82f6_0%,#2563eb_58%,#1d4ed8_100%)] px-3.5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(37,99,235,0.22),0_3px_8px_rgba(37,99,235,0.12)] transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-[1px] hover:brightness-[1.05] hover:shadow-[0_16px_34px_rgba(37,99,235,0.28),0_5px_12px_rgba(37,99,235,0.16)] disabled:cursor-not-allowed disabled:opacity-60";

export const BUILDER_DASHED_EMPTY_STATE_CLASS =
  "rounded-2xl border border-dashed border-[var(--border)] bg-[linear-gradient(180deg,var(--background-elevated)_0%,var(--background-muted)_100%)] px-4 py-6 text-sm app-text-muted";

export const BUILDER_MUTED_INFO_BOX_CLASS =
  "rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/55 px-4 py-3 text-sm text-[var(--text-secondary)]";

export function BuilderHiddenFields(props: RouteFields) {
  return (
    <>
      <input type="hidden" name="courseId" value={props.courseId} />
      <input type="hidden" name="variantId" value={props.variantId} />
      <input type="hidden" name="moduleId" value={props.moduleId} />
      <input type="hidden" name="lessonId" value={props.lessonId} />
      <input type="hidden" name="courseSlug" value={props.courseSlug} />
      <input type="hidden" name="variantSlug" value={props.variantSlug} />
      <input type="hidden" name="moduleSlug" value={props.moduleSlug} />
      <input type="hidden" name="lessonSlug" value={props.lessonSlug} />
    </>
  );
}

export function buildLessonBuilderRouteFormData(
  routeFields: RouteFields,
  extraFields?: Record<string, string>
) {
  const formData = new FormData();

  formData.set("courseId", routeFields.courseId);
  formData.set("variantId", routeFields.variantId);
  formData.set("moduleId", routeFields.moduleId);
  formData.set("lessonId", routeFields.lessonId);
  formData.set("courseSlug", routeFields.courseSlug);
  formData.set("variantSlug", routeFields.variantSlug);
  formData.set("moduleSlug", routeFields.moduleSlug);
  formData.set("lessonSlug", routeFields.lessonSlug);

  if (extraFields) {
    for (const [key, value] of Object.entries(extraFields)) {
      formData.set(key, value);
    }
  }

  return formData;
}

export function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "success" | "muted" | "warning" | "info";
}) {
  const mappedTone =
    tone === "success"
      ? "success"
      : tone === "warning"
        ? "warning"
        : tone === "muted"
          ? "muted"
          : tone === "info"
            ? "info"
            : "default";

  return <BadgePrimitive tone={mappedTone}>{children}</BadgePrimitive>;
}

export function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <PanelCard
      title={title}
      description={description}
      tone="default"
      density="compact"
      contentClassName="space-y-4"
    >
      {children}
    </PanelCard>
  );
}

export function ConfirmSubmitButton({
  children,
  confirmMessage,
  className,
}: {
  children: React.ReactNode;
  confirmMessage: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        const confirmed = window.confirm(confirmMessage);
        if (!confirmed) event.preventDefault();
      }}
      className={className}
    >
      {children}
    </button>
  );
}

export function DragHandle({
  label,
  tone = "default",
}: {
  label?: string;
  tone?: "default" | "active";
}) {
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-medium ${
        tone === "active"
          ? "border-[rgba(37,99,235,0.18)] bg-[var(--info-soft)] text-[var(--info)]"
          : "border-[var(--border)] bg-[var(--background-muted)] text-[var(--text-muted)]"
      }`}
      aria-hidden="true"
      title={label}
    >
      <span className="tracking-tight">⋮⋮</span>
      {label ? <span>{label}</span> : null}
    </div>
  );
}

export function ToolbarButton({
  children,
  onClick,
  isActive = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium transition ${
        isActive
          ? "border-[var(--brand-blue)] bg-[var(--brand-blue)] text-white shadow-[0_10px_22px_rgba(37,99,235,0.18)]"
          : "border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-primary)] shadow-[0_1px_2px_rgba(16,32,51,0.04)] hover:border-[var(--border-strong)] hover:bg-[var(--background-muted)]"
      }`}
    >
      {children}
    </button>
  );
}

export function PendingSubmitButton({
  idleLabel,
  pendingLabel,
  className,
}: {
  idleLabel: string;
  pendingLabel: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}

export function PendingStatusText({
  idleText,
  pendingText,
}: {
  idleText?: string;
  pendingText: string;
}) {
  const { pending } = useFormStatus();

  return (
    <div className="text-xs app-text-soft">
      {pending ? pendingText : (idleText ?? "")}
    </div>
  );
}

export function CompactDisclosure({
  title,
  description,
  children,
  defaultOpen = false,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-[var(--background-elevated)] shadow-[0_1px_2px_rgba(16,32,51,0.04),0_8px_18px_rgba(16,32,51,0.04)] [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="cursor-pointer select-none px-5 py-4 transition hover:bg-[var(--background-muted)]">
        <div className="font-semibold text-[var(--text-primary)]">{title}</div>
        {description ? (
          <div className="mt-1 text-sm app-text-muted">{description}</div>
        ) : null}
      </summary>

      <div className="border-t border-[var(--border)] p-5">{children}</div>
    </details>
  );
}

export function MiniStatPill({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--background-muted)] px-2.5 py-1 text-xs text-[var(--text-secondary)]">
      <span className="font-medium text-[var(--text-primary)]">{value}</span>
      <span>{label}</span>
    </span>
  );
}

export function usePersistentBoolean(key: string, defaultValue: boolean) {
  const [value, setValue] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return defaultValue;
    }

    const stored = window.localStorage.getItem(key);
    if (stored === "true") return true;
    if (stored === "false") return false;
    return defaultValue;
  });

  return [value, setValue] as const;
}

export function getLessonBuilderStorageKey(lessonId: string, suffix: string) {
  return `lesson-builder:${lessonId}:${suffix}`;
}

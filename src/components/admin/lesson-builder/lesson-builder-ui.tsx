"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import type { RouteFields } from "@/components/admin/lesson-builder/lesson-builder-types";

export const BUILDER_FIELD_CLASS =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-2 text-sm";

export const BUILDER_TEXTAREA_CLASS = BUILDER_FIELD_CLASS;

export const BUILDER_SELECT_CLASS = BUILDER_FIELD_CLASS;

export const BUILDER_SECONDARY_BUTTON_CLASS =
  "rounded-lg border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-2 text-sm transition hover:bg-[var(--background-muted)] disabled:opacity-60";

export const BUILDER_PRIMARY_BUTTON_CLASS =
  "app-btn-base app-btn-primary rounded-lg px-3 py-2 text-sm disabled:opacity-60";

export const BUILDER_DASHED_EMPTY_STATE_CLASS =
  "rounded-xl border border-dashed border-[var(--border)] px-4 py-6 text-sm app-text-muted";

export const BUILDER_MUTED_INFO_BOX_CLASS =
  "rounded-xl border border-[var(--border)] bg-[var(--background-muted)]/50 px-3 py-3 text-sm";

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
  tone?: "default" | "success" | "muted" | "warning";
}) {
  const classes =
    tone === "success"
      ? "border-green-200 bg-green-50 text-green-700"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : tone === "muted"
          ? "border-[var(--border)] bg-[var(--background-muted)] text-[var(--text-muted)]"
          : "border-blue-200 bg-[var(--info-soft)] text-[var(--info)]";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${classes}`}
    >
      {children}
    </span>
  );
}

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="app-card p-4">
      <div className="text-xs uppercase tracking-wide app-text-soft">{label}</div>
      <div className="mt-1 text-lg font-semibold text-[var(--text-primary)]">{value}</div>
    </div>
  );
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
    <section className="app-card">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h3 className="font-semibold text-[var(--text-primary)]">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm app-text-muted">{description}</p>
        ) : null}
      </div>

      <div className="p-5">{children}</div>
    </section>
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
  label: string;
  tone?: "default" | "active";
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1 text-[11px] ${
        tone === "active"
          ? "border-blue-300 bg-[var(--info-soft)] text-[var(--info)]"
          : "border-[var(--border)] bg-[var(--background-muted)] text-[var(--text-muted)]"
      }`}
      aria-hidden="true"
    >
      <span className="tracking-tight">⋮⋮</span>
      <span>{label}</span>
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
      className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
        isActive
          ? "border-[var(--brand-blue)] bg-[var(--brand-blue)] text-white"
          : "border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-primary)] hover:bg-[var(--background-muted)]"
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
      className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] shadow-sm [&_summary::-webkit-details-marker]:hidden"
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

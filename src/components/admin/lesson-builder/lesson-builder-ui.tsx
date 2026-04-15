"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import type { RouteFields } from "@/components/admin/lesson-builder/lesson-builder-types";

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
          ? "border-gray-200 bg-gray-50 text-gray-600"
          : "border-blue-200 bg-blue-50 text-blue-700";

  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${classes}`}>
      {children}
    </span>
  );
}

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-gray-900">{value}</div>
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
    <section className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-4 py-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {description ? <p className="mt-1 text-sm text-gray-600">{description}</p> : null}
      </div>
      <div className="p-4">{children}</div>
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
      className={`inline-flex items-center gap-2 rounded-lg border px-2 py-1 text-[11px] ${
        tone === "active"
          ? "border-blue-300 bg-blue-50 text-blue-700"
          : "border-gray-200 bg-gray-50 text-gray-500"
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
      className={`rounded-lg border px-3 py-2 text-sm transition ${
        isActive ? "border-black bg-black text-white" : "bg-white hover:bg-gray-50"
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
    <div className="text-xs text-gray-500">
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
      className="rounded-2xl border bg-white shadow-sm [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="cursor-pointer select-none px-4 py-4 hover:bg-gray-50">
        <div className="font-semibold text-gray-900">{title}</div>
        {description ? (
          <div className="mt-1 text-sm text-gray-600">{description}</div>
        ) : null}
      </summary>
      <div className="border-t p-4">{children}</div>
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
    <span className="inline-flex items-center gap-1 rounded-full border bg-gray-50 px-2.5 py-1 text-xs text-gray-700">
      <span className="font-medium">{value}</span>
      <span>{label}</span>
    </span>
  );
}

export function usePersistentBoolean(key: string, defaultValue: boolean) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const stored = window.localStorage.getItem(key);
    if (stored === "true") setValue(true);
    else if (stored === "false") setValue(false);
  }, [key]);

  useEffect(() => {
    window.localStorage.setItem(key, String(value));
  }, [key, value]);

  return [value, setValue] as const;
}

export function getLessonBuilderStorageKey(lessonId: string, suffix: string) {
  return `lesson-builder:${lessonId}:${suffix}`;
}

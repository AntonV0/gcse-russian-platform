"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { useFormStatus } from "react-dom";
import PanelCard from "@/components/ui/panel-card";
import BadgePrimitive from "@/components/ui/badge";
import AppIcon from "@/components/ui/app-icon";
import Button from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import type { ButtonSize, ButtonVariant } from "@/components/ui/button-styles";
import type { RouteFields } from "@/components/admin/lesson-builder/lesson-builder-types";
import type { AppIconKey } from "@/lib/shared/icons";

const LESSON_BUILDER_STORAGE_EVENT = "gcse-russian-lesson-builder-storage";

export const BUILDER_FIELD_CLASS =
  "app-form-control app-form-input";

export const BUILDER_TEXTAREA_CLASS = "app-form-control app-form-textarea";

export const BUILDER_SELECT_CLASS = "app-form-control app-form-select";

export const BUILDER_SECONDARY_BUTTON_CLASS =
  "app-btn-base app-btn-secondary min-h-9 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60";

export const BUILDER_PRIMARY_BUTTON_CLASS =
  "app-btn-base app-btn-primary min-h-10 px-3.5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60";

export const BUILDER_DASHED_EMPTY_STATE_CLASS =
  "rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] bg-[var(--surface-muted-bg)] px-4 py-6 text-sm app-text-muted";

export const BUILDER_MUTED_INFO_BOX_CLASS =
  "rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-muted-bg)] px-4 py-3 text-sm text-[var(--text-secondary)]";

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
  icon,
}: {
  children: React.ReactNode;
  tone?: "default" | "success" | "muted" | "warning" | "info";
  icon?: AppIconKey;
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

  return (
    <BadgePrimitive tone={mappedTone} icon={icon}>
      {children}
    </BadgePrimitive>
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
    <Button
      type="submit"
      variant="danger"
      className={className}
      onClick={(event) => {
        const confirmed = window.confirm(confirmMessage);
        if (!confirmed) event.preventDefault();
      }}
    >
      {children}
    </Button>
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
          ? "border-[var(--info-border)] bg-[var(--info-surface)] text-[var(--info-text)]"
          : "border-[var(--border)] bg-[var(--background-muted)] text-[var(--text-muted)]"
      }`}
      aria-hidden="true"
      title={label}
    >
      <AppIcon icon="reorder" size={13} />
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
    <Button
      type="button"
      onClick={onClick}
      variant={isActive ? "primary" : "secondary"}
      size="sm"
    >
      {children}
    </Button>
  );
}

function getPendingButtonVariant(className?: string): ButtonVariant {
  return className?.includes("app-btn-primary") ? "primary" : "secondary";
}

function getPendingButtonSize(className?: string): ButtonSize {
  return className?.includes("min-h-10") ? "md" : "sm";
}

function getPendingButtonClassName(className?: string) {
  return className
    ?.split(" ")
    .filter(
      (item) =>
        item &&
        item !== "app-btn-base" &&
        item !== "app-btn-primary" &&
        item !== "app-btn-secondary" &&
        !item.startsWith("disabled:")
    )
    .join(" ");
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
  return (
    <LoadingButton
      idleLabel={idleLabel}
      pendingLabel={pendingLabel}
      variant={getPendingButtonVariant(className)}
      size={getPendingButtonSize(className)}
      className={getPendingButtonClassName(className)}
    />
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
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="app-card overflow-hidden">
      {/* HEADER */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left transition hover:bg-[var(--background-muted)]/45"
      >
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[var(--text-primary)]">{title}</div>

          {description ? (
            <div className="mt-1 text-sm app-text-muted">{description}</div>
          ) : null}
        </div>

        {/* ICON */}
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background-muted)] text-[var(--text-secondary)]">
          <AppIcon icon={isOpen ? "down" : "next"} size={16} />
        </span>
      </button>

      {/* CONTENT */}
      {isOpen ? (
        <div className="border-t border-[var(--border)] px-5 py-4">{children}</div>
      ) : null}
    </div>
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
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener("storage", callback);
    window.addEventListener(LESSON_BUILDER_STORAGE_EVENT, callback);

    return () => {
      window.removeEventListener("storage", callback);
      window.removeEventListener(LESSON_BUILDER_STORAGE_EVENT, callback);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    return window.localStorage.getItem(key);
  }, [key]);

  const storedValue = useSyncExternalStore(subscribe, getSnapshot, () => null);

  const value =
    storedValue === "true" ? true : storedValue === "false" ? false : defaultValue;

  const setValue = useCallback(
    (nextValue: boolean | ((currentValue: boolean) => boolean)) => {
      const resolvedValue =
        typeof nextValue === "function" ? nextValue(value) : nextValue;

      window.localStorage.setItem(key, String(resolvedValue));
      window.dispatchEvent(new Event(LESSON_BUILDER_STORAGE_EVENT));
    },
    [key, value]
  );

  return [value, setValue] as const;
}

export function getLessonBuilderStorageKey(lessonId: string, suffix: string) {
  return `lesson-builder:${lessonId}:${suffix}`;
}

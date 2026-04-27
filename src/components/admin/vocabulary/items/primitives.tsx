import type { ReactNode } from "react";

export function VocabularyAdminFormField({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block app-label">
        {label}
      </label>

      {hint ? <p className="app-text-body-muted">{hint}</p> : null}

      {children}
    </div>
  );
}

export function VocabularyAdminStatTile({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-[var(--background-muted)] px-4 py-3">
      <div className="app-text-meta">{label}</div>
      <div className="mt-1.5 font-semibold app-text-detail">{value}</div>
    </div>
  );
}

export function VocabularyAdminDisclosurePanel({
  title,
  description,
  children,
  defaultOpen = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="group rounded-2xl border border-[var(--border)] bg-[var(--background)]"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-4 py-3">
        <span>
          <span className="block app-heading-card">{title}</span>
          {description ? (
            <span className="mt-1 block app-text-body-muted">{description}</span>
          ) : null}
        </span>
        <span className="font-semibold app-text-caption group-open:hidden">Open</span>
        <span className="hidden font-semibold app-text-caption group-open:inline">
          Close
        </span>
      </summary>

      <div className="border-t border-[var(--border)] px-4 py-4">{children}</div>
    </details>
  );
}

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
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-[var(--text-primary)]"
      >
        {label}
      </label>

      {hint ? (
        <p className="text-sm leading-6 text-[var(--text-secondary)]">{hint}</p>
      ) : null}

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
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] app-text-soft">
        {label}
      </div>
      <div className="mt-1.5 text-base font-semibold text-[var(--text-primary)]">
        {value}
      </div>
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
          <span className="block text-sm font-semibold text-[var(--text-primary)]">
            {title}
          </span>
          {description ? (
            <span className="mt-1 block text-sm leading-6 text-[var(--text-secondary)]">
              {description}
            </span>
          ) : null}
        </span>
        <span className="text-sm font-semibold text-[var(--text-secondary)] group-open:hidden">
          Open
        </span>
        <span className="hidden text-sm font-semibold text-[var(--text-secondary)] group-open:inline">
          Close
        </span>
      </summary>

      <div className="border-t border-[var(--border)] px-4 py-4">{children}</div>
    </details>
  );
}

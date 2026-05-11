import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import AppIcon from "@/components/ui/app-icon";
import Button from "@/components/ui/button";
import type { AppIconKey } from "@/lib/shared/icons";

export function AdminActionMenu({
  label = "More",
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <details className="relative w-full">
      <summary className="app-focus-ring inline-flex w-full cursor-pointer list-none items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] shadow-sm transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]">
        <span className="shrink-0">
          <AppIcon icon="menu" size={16} />
        </span>
        {label}
      </summary>
      <div className="absolute right-0 z-20 mt-2 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-1.5 shadow-xl">
        <div className="grid gap-1">{children}</div>
      </div>
    </details>
  );
}

export function AdminActionMenuItem({
  href,
  icon,
  children,
}: {
  href: string;
  icon: AppIconKey;
  children: React.ReactNode;
}) {
  return (
    <Button
      href={href}
      variant="quiet"
      size="sm"
      icon={icon}
      className="w-full justify-start"
    >
      {children}
    </Button>
  );
}

export function AdminActionMenuConfirmItem({
  action,
  hiddenFields,
  confirmMessage,
  disabled,
  disabledReason,
  children,
}: {
  action: (formData: FormData) => void | Promise<void>;
  hiddenFields: Record<string, string>;
  confirmMessage: string;
  disabled?: boolean;
  disabledReason?: string | null;
  children: React.ReactNode;
}) {
  return (
    <form action={action} className="grid">
      {Object.entries(hiddenFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <AdminConfirmButton
        variant="danger"
        size="sm"
        icon="delete"
        disabled={disabled}
        title={disabledReason ?? undefined}
        className="w-full justify-start"
        confirmMessage={confirmMessage}
      >
        {children}
      </AdminConfirmButton>
      {disabledReason ? (
        <p className="px-2 pt-1 app-text-caption">{disabledReason}</p>
      ) : null}
    </form>
  );
}

import AppIcon from "@/components/ui/app-icon";
import type { AppIconKey } from "@/lib/shared/icons";

type SelectableCardButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "type"
> & {
  active: boolean;
  label: string;
  description?: string;
  icon?: AppIconKey;
  leadingVisual?: React.ReactNode;
  statusLabel?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function SelectableCardButton({
  active,
  label,
  description,
  icon,
  leadingVisual,
  statusLabel,
  className,
  children,
  ...buttonProps
}: SelectableCardButtonProps) {
  const ariaPressed = buttonProps["aria-pressed"] ?? active;

  return (
    <button
      {...buttonProps}
      type="button"
      aria-pressed={ariaPressed}
      data-state={active ? "selected" : "idle"}
      className={[
        "app-focus-ring app-card-interaction-subtle rounded-[var(--radius-card)] border p-4 text-left",
        active
          ? "app-selected-surface"
          : "border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-primary)] hover:border-[var(--border-strong)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="flex items-start gap-3">
        {leadingVisual ?? (
          <span
            className={[
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-control)] border",
              active
                ? "border-[var(--surface-selected-border)] bg-[var(--surface-selected-icon-bg)] text-[var(--surface-selected-text)]"
                : "border-[var(--border)] bg-[var(--background-muted)]",
            ].join(" ")}
          >
            {icon ? <AppIcon icon={icon} size={18} /> : null}
          </span>
        )}

        <span className="min-w-0 space-y-1">
          <span className="block text-sm font-semibold">{label}</span>
          {description ? (
            <span
              className={[
                "block text-xs leading-5",
                active ? "text-[var(--accent-on-soft)]" : "app-text-muted",
              ].join(" ")}
            >
              {description}
            </span>
          ) : null}
        </span>
      </span>

      {children}

      {statusLabel ? (
        <span
          className={[
            "mt-4 inline-flex rounded-[var(--radius-status-pill)] px-2.5 py-1 text-xs font-semibold",
            active
              ? "bg-[var(--accent-fill)] text-[var(--accent-on-fill)] shadow-[0_6px_14px_color-mix(in_srgb,var(--accent-border-ink)_14%,transparent)]"
              : "bg-[var(--background-muted)] text-[var(--text-secondary)]",
          ].join(" ")}
        >
          {statusLabel}
        </span>
      ) : null}
    </button>
  );
}

import type { DbPrice, UpgradeQuoteResolution } from "@/lib/billing/catalog";
import {
  formatRenewalDate,
  getUpgradeFeeLabel,
  getUpgradeMessage,
  getUpgradeSavings,
  type RenewalInfo,
} from "@/lib/billing/pricing-ui";

export function OwnedButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      disabled
      className="inline-flex w-full items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-secondary)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] opacity-90"
    >
      {label}
    </button>
  );
}

export function LockedOption({ label, message }: { label: string; message: string }) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled
        className="inline-flex w-full items-center justify-center rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--surface-secondary)]/75 px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] opacity-85"
      >
        {label}
      </button>

      <p className="text-xs leading-5 text-[var(--text-secondary)]">{message}</p>
    </div>
  );
}

export function DiscountBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[rgba(37,99,235,0.12)] px-2.5 py-1 text-[11px] font-semibold text-[var(--brand-blue)]">
      {label}
    </span>
  );
}

export function DiscountBadgeRow({
  quote,
  targetPrice,
}: {
  quote: UpgradeQuoteResolution | null;
  targetPrice: DbPrice | null;
}) {
  const savings = getUpgradeSavings(quote, targetPrice);

  if (!savings) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DiscountBadge label="Student discount" />
      <DiscountBadge label={`Save ${savings.percent}%`} />
    </div>
  );
}

export function RenewalMessage({ renewal }: { renewal: RenewalInfo | null }) {
  if (!renewal?.currentPeriodEnd || !renewal.amountLabel) {
    return null;
  }

  const formattedDate = formatRenewalDate(renewal.currentPeriodEnd);

  if (!formattedDate) {
    return null;
  }

  return (
    <p className="text-xs leading-5 text-[var(--text-secondary)]">
      Renews on{" "}
      <span className="font-medium text-[var(--text-primary)]">{formattedDate}</span> at{" "}
      <span className="font-medium text-[var(--text-primary)]">
        {renewal.amountLabel}
      </span>
    </p>
  );
}

export function ActionGroup({
  title,
  children,
  variant = "default",
}: {
  title?: string;
  children: React.ReactNode;
  variant?: "default" | "compact" | "highlight";
}) {
  const classes =
    variant === "compact"
      ? "space-y-2.5"
      : variant === "highlight"
        ? "space-y-3 rounded-xl border border-[rgba(37,99,235,0.16)] bg-[rgba(37,99,235,0.04)] p-3"
        : "space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-primary)]/40 p-3";

  return (
    <div className={classes}>
      {title ? (
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
          {title}
        </p>
      ) : null}
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

export function UpgradeOffer({
  quote,
  targetPrice,
  targetStandardLabel,
  children,
}: {
  quote: UpgradeQuoteResolution | null;
  targetPrice: DbPrice | null;
  targetStandardLabel: string;
  children: React.ReactNode;
}) {
  const savings = getUpgradeSavings(quote, targetPrice);
  const upgradeMessage = getUpgradeMessage(quote, targetStandardLabel);

  return (
    <div className="space-y-2.5 rounded-xl border border-[rgba(37,99,235,0.16)] bg-[rgba(37,99,235,0.04)] p-3">
      <DiscountBadgeRow quote={quote} targetPrice={targetPrice} />
      {children}
      {savings ? (
        <p className="text-xs leading-5 text-[var(--text-secondary)]">
          Save{" "}
          <span className="font-semibold text-[var(--text-primary)]">
            £{savings.saved}
          </span>{" "}
          compared to full price
        </p>
      ) : null}
      <p className="text-xs leading-5 text-[var(--text-secondary)]">{upgradeMessage}</p>
    </div>
  );
}

export { getUpgradeFeeLabel };

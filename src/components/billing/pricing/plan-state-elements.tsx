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
      className="inline-flex w-full items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-secondary)] px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] opacity-80"
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
        className="inline-flex w-full items-center justify-center rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--surface-secondary)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] opacity-80"
      >
        {label}
      </button>

      <p className="text-xs text-[var(--text-secondary)]">{message}</p>
    </div>
  );
}

export function DiscountBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[rgba(37,99,235,0.1)] px-3 py-1 text-xs font-semibold text-[var(--brand-blue)]">
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
      <DiscountBadge label="Current student discount" />
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
    <p className="text-xs text-[var(--text-secondary)]">
      Renews on {formattedDate} at {renewal.amountLabel}
    </p>
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
    <>
      <DiscountBadgeRow quote={quote} targetPrice={targetPrice} />
      {children}
      {savings ? (
        <p className="text-xs text-[var(--text-secondary)]">
          Save £{savings.saved} compared to full price
        </p>
      ) : null}
      <p className="text-xs text-[var(--text-secondary)]">{upgradeMessage}</p>
    </>
  );
}

export { getUpgradeFeeLabel };

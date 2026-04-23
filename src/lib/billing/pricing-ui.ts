import {
  BILLING_TYPES,
  INTERVAL_UNITS,
  type DbPrice,
  type UpgradeQuoteResolution,
} from "@/lib/billing/catalog";

export type SubscriptionPriceLike = {
  amount_gbp: number;
  billing_type: string;
  interval_unit: string | null;
  interval_count: number | null;
};

export type PlanPricing = {
  monthly: DbPrice | null;
  threeMonth: DbPrice | null;
  lifetime: DbPrice | null;
};

export type RenewalInfo = {
  currentPeriodEnd: string | null;
  amountLabel: string | null;
};

export type UpgradeSavings = {
  saved: number;
  percent: number;
};

export function formatPriceLabel(
  price: DbPrice | SubscriptionPriceLike | null
): string | null {
  if (!price) return null;

  const formattedAmount = `£${price.amount_gbp}`;

  if (price.billing_type === BILLING_TYPES.SUBSCRIPTION) {
    if (price.interval_unit === INTERVAL_UNITS.MONTH) {
      const count = price.interval_count ?? 1;

      if (count === 1) {
        return `${formattedAmount}/month`;
      }

      return `${formattedAmount}/${count} months`;
    }

    if (price.interval_unit === INTERVAL_UNITS.YEAR) {
      const count = price.interval_count ?? 1;

      if (count === 1) {
        return `${formattedAmount}/year`;
      }

      return `${formattedAmount}/${count} years`;
    }
  }

  return formattedAmount;
}

export function getFromPriceLabel(pricing: PlanPricing): string {
  const labels = [
    formatPriceLabel(pricing.monthly),
    formatPriceLabel(pricing.threeMonth),
    formatPriceLabel(pricing.lifetime),
  ].filter(Boolean) as string[];

  if (labels.length === 0) {
    return "Pricing unavailable";
  }

  return `From ${labels[0]}`;
}

export function getUpgradeFeeLabel(quote: UpgradeQuoteResolution | null): string | null {
  if (!quote?.eligible || quote.upgradeFeeAmountGbp == null) {
    return null;
  }

  return `£${quote.upgradeFeeAmountGbp}`;
}

export function getUpgradeSavings(
  quote: UpgradeQuoteResolution | null,
  targetPrice: DbPrice | null
): UpgradeSavings | null {
  if (!quote?.eligible || !targetPrice || quote.upgradeFeeAmountGbp == null) {
    return null;
  }

  const standard = targetPrice.amount_gbp;
  const upgrade = quote.upgradeFeeAmountGbp;

  if (standard <= upgrade) {
    return null;
  }

  const saved = standard - upgrade;
  const percent = Math.round((saved / standard) * 100);

  return { saved, percent };
}

export function formatRenewalDate(value: string | null): string | null {
  if (!value) return null;

  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getUpgradeMessage(
  quote: UpgradeQuoteResolution | null,
  targetStandardLabel: string
): string {
  if (!quote?.eligible || !quote.upgradeFlow) {
    return "";
  }

  if (quote.upgradeFlow === "same_cadence") {
    return `Pay a fixed upgrade fee now. Your access switches immediately and renews at ${targetStandardLabel} on your existing billing date.`;
  }

  if (quote.upgradeFlow === "monthly_to_three_month") {
    return `Pay a fixed upgrade fee now. Your access switches immediately and your new 3-month period keeps your original monthly start date as the anchor.`;
  }

  if (quote.upgradeFlow === "lifetime") {
    return "Lifetime upgrade is a one-time payment and activates access immediately.";
  }

  return "";
}

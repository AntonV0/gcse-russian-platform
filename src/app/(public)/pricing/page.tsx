import Link from "next/link";
import Badge from "@/components/ui/badge";
import AppIcon from "@/components/ui/app-icon";
import CheckoutButton from "@/components/billing/checkout-button";
import { getCurrentUser } from "@/lib/auth/auth";
import { createClient } from "@/lib/supabase/server";
import {
  BILLING_TYPES,
  INTERVAL_UNITS,
  PRODUCT_CODES,
  getActivePricesForProductDb,
  getActiveProductByCodeDb,
  matchPriceByBillingShape,
  resolveUpgradeQuoteDb,
  type DbPrice,
  type UpgradeQuoteResolution,
} from "@/lib/billing/catalog";

type PlanCardProps = {
  title: string;
  subtitle: string;
  priceLabel: string;
  features: string[];
  tone?: "default" | "highlight";
  children: React.ReactNode;
};

type PlanPricing = {
  monthly: DbPrice | null;
  threeMonth: DbPrice | null;
  lifetime: DbPrice | null;
};

type ActiveGrantProductCode =
  | typeof PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION
  | typeof PRODUCT_CODES.GCSE_RUSSIAN_HIGHER;

type ActivePlanState = {
  ownedProductCodes: Set<ActiveGrantProductCode>;
  foundationMonthly: boolean;
  foundationThreeMonth: boolean;
  foundationLifetime: boolean;
  higherMonthly: boolean;
  higherThreeMonth: boolean;
  higherLifetime: boolean;
};

type GrantRow = {
  product_id: string;
  price_id: string | null;
};

type ProductRow = {
  id: string;
  code: string;
};

type PriceRow = {
  id: string;
  billing_type: string;
  interval_unit: string | null;
  interval_count: number | null;
};

function PlanCard({
  title,
  subtitle,
  priceLabel,
  features,
  tone = "default",
  children,
}: PlanCardProps) {
  const isHighlight = tone === "highlight";

  return (
    <div
      className={[
        "app-card app-section-padding flex h-full flex-col",
        isHighlight ? "ring-2 ring-[color:var(--brand-blue)] shadow-lg" : "",
      ].join(" ")}
    >
      <div className="mb-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2>

          {isHighlight ? (
            <Badge tone="info" icon="star">
              Best for exam prep
            </Badge>
          ) : null}
        </div>

        <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>

        <div>
          <p className="text-3xl font-bold text-[var(--text-primary)]">{priceLabel}</p>
        </div>
      </div>

      <ul className="mb-6 space-y-3 text-sm text-[var(--text-secondary)]">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className="mt-0.5 text-[var(--brand-blue)]">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">{children}</div>
    </div>
  );
}

function formatPriceLabel(price: DbPrice | null): string | null {
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

function getFromPriceLabel(pricing: PlanPricing): string {
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

async function getPlanPricing(productCode: string): Promise<PlanPricing> {
  const product = await getActiveProductByCodeDb(productCode);

  if (!product) {
    return {
      monthly: null,
      threeMonth: null,
      lifetime: null,
    };
  }

  const prices = await getActivePricesForProductDb(product.id);

  return {
    monthly: matchPriceByBillingShape(
      prices,
      BILLING_TYPES.SUBSCRIPTION,
      INTERVAL_UNITS.MONTH,
      1
    ),
    threeMonth: matchPriceByBillingShape(
      prices,
      BILLING_TYPES.SUBSCRIPTION,
      INTERVAL_UNITS.MONTH,
      3
    ),
    lifetime: matchPriceByBillingShape(prices, BILLING_TYPES.ONE_TIME, null, null),
  };
}

async function getActivePlanStateForUser(userId: string): Promise<ActivePlanState> {
  const supabase = await createClient();

  const { data: grants, error } = await supabase
    .from("user_access_grants")
    .select("product_id, price_id")
    .eq("user_id", userId)
    .eq("is_active", true);

  if (error || !grants || grants.length === 0) {
    return {
      ownedProductCodes: new Set(),
      foundationMonthly: false,
      foundationThreeMonth: false,
      foundationLifetime: false,
      higherMonthly: false,
      higherThreeMonth: false,
      higherLifetime: false,
    };
  }

  const typedGrants = grants as GrantRow[];
  const productIds = [...new Set(typedGrants.map((grant) => grant.product_id))];
  const priceIds = [
    ...new Set(typedGrants.map((grant) => grant.price_id).filter(Boolean)),
  ] as string[];

  const [{ data: products }, { data: prices }] = await Promise.all([
    supabase.from("products").select("id, code").in("id", productIds),
    priceIds.length > 0
      ? supabase
          .from("prices")
          .select("id, billing_type, interval_unit, interval_count")
          .in("id", priceIds)
      : Promise.resolve({ data: [] as PriceRow[] | null }),
  ]);

  const productMap = new Map<string, ProductRow>(
    ((products ?? []) as ProductRow[]).map((product) => [product.id, product])
  );

  const priceMap = new Map<string, PriceRow>(
    ((prices ?? []) as PriceRow[]).map((price) => [price.id, price])
  );

  const ownedProductCodes = new Set<ActiveGrantProductCode>();

  let foundationMonthly = false;
  let foundationThreeMonth = false;
  let foundationLifetime = false;
  let higherMonthly = false;
  let higherThreeMonth = false;
  let higherLifetime = false;

  for (const grant of typedGrants) {
    const product = productMap.get(grant.product_id);
    const price = grant.price_id ? priceMap.get(grant.price_id) : null;

    if (!product) continue;

    if (
      product.code === PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION ||
      product.code === PRODUCT_CODES.GCSE_RUSSIAN_HIGHER
    ) {
      ownedProductCodes.add(product.code);
    }

    if (!price) continue;

    const isMonthly =
      price.billing_type === BILLING_TYPES.SUBSCRIPTION &&
      price.interval_unit === INTERVAL_UNITS.MONTH &&
      (price.interval_count ?? 1) === 1;

    const isThreeMonth =
      price.billing_type === BILLING_TYPES.SUBSCRIPTION &&
      price.interval_unit === INTERVAL_UNITS.MONTH &&
      (price.interval_count ?? 1) === 3;

    const isLifetime = price.billing_type === BILLING_TYPES.ONE_TIME;

    if (product.code === PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION) {
      foundationMonthly = foundationMonthly || isMonthly;
      foundationThreeMonth = foundationThreeMonth || isThreeMonth;
      foundationLifetime = foundationLifetime || isLifetime;
    }

    if (product.code === PRODUCT_CODES.GCSE_RUSSIAN_HIGHER) {
      higherMonthly = higherMonthly || isMonthly;
      higherThreeMonth = higherThreeMonth || isThreeMonth;
      higherLifetime = higherLifetime || isLifetime;
    }
  }

  return {
    ownedProductCodes,
    foundationMonthly,
    foundationThreeMonth,
    foundationLifetime,
    higherMonthly,
    higherThreeMonth,
    higherLifetime,
  };
}

function OwnedButton({ label }: { label: string }) {
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

function LockedOption({ label, message }: { label: string; message: string }) {
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

function getUpgradeFeeLabel(quote: UpgradeQuoteResolution | null): string | null {
  if (!quote?.eligible || quote.upgradeFeeAmountGbp == null) {
    return null;
  }

  return `£${quote.upgradeFeeAmountGbp}`;
}

function getUpgradeMessage(
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
    if (quote.targetProduct?.code === PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION) {
      return "Lifetime upgrade is a one-time payment and activates Foundation lifetime access immediately.";
    }

    return "Lifetime upgrade is a one-time payment and activates Higher lifetime access immediately.";
  }

  return "";
}

export default async function PricingPage() {
  const user = await getCurrentUser();

  const [
    foundationPricing,
    higherPricing,
    planState,
    foundationMonthlyToThreeMonthQuote,
    foundationMonthlyToFoundationLifetimeQuote,
    foundationThreeMonthToFoundationLifetimeQuote,
    foundationMonthlyToHigherMonthlyQuote,
    foundationMonthlyToHigherThreeMonthQuote,
    foundationThreeMonthToHigherThreeMonthQuote,
    foundationLifetimeToHigherLifetimeQuote,
    higherMonthlyToThreeMonthQuote,
    higherMonthlyToHigherLifetimeQuote,
    higherThreeMonthToHigherLifetimeQuote,
  ] = await Promise.all([
    getPlanPricing(PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION),
    getPlanPricing(PRODUCT_CODES.GCSE_RUSSIAN_HIGHER),
    user
      ? getActivePlanStateForUser(user.id)
      : Promise.resolve({
          ownedProductCodes: new Set<ActiveGrantProductCode>(),
          foundationMonthly: false,
          foundationThreeMonth: false,
          foundationLifetime: false,
          higherMonthly: false,
          higherThreeMonth: false,
          higherLifetime: false,
        }),
    user
      ? resolveUpgradeQuoteDb(
          user.id,
          PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
          BILLING_TYPES.SUBSCRIPTION,
          INTERVAL_UNITS.MONTH,
          3
        )
      : Promise.resolve(null),
    user
      ? resolveUpgradeQuoteDb(
          user.id,
          PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
          BILLING_TYPES.ONE_TIME,
          null,
          null
        )
      : Promise.resolve(null),
    user
      ? resolveUpgradeQuoteDb(
          user.id,
          PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
          BILLING_TYPES.ONE_TIME,
          null,
          null
        )
      : Promise.resolve(null),
    user
      ? resolveUpgradeQuoteDb(
          user.id,
          PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
          BILLING_TYPES.SUBSCRIPTION,
          INTERVAL_UNITS.MONTH,
          1
        )
      : Promise.resolve(null),
    user
      ? resolveUpgradeQuoteDb(
          user.id,
          PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
          BILLING_TYPES.SUBSCRIPTION,
          INTERVAL_UNITS.MONTH,
          3
        )
      : Promise.resolve(null),
    user
      ? resolveUpgradeQuoteDb(
          user.id,
          PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
          BILLING_TYPES.SUBSCRIPTION,
          INTERVAL_UNITS.MONTH,
          3
        )
      : Promise.resolve(null),
    user
      ? resolveUpgradeQuoteDb(
          user.id,
          PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
          BILLING_TYPES.ONE_TIME,
          null,
          null
        )
      : Promise.resolve(null),
    user
      ? resolveUpgradeQuoteDb(
          user.id,
          PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
          BILLING_TYPES.SUBSCRIPTION,
          INTERVAL_UNITS.MONTH,
          3
        )
      : Promise.resolve(null),
    user
      ? resolveUpgradeQuoteDb(
          user.id,
          PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
          BILLING_TYPES.ONE_TIME,
          null,
          null
        )
      : Promise.resolve(null),
    user
      ? resolveUpgradeQuoteDb(
          user.id,
          PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
          BILLING_TYPES.ONE_TIME,
          null,
          null
        )
      : Promise.resolve(null),
  ]);

  const foundationMonthlyLabel =
    formatPriceLabel(foundationPricing.monthly) ?? "Monthly unavailable";
  const foundationThreeMonthLabel =
    formatPriceLabel(foundationPricing.threeMonth) ?? "3-month unavailable";
  const foundationLifetimeLabel =
    formatPriceLabel(foundationPricing.lifetime) ?? "Lifetime unavailable";

  const higherMonthlyStandardLabel =
    formatPriceLabel(higherPricing.monthly) ?? "Monthly unavailable";
  const higherThreeMonthStandardLabel =
    formatPriceLabel(higherPricing.threeMonth) ?? "3-month unavailable";
  const higherLifetimeStandardLabel =
    formatPriceLabel(higherPricing.lifetime) ?? "Lifetime unavailable";

  const foundationPriceLabel = getFromPriceLabel(foundationPricing);
  const higherPriceLabel = getFromPriceLabel(higherPricing);

  const canShowFoundationMonthlyToThreeMonthUpgrade =
    foundationMonthlyToThreeMonthQuote?.eligible &&
    foundationMonthlyToThreeMonthQuote.sourceProduct?.code ===
      PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION &&
    foundationMonthlyToThreeMonthQuote.sourcePrice?.billing_type ===
      BILLING_TYPES.SUBSCRIPTION &&
    (foundationMonthlyToThreeMonthQuote.sourcePrice?.interval_count ?? 1) === 1;

  const canShowFoundationMonthlyToFoundationLifetimeUpgrade =
    foundationMonthlyToFoundationLifetimeQuote?.eligible &&
    foundationMonthlyToFoundationLifetimeQuote.sourceProduct?.code ===
      PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION &&
    foundationMonthlyToFoundationLifetimeQuote.upgradeFlow === "lifetime" &&
    foundationMonthlyToFoundationLifetimeQuote.sourcePrice?.billing_type ===
      BILLING_TYPES.SUBSCRIPTION &&
    (foundationMonthlyToFoundationLifetimeQuote.sourcePrice?.interval_count ?? 1) === 1;

  const canShowFoundationThreeMonthToFoundationLifetimeUpgrade =
    foundationThreeMonthToFoundationLifetimeQuote?.eligible &&
    foundationThreeMonthToFoundationLifetimeQuote.sourceProduct?.code ===
      PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION &&
    foundationThreeMonthToFoundationLifetimeQuote.upgradeFlow === "lifetime" &&
    foundationThreeMonthToFoundationLifetimeQuote.sourcePrice?.billing_type ===
      BILLING_TYPES.SUBSCRIPTION &&
    (foundationThreeMonthToFoundationLifetimeQuote.sourcePrice?.interval_count ?? 1) ===
      3;

  const canShowHigherMonthlyToThreeMonthUpgrade =
    higherMonthlyToThreeMonthQuote?.eligible &&
    higherMonthlyToThreeMonthQuote.sourceProduct?.code ===
      PRODUCT_CODES.GCSE_RUSSIAN_HIGHER &&
    higherMonthlyToThreeMonthQuote.sourcePrice?.billing_type ===
      BILLING_TYPES.SUBSCRIPTION &&
    (higherMonthlyToThreeMonthQuote.sourcePrice?.interval_count ?? 1) === 1;

  const canShowHigherMonthlyToHigherLifetimeUpgrade =
    higherMonthlyToHigherLifetimeQuote?.eligible &&
    higherMonthlyToHigherLifetimeQuote.sourceProduct?.code ===
      PRODUCT_CODES.GCSE_RUSSIAN_HIGHER &&
    higherMonthlyToHigherLifetimeQuote.upgradeFlow === "lifetime" &&
    higherMonthlyToHigherLifetimeQuote.sourcePrice?.billing_type ===
      BILLING_TYPES.SUBSCRIPTION &&
    (higherMonthlyToHigherLifetimeQuote.sourcePrice?.interval_count ?? 1) === 1;

  const canShowHigherThreeMonthToHigherLifetimeUpgrade =
    higherThreeMonthToHigherLifetimeQuote?.eligible &&
    higherThreeMonthToHigherLifetimeQuote.sourceProduct?.code ===
      PRODUCT_CODES.GCSE_RUSSIAN_HIGHER &&
    higherThreeMonthToHigherLifetimeQuote.upgradeFlow === "lifetime" &&
    higherThreeMonthToHigherLifetimeQuote.sourcePrice?.billing_type ===
      BILLING_TYPES.SUBSCRIPTION &&
    (higherThreeMonthToHigherLifetimeQuote.sourcePrice?.interval_count ?? 1) === 3;

  const canShowFoundationMonthlyToHigherMonthlyUpgrade =
    foundationMonthlyToHigherMonthlyQuote?.eligible &&
    foundationMonthlyToHigherMonthlyQuote.sourceProduct?.code ===
      PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION &&
    foundationMonthlyToHigherMonthlyQuote.upgradeFlow === "same_cadence" &&
    (foundationMonthlyToHigherMonthlyQuote.sourcePrice?.interval_count ?? 1) === 1;

  const canShowFoundationMonthlyToHigherThreeMonthUpgrade =
    foundationMonthlyToHigherThreeMonthQuote?.eligible &&
    foundationMonthlyToHigherThreeMonthQuote.sourceProduct?.code ===
      PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION &&
    foundationMonthlyToHigherThreeMonthQuote.upgradeFlow === "monthly_to_three_month" &&
    (foundationMonthlyToHigherThreeMonthQuote.sourcePrice?.interval_count ?? 1) === 1;

  const canShowFoundationThreeMonthToHigherThreeMonthUpgrade =
    foundationThreeMonthToHigherThreeMonthQuote?.eligible &&
    foundationThreeMonthToHigherThreeMonthQuote.sourceProduct?.code ===
      PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION &&
    foundationThreeMonthToHigherThreeMonthQuote.upgradeFlow === "same_cadence" &&
    (foundationThreeMonthToHigherThreeMonthQuote.sourcePrice?.interval_count ?? 1) === 3;

  const canShowFoundationLifetimeToHigherLifetimeUpgrade =
    foundationLifetimeToHigherLifetimeQuote?.eligible &&
    foundationLifetimeToHigherLifetimeQuote.sourceProduct?.code ===
      PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION &&
    foundationLifetimeToHigherLifetimeQuote.upgradeFlow === "lifetime";

  const foundationOwned = planState.ownedProductCodes.has(
    PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION
  );
  const higherOwned = planState.ownedProductCodes.has(PRODUCT_CODES.GCSE_RUSSIAN_HIGHER);

  return (
    <div className="py-8 md:py-12">
      <section className="app-surface-brand app-section-padding-lg">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-4 text-center">
            <Badge tone="info" icon="info">
              Pricing
            </Badge>

            <div className="space-y-3">
              <h1 className="app-title">Choose your GCSE Russian course access</h1>
              <p className="mx-auto max-w-3xl app-subtitle">
                Start with Foundation or go straight to Higher. Higher includes more
                advanced content and is designed for students aiming for the top grades.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <PlanCard
              title="Foundation"
              subtitle="Beginner-friendly structured GCSE Russian learning"
              priceLabel={foundationPriceLabel}
              features={[
                "Full Foundation course access",
                "Structured lessons and exercises",
                "Progress tracking",
                "Exam-focused content",
                "Suitable for beginners and GCSE students",
              ]}
            >
              <div className="space-y-3">
                {!user ? (
                  <>
                    <CheckoutButton
                      productCode="gcse-russian-foundation"
                      billingType="subscription"
                      intervalUnit="month"
                      intervalCount={1}
                    >
                      Buy Foundation Monthly ({foundationMonthlyLabel})
                    </CheckoutButton>

                    <CheckoutButton
                      productCode="gcse-russian-foundation"
                      billingType="subscription"
                      intervalUnit="month"
                      intervalCount={3}
                    >
                      Buy Foundation 3 Months ({foundationThreeMonthLabel})
                    </CheckoutButton>

                    <CheckoutButton
                      productCode="gcse-russian-foundation"
                      billingType="one_time"
                    >
                      Buy Foundation Lifetime ({foundationLifetimeLabel})
                    </CheckoutButton>
                  </>
                ) : planState.foundationMonthly ? (
                  <>
                    <OwnedButton label="Foundation Monthly active" />

                    {canShowFoundationMonthlyToThreeMonthUpgrade ? (
                      <>
                        <CheckoutButton
                          productCode="gcse-russian-foundation"
                          billingType="subscription"
                          intervalUnit="month"
                          intervalCount={3}
                          isUpgrade
                        >
                          Upgrade to Foundation 3 Months (
                          {getUpgradeFeeLabel(foundationMonthlyToThreeMonthQuote)})
                        </CheckoutButton>

                        <p className="text-xs text-[var(--text-secondary)]">
                          {getUpgradeMessage(
                            foundationMonthlyToThreeMonthQuote,
                            foundationThreeMonthLabel
                          )}
                        </p>
                      </>
                    ) : null}

                    {canShowFoundationMonthlyToFoundationLifetimeUpgrade ? (
                      <>
                        <CheckoutButton
                          productCode="gcse-russian-foundation"
                          billingType="one_time"
                          isUpgrade
                        >
                          Upgrade to Foundation Lifetime (
                          {getUpgradeFeeLabel(foundationMonthlyToFoundationLifetimeQuote)}
                          )
                        </CheckoutButton>

                        <p className="text-xs text-[var(--text-secondary)]">
                          {getUpgradeMessage(
                            foundationMonthlyToFoundationLifetimeQuote,
                            foundationLifetimeLabel
                          )}
                        </p>
                      </>
                    ) : null}
                  </>
                ) : planState.foundationThreeMonth ? (
                  <>
                    <LockedOption
                      label="Foundation Monthly unavailable"
                      message="Monthly plans can’t be selected while your current 3-month Foundation plan is active."
                    />

                    <OwnedButton label="Foundation 3-Month active" />

                    {canShowFoundationThreeMonthToFoundationLifetimeUpgrade ? (
                      <>
                        <CheckoutButton
                          productCode="gcse-russian-foundation"
                          billingType="one_time"
                          isUpgrade
                        >
                          Upgrade to Foundation Lifetime (
                          {getUpgradeFeeLabel(
                            foundationThreeMonthToFoundationLifetimeQuote
                          )}
                          )
                        </CheckoutButton>

                        <p className="text-xs text-[var(--text-secondary)]">
                          {getUpgradeMessage(
                            foundationThreeMonthToFoundationLifetimeQuote,
                            foundationLifetimeLabel
                          )}
                        </p>
                      </>
                    ) : null}
                  </>
                ) : planState.foundationLifetime ? (
                  <>
                    <LockedOption
                      label="Foundation Monthly unavailable"
                      message="Monthly plans aren’t needed because you already have Foundation lifetime access."
                    />

                    <LockedOption
                      label="Foundation 3-Month unavailable"
                      message="3-month plans aren’t needed because you already have Foundation lifetime access."
                    />

                    <OwnedButton label="Foundation Lifetime active" />

                    <p className="text-xs text-[var(--text-secondary)]">
                      Your account already has active Foundation lifetime access.
                    </p>
                  </>
                ) : foundationOwned ? (
                  <>
                    <OwnedButton label="Foundation already owned" />

                    <p className="text-xs text-[var(--text-secondary)]">
                      Your account already has active Foundation access.
                    </p>
                  </>
                ) : (
                  <>
                    <CheckoutButton
                      productCode="gcse-russian-foundation"
                      billingType="subscription"
                      intervalUnit="month"
                      intervalCount={1}
                    >
                      Buy Foundation Monthly ({foundationMonthlyLabel})
                    </CheckoutButton>

                    <CheckoutButton
                      productCode="gcse-russian-foundation"
                      billingType="subscription"
                      intervalUnit="month"
                      intervalCount={3}
                    >
                      Buy Foundation 3 Months ({foundationThreeMonthLabel})
                    </CheckoutButton>

                    <CheckoutButton
                      productCode="gcse-russian-foundation"
                      billingType="one_time"
                    >
                      Buy Foundation Lifetime ({foundationLifetimeLabel})
                    </CheckoutButton>
                  </>
                )}
              </div>
            </PlanCard>

            <PlanCard
              title="Higher"
              subtitle="Advanced GCSE Russian preparation for stronger students"
              priceLabel={higherPriceLabel}
              tone="highlight"
              features={[
                "Full Higher course access",
                "Advanced grammar and vocabulary",
                "Exam-style questions and mock exams",
                "Speaking, writing, listening, and reading practice",
                "Designed for Grades 7–9",
                "Progress tracking and structured learning",
              ]}
            >
              <div className="space-y-3">
                {!user ? (
                  <>
                    <CheckoutButton
                      productCode="gcse-russian-higher"
                      billingType="subscription"
                      intervalUnit="month"
                      intervalCount={1}
                    >
                      Buy Higher Monthly ({higherMonthlyStandardLabel})
                    </CheckoutButton>

                    <CheckoutButton
                      productCode="gcse-russian-higher"
                      billingType="subscription"
                      intervalUnit="month"
                      intervalCount={3}
                    >
                      Buy Higher 3 Months ({higherThreeMonthStandardLabel})
                    </CheckoutButton>

                    <CheckoutButton
                      productCode="gcse-russian-higher"
                      billingType="one_time"
                    >
                      Buy Higher Lifetime ({higherLifetimeStandardLabel})
                    </CheckoutButton>
                  </>
                ) : planState.higherLifetime ? (
                  <>
                    <LockedOption
                      label="Higher Monthly unavailable"
                      message="Monthly plans aren’t needed because you already have Higher lifetime access."
                    />

                    <LockedOption
                      label="Higher 3-Month unavailable"
                      message="3-month plans aren’t needed because you already have Higher lifetime access."
                    />

                    <OwnedButton label="Higher Lifetime active" />

                    <p className="text-xs text-[var(--text-secondary)]">
                      Your account already has active Higher lifetime access.
                    </p>
                  </>
                ) : planState.higherThreeMonth ? (
                  <>
                    <LockedOption
                      label="Higher Monthly unavailable"
                      message="Monthly plans can’t be selected while your current 3-month Higher plan is active."
                    />

                    <OwnedButton label="Higher 3-Month active" />

                    {canShowHigherThreeMonthToHigherLifetimeUpgrade ? (
                      <>
                        <CheckoutButton
                          productCode="gcse-russian-higher"
                          billingType="one_time"
                          isUpgrade
                        >
                          Upgrade to Higher Lifetime (
                          {getUpgradeFeeLabel(higherThreeMonthToHigherLifetimeQuote)})
                        </CheckoutButton>

                        <p className="text-xs text-[var(--text-secondary)]">
                          {getUpgradeMessage(
                            higherThreeMonthToHigherLifetimeQuote,
                            higherLifetimeStandardLabel
                          )}
                        </p>
                      </>
                    ) : null}
                  </>
                ) : planState.higherMonthly ? (
                  <>
                    <OwnedButton label="Higher Monthly active" />

                    {canShowHigherMonthlyToThreeMonthUpgrade ? (
                      <>
                        <CheckoutButton
                          productCode="gcse-russian-higher"
                          billingType="subscription"
                          intervalUnit="month"
                          intervalCount={3}
                          isUpgrade
                        >
                          Upgrade to Higher 3 Months (
                          {getUpgradeFeeLabel(higherMonthlyToThreeMonthQuote)})
                        </CheckoutButton>

                        <p className="text-xs text-[var(--text-secondary)]">
                          {getUpgradeMessage(
                            higherMonthlyToThreeMonthQuote,
                            higherThreeMonthStandardLabel
                          )}
                        </p>
                      </>
                    ) : null}

                    {canShowHigherMonthlyToHigherLifetimeUpgrade ? (
                      <>
                        <CheckoutButton
                          productCode="gcse-russian-higher"
                          billingType="one_time"
                          isUpgrade
                        >
                          Upgrade to Higher Lifetime (
                          {getUpgradeFeeLabel(higherMonthlyToHigherLifetimeQuote)})
                        </CheckoutButton>

                        <p className="text-xs text-[var(--text-secondary)]">
                          {getUpgradeMessage(
                            higherMonthlyToHigherLifetimeQuote,
                            higherLifetimeStandardLabel
                          )}
                        </p>
                      </>
                    ) : null}
                  </>
                ) : planState.foundationLifetime ? (
                  <>
                    <LockedOption
                      label="Higher Monthly unavailable"
                      message="Monthly plans are not available from Foundation lifetime. You can upgrade straight to Higher lifetime instead."
                    />

                    <LockedOption
                      label="Higher 3-Month unavailable"
                      message="3-month Higher plans are not available from Foundation lifetime. You can upgrade straight to Higher lifetime instead."
                    />

                    {canShowFoundationLifetimeToHigherLifetimeUpgrade ? (
                      <>
                        <CheckoutButton
                          productCode="gcse-russian-higher"
                          billingType="one_time"
                          isUpgrade
                        >
                          Upgrade to Higher Lifetime (
                          {getUpgradeFeeLabel(foundationLifetimeToHigherLifetimeQuote)})
                        </CheckoutButton>

                        <p className="text-xs text-[var(--text-secondary)]">
                          {getUpgradeMessage(
                            foundationLifetimeToHigherLifetimeQuote,
                            higherLifetimeStandardLabel
                          )}
                        </p>
                      </>
                    ) : null}
                  </>
                ) : planState.foundationThreeMonth ? (
                  <>
                    <LockedOption
                      label="Higher Monthly unavailable"
                      message="You can move to Higher on the same 3-month schedule, but not down to a monthly plan while your current 3-month access is active."
                    />

                    {canShowFoundationThreeMonthToHigherThreeMonthUpgrade ? (
                      <>
                        <CheckoutButton
                          productCode="gcse-russian-higher"
                          billingType="subscription"
                          intervalUnit="month"
                          intervalCount={3}
                          isUpgrade
                        >
                          Upgrade to Higher 3 Months (
                          {getUpgradeFeeLabel(
                            foundationThreeMonthToHigherThreeMonthQuote
                          )}
                          )
                        </CheckoutButton>

                        <p className="text-xs text-[var(--text-secondary)]">
                          {getUpgradeMessage(
                            foundationThreeMonthToHigherThreeMonthQuote,
                            higherThreeMonthStandardLabel
                          )}
                        </p>
                      </>
                    ) : null}

                    {canShowFoundationLifetimeToHigherLifetimeUpgrade ? (
                      <>
                        <CheckoutButton
                          productCode="gcse-russian-higher"
                          billingType="one_time"
                          isUpgrade
                        >
                          Upgrade to Higher Lifetime (
                          {getUpgradeFeeLabel(foundationLifetimeToHigherLifetimeQuote)})
                        </CheckoutButton>

                        <p className="text-xs text-[var(--text-secondary)]">
                          {getUpgradeMessage(
                            foundationLifetimeToHigherLifetimeQuote,
                            higherLifetimeStandardLabel
                          )}
                        </p>
                      </>
                    ) : null}
                  </>
                ) : planState.foundationMonthly ? (
                  <>
                    <OwnedButton label="Foundation Monthly active" />

                    {canShowFoundationMonthlyToHigherMonthlyUpgrade ? (
                      <>
                        <CheckoutButton
                          productCode="gcse-russian-higher"
                          billingType="subscription"
                          intervalUnit="month"
                          intervalCount={1}
                          isUpgrade
                        >
                          Upgrade to Higher Monthly (
                          {getUpgradeFeeLabel(foundationMonthlyToHigherMonthlyQuote)})
                        </CheckoutButton>

                        <p className="text-xs text-[var(--text-secondary)]">
                          {getUpgradeMessage(
                            foundationMonthlyToHigherMonthlyQuote,
                            higherMonthlyStandardLabel
                          )}
                        </p>
                      </>
                    ) : null}

                    {canShowFoundationMonthlyToHigherThreeMonthUpgrade ? (
                      <>
                        <CheckoutButton
                          productCode="gcse-russian-higher"
                          billingType="subscription"
                          intervalUnit="month"
                          intervalCount={3}
                          isUpgrade
                        >
                          Upgrade to Higher 3 Months (
                          {getUpgradeFeeLabel(foundationMonthlyToHigherThreeMonthQuote)})
                        </CheckoutButton>

                        <p className="text-xs text-[var(--text-secondary)]">
                          {getUpgradeMessage(
                            foundationMonthlyToHigherThreeMonthQuote,
                            higherThreeMonthStandardLabel
                          )}
                        </p>
                      </>
                    ) : null}

                    {canShowFoundationLifetimeToHigherLifetimeUpgrade ? (
                      <>
                        <CheckoutButton
                          productCode="gcse-russian-higher"
                          billingType="one_time"
                          isUpgrade
                        >
                          Upgrade to Higher Lifetime (
                          {getUpgradeFeeLabel(foundationLifetimeToHigherLifetimeQuote)})
                        </CheckoutButton>

                        <p className="text-xs text-[var(--text-secondary)]">
                          {getUpgradeMessage(
                            foundationLifetimeToHigherLifetimeQuote,
                            higherLifetimeStandardLabel
                          )}
                        </p>
                      </>
                    ) : null}
                  </>
                ) : higherOwned ? (
                  <>
                    <OwnedButton label="Higher already owned" />

                    <p className="text-xs text-[var(--text-secondary)]">
                      Your account already has active Higher access.
                    </p>
                  </>
                ) : (
                  <>
                    <CheckoutButton
                      productCode="gcse-russian-higher"
                      billingType="subscription"
                      intervalUnit="month"
                      intervalCount={1}
                    >
                      Buy Higher Monthly ({higherMonthlyStandardLabel})
                    </CheckoutButton>

                    <CheckoutButton
                      productCode="gcse-russian-higher"
                      billingType="subscription"
                      intervalUnit="month"
                      intervalCount={3}
                    >
                      Buy Higher 3 Months ({higherThreeMonthStandardLabel})
                    </CheckoutButton>

                    <CheckoutButton
                      productCode="gcse-russian-higher"
                      billingType="one_time"
                    >
                      Buy Higher Lifetime ({higherLifetimeStandardLabel})
                    </CheckoutButton>
                  </>
                )}
              </div>
            </PlanCard>
          </div>

          <div className="app-card app-section-padding text-sm text-[var(--text-secondary)]">
            <p className="font-medium text-[var(--text-primary)]">
              Looking for teacher-led learning?
            </p>
            <p className="mt-2">
              You can also study through Volna School with live lessons and teacher
              support. That flow stays separate from Stripe.
            </p>

            <div className="mt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-blue)] hover:underline"
              >
                <AppIcon icon="next" size={14} />
                Back to homepage
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

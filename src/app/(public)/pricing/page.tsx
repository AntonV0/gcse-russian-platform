import Link from "next/link";
import Badge from "@/components/ui/badge";
import AppIcon from "@/components/ui/app-icon";
import CheckoutButton from "@/components/billing/checkout-button";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  PRODUCT_CODES,
  getPlanPricingDb,
  getResolvedHigherUpgradePricingForUserDb,
  getUserGcseRussianPurchaseStateDb,
  type DbPrice,
  type PlanPricing,
} from "@/lib/billing/catalog";

type PlanCardProps = {
  title: string;
  subtitle: string;
  priceLabel: string;
  features: string[];
  tone?: "default" | "highlight";
  children: React.ReactNode;
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

  if (price.billing_type === "subscription") {
    const count = price.interval_count ?? 1;
    const unit = price.interval_unit ?? "month";

    if (unit === "month" && count === 1) {
      return `${formattedAmount}/month`;
    }

    if (unit === "month") {
      return `${formattedAmount}/${count} months`;
    }

    if (unit === "year" && count === 1) {
      return `${formattedAmount}/year`;
    }

    return `${formattedAmount}/${count} years`;
  }

  return formattedAmount;
}

function firstAvailableLabel(pricing: PlanPricing): string | null {
  return (
    formatPriceLabel(pricing.monthly) ??
    formatPriceLabel(pricing.threeMonth) ??
    formatPriceLabel(pricing.lifetime) ??
    null
  );
}

function getFromPriceLabel(pricing: PlanPricing): string {
  const label = firstAvailableLabel(pricing);
  return label ? `From ${label}` : "Pricing unavailable";
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

export default async function PricingPage() {
  const user = await getCurrentUser();

  const [foundationPricing, higherPricing, purchaseState, upgradePricing] =
    await Promise.all([
      getPlanPricingDb(PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION),
      getPlanPricingDb(PRODUCT_CODES.GCSE_RUSSIAN_HIGHER),
      user
        ? getUserGcseRussianPurchaseStateDb(user.id)
        : Promise.resolve({
            canBuyFoundation: true,
            canBuyHigher: true,
            canUpgradeToHigher: false,
          }),
      user
        ? getResolvedHigherUpgradePricingForUserDb(user.id)
        : Promise.resolve({
            monthly: null,
            threeMonth: null,
            lifetime: null,
          }),
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

  const higherMonthlyUpgradeLabel = formatPriceLabel(upgradePricing.monthly);
  const higherThreeMonthUpgradeLabel = formatPriceLabel(upgradePricing.threeMonth);
  const higherLifetimeUpgradeLabel = formatPriceLabel(upgradePricing.lifetime);

  const foundationPriceLabel = getFromPriceLabel(foundationPricing);
  const higherPriceLabel =
    purchaseState.canUpgradeToHigher && firstAvailableLabel(upgradePricing)
      ? `Upgrade from ${firstAvailableLabel(upgradePricing)}`
      : getFromPriceLabel(higherPricing);

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
                {purchaseState.canBuyFoundation ? (
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
                ) : (
                  <>
                    <OwnedButton label="Foundation already owned" />

                    <p className="text-xs text-[var(--text-secondary)]">
                      Your account already has active Foundation access.
                    </p>
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
                {!purchaseState.canBuyHigher ? (
                  <>
                    <OwnedButton label="Higher already owned" />

                    <p className="text-xs text-[var(--text-secondary)]">
                      Your account already has active Higher access.
                    </p>
                  </>
                ) : purchaseState.canUpgradeToHigher &&
                  (upgradePricing.monthly ||
                    upgradePricing.threeMonth ||
                    upgradePricing.lifetime) ? (
                  <>
                    {upgradePricing.monthly ? (
                      <CheckoutButton
                        productCode="gcse-russian-higher"
                        billingType="subscription"
                        intervalUnit="month"
                        intervalCount={1}
                        isUpgrade
                      >
                        Upgrade to Higher Monthly ({higherMonthlyUpgradeLabel})
                      </CheckoutButton>
                    ) : null}

                    {upgradePricing.threeMonth ? (
                      <CheckoutButton
                        productCode="gcse-russian-higher"
                        billingType="subscription"
                        intervalUnit="month"
                        intervalCount={3}
                        isUpgrade
                      >
                        Upgrade to Higher 3 Months ({higherThreeMonthUpgradeLabel})
                      </CheckoutButton>
                    ) : null}

                    {upgradePricing.lifetime ? (
                      <CheckoutButton
                        productCode="gcse-russian-higher"
                        billingType="one_time"
                        isUpgrade
                      >
                        Upgrade to Higher Lifetime ({higherLifetimeUpgradeLabel})
                      </CheckoutButton>
                    ) : null}

                    <p className="text-xs text-[var(--text-secondary)]">
                      Upgrade prices are based on your current Foundation plan.
                      Subscription credit is not cumulative across repeated renewals.
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

                    <p className="text-xs text-[var(--text-secondary)]">
                      Buy Higher directly if you want the full advanced course from the
                      start.
                    </p>
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

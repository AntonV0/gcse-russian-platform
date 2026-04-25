import type { Metadata } from "next";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import { getPlanPricing } from "@/components/billing/pricing/data";
import { PRODUCT_CODES } from "@/lib/billing/catalog";
import { formatPriceLabel } from "@/lib/billing/pricing-ui";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Course Pricing",
  description:
    "Compare Foundation and Higher GCSE Russian course access, start with a trial account, and upgrade securely from inside the app when ready.",
  path: "/marketing/pricing",
});

const plans = [
  {
    title: "Foundation",
    code: PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
    description:
      "Structured GCSE Russian learning for students building confidence with core topics, grammar, and exam practice.",
    bestFor: "Core GCSE preparation and confidence building",
    features: [
      "Foundation pathway",
      "Trial access before checkout",
      "Vocabulary and grammar practice",
      "Foundation to Higher upgrade path",
    ],
  },
  {
    title: "Higher",
    code: PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
    description:
      "A more advanced route for students aiming for stronger GCSE outcomes and deeper exam preparation.",
    bestFor: "Students targeting stronger GCSE outcomes",
    features: [
      "Higher pathway",
      "Advanced grammar and vocabulary",
      "Mock exam preparation",
      "Upgrade credit for eligible students",
    ],
  },
];

function getPriceRows(pricing: Awaited<ReturnType<typeof getPlanPricing>>) {
  return [
    { label: "Monthly", value: formatPriceLabel(pricing.monthly) ?? "Unavailable" },
    {
      label: "3 months",
      value: formatPriceLabel(pricing.threeMonth) ?? "Unavailable",
    },
    { label: "Lifetime", value: formatPriceLabel(pricing.lifetime) ?? "Unavailable" },
  ];
}

export default async function MarketingPricingPage() {
  const [foundationPricing, higherPricing] = await Promise.all([
    getPlanPricing(PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION),
    getPlanPricing(PRODUCT_CODES.GCSE_RUSSIAN_HIGHER),
  ]);
  const pricingByCode = {
    [PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION]: foundationPricing,
    [PRODUCT_CODES.GCSE_RUSSIAN_HIGHER]: higherPricing,
  };

  return (
    <div className="space-y-8 py-8 md:py-12">
      <PageIntroPanel
        tone="brand"
        eyebrow="Pricing"
        title="GCSE Russian course pricing"
        description="Start with a trial account, then choose Foundation or Higher from your billing page. Prices are shown here so families can decide before signing up."
        badges={
          <>
            <Badge tone="success" icon="unlocked">
              Trial first
            </Badge>
            <Badge tone="muted" icon="pricing">
              Monthly, 3-month, and lifetime
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/signup" variant="primary" icon="create">
              Start trial
            </Button>
            <Button href="/account/billing" variant="secondary" icon="billing">
              Log in to upgrade
            </Button>
          </>
        }
      />

      <section className="grid gap-4 lg:grid-cols-2">
        {plans.map((plan) => {
          const priceRows = getPriceRows(pricingByCode[plan.code]);

          return (
            <SectionCard
              key={plan.title}
              title={plan.title}
              description={plan.description}
              tone={plan.title === "Higher" ? "brand" : "student"}
              footer={
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {plan.bestFor}
                  </span>
                  <Button href="/signup" variant="primary" icon="create">
                    Start trial
                  </Button>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)]">
                  {priceRows.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between gap-4 px-4 py-3"
                    >
                      <span className="text-sm app-text-muted">{row.label}</span>
                      <span className="text-base font-semibold text-[var(--text-primary)]">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                <ul className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-fill)]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </SectionCard>
          );
        })}
      </section>

      <SectionCard
        title="Trial and upgrade path"
        description="Trial accounts can explore available sample content first. Paid checkout, renewals, and Foundation to Higher upgrade fees are shown inside billing because they depend on the signed-in account."
        tone="muted"
        actions={
          <Button href="/account/billing" variant="secondary" icon="billing">
            Open app billing
          </Button>
        }
      />
    </div>
  );
}

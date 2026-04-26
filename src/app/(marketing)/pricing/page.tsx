import type { Metadata } from "next";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import { getPlanPricing } from "@/components/billing/pricing/data";
import MarketingBreadcrumbs from "@/components/marketing/marketing-breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { PRODUCT_CODES } from "@/lib/billing/catalog";
import { formatPriceLabel } from "@/lib/billing/pricing-ui";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";
import { buildFaqJsonLd, buildProductOfferJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Course Pricing",
  description:
    "Compare Foundation and Higher GCSE Russian course access, start with a trial account, and upgrade securely from inside the app when ready.",
  path: "/pricing",
  ogTitle: "GCSE Russian Course Pricing",
  ogDescription:
    "Compare Foundation and Higher access with trial-first signup and secure in-app checkout.",
  ogImagePath: getOgImagePath("pricing"),
  ogImageAlt: "GCSE Russian course pricing",
});

const pricingFaqs = [
  {
    question: "Can students try the GCSE Russian course before paying?",
    answer:
      "Yes. Students can create a trial account first, explore available sample content, and then upgrade from inside billing when ready.",
  },
  {
    question: "What is the difference between Foundation and Higher access?",
    answer:
      "Foundation is designed for core GCSE preparation and confidence building. Higher adds a more advanced pathway for students targeting stronger GCSE outcomes.",
  },
  {
    question: "Where does checkout happen?",
    answer:
      "Checkout happens securely from inside the signed-in app so the correct course access can be attached to the student account.",
  },
];

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

function getStructuredOffers(
  planTitle: string,
  pricing: Awaited<ReturnType<typeof getPlanPricing>>
) {
  return [
    { label: "Monthly", price: pricing.monthly?.amount_gbp },
    { label: "3 months", price: pricing.threeMonth?.amount_gbp },
    { label: "Lifetime", price: pricing.lifetime?.amount_gbp },
  ]
    .filter((offer): offer is { label: string; price: number } => offer.price != null)
    .map((offer) => ({
      name: `${planTitle} ${offer.label}`,
      price: offer.price,
    }));
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
  const structuredOffers = plans.flatMap((plan) =>
    getStructuredOffers(plan.title, pricingByCode[plan.code])
  );

  return (
    <>
      <JsonLd
        data={[
          buildProductOfferJsonLd({
            name: "GCSE Russian Course",
            description:
              "Foundation and Higher GCSE Russian online course access with trial-first signup and secure in-app checkout.",
            path: "/pricing",
            offers: structuredOffers,
          }),
          buildFaqJsonLd(pricingFaqs),
        ]}
      />
      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "Pricing", href: "/pricing" },
        ]}
      />
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
          title="Pricing questions"
          description="The common decisions families make before creating a trial account."
          tone="student"
        >
          <div className="grid gap-3 md:grid-cols-3">
            {pricingFaqs.map((item) => (
              <div
                key={item.question}
                className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4"
              >
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

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
    </>
  );
}

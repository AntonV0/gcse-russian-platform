import type { Metadata } from "next";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { getPlanPricing } from "@/components/billing/pricing/data";
import MarketingBreadcrumbs from "@/components/marketing/marketing-breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { PRODUCT_CODES } from "@/lib/billing/catalog";
import { formatPriceLabel } from "@/lib/billing/pricing-ui";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";
import { buildFaqJsonLd, buildProductOfferJsonLd } from "@/lib/seo/structured-data";
import type { AppIconKey } from "@/lib/shared/icons";

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

type Pricing = Awaited<ReturnType<typeof getPlanPricing>>;

type PricingPlan = {
  title: string;
  code: string;
  description: string;
  bestFor: string;
  accent: string;
  features: string[];
  icon: AppIconKey;
};

type FaqItem = {
  question: string;
  answer: string;
};

const plans = [
  {
    title: "Foundation",
    code: PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
    description:
      "Structured GCSE Russian access for students building confidence with core language, GCSE themes, and exam practice.",
    bestFor: "Core preparation, confidence, and a steadier weekly routine",
    accent: "Foundation route",
    features: [
      "Foundation course pathway",
      "Short lessons and guided practice",
      "Vocabulary and grammar revision",
      "Exam-style practice and progress visibility",
    ],
    icon: "layers",
  },
  {
    title: "Higher",
    code: PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
    description:
      "A more demanding route for students ready for wider vocabulary, richer grammar, longer answers, and higher-tier practice.",
    bestFor: "Students targeting a stronger GCSE outcome",
    accent: "Higher route",
    features: [
      "Higher course pathway",
      "More demanding grammar and vocabulary",
      "Paper-specific revision and mock preparation",
      "Foundation-to-Higher upgrade path where eligible",
    ],
    icon: "star",
  },
] satisfies PricingPlan[];

const checkoutSteps = [
  {
    title: "Create a trial account",
    description:
      "The student can look around the learning environment before the family commits to paid access.",
    icon: "unlocked",
  },
  {
    title: "Choose the right route",
    description:
      "Foundation or Higher should match the student’s current level, confidence, and target.",
    icon: "layers",
  },
  {
    title: "Upgrade inside billing",
    description:
      "Checkout happens after sign-in so course access is attached to the correct student account.",
    icon: "billing",
  },
] satisfies Array<{ title: string; description: string; icon: AppIconKey }>;

const decisionPoints = [
  {
    title: "Start with fit, not pressure",
    description:
      "The course is trial-first because families should see the route before deciding how much access to buy.",
    icon: "completed",
  },
  {
    title: "Pick tier deliberately",
    description:
      "Foundation and Higher are learning routes, not just price labels. The right choice depends on the student's evidence from practice.",
    icon: "exam",
  },
  {
    title: "Add support separately",
    description:
      "Online lessons or tutor-style support can be added when speaking, writing, feedback, or accountability need a human rhythm.",
    icon: "teacher",
  },
] satisfies Array<{ title: string; description: string; icon: AppIconKey }>;

const pricingFaqs: FaqItem[] = [
  {
    question: "Can students try the course before paying?",
    answer:
      "Yes. Students can create a trial account first, explore the learning environment, and then upgrade from inside billing when ready.",
  },
  {
    question: "What is the difference between Foundation and Higher access?",
    answer:
      "Foundation is built for core GCSE preparation and confidence. Higher is a more demanding route with wider vocabulary, richer grammar, and harder exam preparation.",
  },
  {
    question: "Where does checkout happen?",
    answer:
      "Checkout happens securely from inside the signed-in app so the correct course access can be attached to the student account.",
  },
  {
    question: "Do online lessons come with course pricing?",
    answer:
      "Course access and live teaching support are separate decisions. Some students can self-study; others benefit from online lessons for speaking, writing, or accountability.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">{children}</p>
  );
}

function getPriceRows(pricing: Pricing) {
  return [
    { label: "Monthly", value: formatPriceLabel(pricing.monthly) ?? "Unavailable" },
    { label: "3 months", value: formatPriceLabel(pricing.threeMonth) ?? "Unavailable" },
    { label: "Lifetime", value: formatPriceLabel(pricing.lifetime) ?? "Unavailable" },
  ];
}

function getStructuredOffers(planTitle: string, pricing: Pricing) {
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

function PricingHeroVisual() {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-lg)]">
      <div className="rounded-lg marketing-dark-panel p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs opacity-70">Trial-first pricing</p>
            <p className="mt-1 text-xl font-bold">Choose after seeing the course</p>
          </div>
          <span className="rounded-md bg-[var(--accent-fill)] px-3 py-1 text-xs font-bold text-[var(--accent-on-fill)]">
            Secure billing
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {checkoutSteps.map((step, index) => (
          <div
            key={step.title}
            className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--background-muted)] p-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--surface-elevated)] text-[var(--accent-ink)]">
              <AppIcon icon={step.icon} size={19} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[var(--accent-ink)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  {step.title}
                </h3>
              </div>
              <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingCard({ plan, pricing }: { plan: PricingPlan; pricing: Pricing }) {
  const priceRows = getPriceRows(pricing);

  return (
    <article className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">
            {plan.accent}
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-[var(--text-primary)]">
            {plan.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
            {plan.description}
          </p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
          <AppIcon icon={plan.icon} size={24} />
        </div>
      </div>

      <div className="mt-6 divide-y divide-[var(--border-subtle)] overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--background-muted)]">
        {priceRows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">
              {row.label}
            </span>
            <span className="text-base font-extrabold text-[var(--text-primary)]">
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-md bg-[var(--background-muted)] px-3 py-2 text-sm font-semibold text-[var(--text-primary)]">
        {plan.bestFor}
      </div>

      <ul className="mt-5 grid gap-3 text-sm text-[var(--text-secondary)]">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <AppIcon
              icon="confirm"
              size={15}
              className="mt-0.5 shrink-0 text-[var(--accent-ink)]"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Button href="/signup" variant="primary" icon="create">
          Start trial
        </Button>
      </div>
    </article>
  );
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

      <div className="space-y-16 py-8 md:py-12">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.72fr)] lg:items-center">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone="success" icon="unlocked">
                Trial before checkout
              </Badge>
              <Badge tone="muted" icon="pricing">
                Monthly, 3-month, lifetime
              </Badge>
            </div>

            <Eyebrow>GCSE Russian course pricing</Eyebrow>
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-none text-[var(--text-primary)] md:text-6xl">
              See the route first, then choose the access that fits.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
              Families can create a trial account before paying. Pricing is shown here so
              you can compare Foundation and Higher calmly, then upgrade securely from
              inside the signed-in app.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/signup" variant="primary" icon="create">
                Start trial
              </Button>
              <Button href="/login?next=/account/billing" variant="secondary" icon="billing">
                Log in to upgrade
              </Button>
            </div>
          </div>

          <PricingHeroVisual />
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          {plans.map((plan) => (
            <PricingCard
              key={plan.title}
              plan={plan}
              pricing={pricingByCode[plan.code]}
            />
          ))}
        </section>

        <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.48fr_1fr] lg:items-start">
            <div>
              <Eyebrow>How to decide</Eyebrow>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
                The price decision should follow the learning decision.
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
                The important question is not simply which plan is cheapest. It is which
                route gives the student a realistic way to study consistently.
              </p>
            </div>
            <div className="grid gap-3">
              {decisionPoints.map((item) => (
                <div
                  key={item.title}
                  className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 rounded-lg bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-sm)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
                    <AppIcon icon={item.icon} size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.7fr_1fr]">
          <div>
            <Eyebrow>Pricing questions</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)]">
              What families usually check before upgrading
            </h2>
          </div>
          <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
            {pricingFaqs.map((item) => (
              <div key={item.question} className="py-5">
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg marketing-dark-panel p-6 shadow-[var(--shadow-lg)] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold leading-tight md:text-3xl">
                Start with trial access before making the paid decision.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 opacity-80">
                Create the account, inspect the course route, then use billing inside the
                app when the access level is right.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/signup" variant="primary" icon="create">
                Create trial account
              </Button>
              <Button href="/gcse-russian-course" variant="secondary" icon="courses">
                View course
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

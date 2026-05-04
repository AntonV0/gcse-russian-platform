import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import FeedbackBanner from "@/components/ui/feedback-banner";
import BillingPortalButton from "@/components/billing/billing-portal-button";
import FoundationPlanPanel from "@/components/billing/pricing/foundation-plan-panel";
import HigherPlanPanel from "@/components/billing/pricing/higher-plan-panel";
import PlanCard from "@/components/billing/pricing/plan-card";
import { getPricingPageData } from "@/components/billing/pricing/data";
import { getCurrentUser } from "@/lib/auth/auth";
import { getFromPriceLabel } from "@/lib/billing/pricing-ui";
import type { AppIconKey } from "@/lib/shared/icons";

const checkoutSteps: Array<{
  icon: AppIconKey;
  title: string;
  description: string;
}> = [
  {
    icon: "lock",
    title: "Secure Stripe checkout",
    description: "Payment details are handled by Stripe, not stored in the course app.",
  },
  {
    icon: "success",
    title: "Your course starts after payment",
    description: "Your plan is added to your GCSE Russian dashboard.",
  },
  {
    icon: "settings",
    title: "Shorter plans stay flexible",
    description: "You can change monthly and 3-month plans later from Stripe.",
  },
];

const tierGuidance: Array<{
  icon: AppIconKey;
  title: string;
  description: string;
}> = [
  {
    icon: "learning",
    title: "Choose Foundation",
    description:
      "A calm starting point if you are building confidence or preparing for Foundation-tier exams.",
  },
  {
    icon: "star",
    title: "Choose Higher",
    description:
      "For you if you are ready for more advanced grammar, fuller exam practice, and Grades 7-9 targets.",
  },
  {
    icon: "calendar",
    title: "Lifetime is the simplest choice",
    description:
      "One payment keeps the course available throughout GCSE preparation, without renewals.",
  },
];

const volnaHighlights: Array<{
  icon: AppIconKey;
  title: string;
  description: string;
}> = [
  {
    icon: "teacher",
    title: "Live teacher support",
    description:
      "Two 1-hour online lessons each week, with Edexcel-trained teachers guiding the GCSE route.",
  },
  {
    icon: "users",
    title: "Small group classes",
    description:
      "Group classes are kept small, so students get more attention than in a large classroom.",
  },
  {
    icon: "assignments",
    title: "Weekly homework",
    description:
      "Students get regular tasks, feedback, and a stronger study rhythm between lessons.",
  },
];

function BillingInfoCard({
  icon,
  title,
  description,
}: {
  icon: AppIconKey;
  title: string;
  description: string;
}) {
  return (
    <div className="app-card flex items-start gap-3 px-4 py-3">
      <span className="mt-0.5 rounded-full bg-[var(--surface-secondary)] p-2 text-[var(--accent-ink)]">
        <AppIcon icon={icon} size={16} />
      </span>
      <div>
        <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
        <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
          {description}
        </p>
      </div>
    </div>
  );
}

function VolnaSchoolRoute() {
  return (
    <section className="app-card overflow-hidden">
      <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_310px]">
        <div className="space-y-4 p-5">
          <div className="flex flex-wrap gap-2">
            <Badge tone="info" icon="school">
              Teacher-led route
            </Badge>
            <Badge tone="muted" icon="calendar">
              1-year or 2-year GCSE classes
            </Badge>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Want live GCSE Russian teaching as well as the course?
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
              Volna School is a higher-support route for families who want regular live
              lessons, homework, feedback, and exam guidance. It is a bigger commitment
              than self-study, so it is best for students who need teaching and
              accountability each week.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {volnaHighlights.map((item) => (
              <BillingInfoCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>

          <details className="group rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)] px-4 py-3 text-sm text-[var(--text-secondary)]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-[var(--text-primary)]">
              <span className="inline-flex items-center gap-2">
                <AppIcon icon="help" size={16} />
                See if Volna is a fit
              </span>
              <AppIcon
                icon="down"
                size={16}
                className="transition group-open:rotate-180"
              />
            </summary>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-[var(--surface-primary)] px-4 py-3">
                <p className="text-xs font-bold uppercase text-[var(--text-muted)]">
                  Self-study course
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  Lower cost, flexible timing, and a clear Foundation or Higher course
                  route for students who can work independently.
                </p>
              </div>

              <div className="rounded-xl bg-[var(--surface-primary)] px-4 py-3">
                <p className="text-xs font-bold uppercase text-[var(--text-muted)]">
                  Volna School route
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  Higher cost, live teaching twice a week, weekly homework, small groups,
                  and extra guidance for Edexcel Higher Tier GCSE Russian.
                </p>
              </div>
            </div>
          </details>
        </div>

        <aside className="border-t border-[var(--border-subtle)] bg-[var(--background-muted)] p-5 xl:border-l xl:border-t-0">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase text-[var(--text-muted)]">
                Cost guide
              </p>
              <p className="mt-2 text-2xl font-extrabold text-[var(--text-primary)]">
                &pound;18/hour
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                Group GCSE classes usually run as two 1-hour lessons each week. The first
                lesson is free, then Volna invoices by school term.
              </p>
            </div>

            <div className="space-y-2 rounded-xl bg-[var(--surface-primary)] px-4 py-3 text-sm">
              <p className="font-semibold text-[var(--text-primary)]">
                Best for families who want:
              </p>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li>1-year intensive or 2-year GCSE preparation</li>
                <li>Live teaching and weekly accountability</li>
                <li>Help with mocks and exam entry decisions</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button href="/online-classes" variant="primary" icon="school">
                Compare live teaching
              </Button>

              <Link
                href="https://www.volnaschool.com/gcse-courses"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-ink)] hover:underline"
              >
                Visit Volna GCSE page
                <AppIcon icon="externalLink" size={14} />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams?: Promise<{ checkout?: string }>;
}) {
  const user = await getCurrentUser();
  const resolvedSearchParams = (await searchParams) ?? {};

  const {
    foundationPricing,
    higherPricing,
    planState,
    activeSubscriptions,
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
  } = await getPricingPageData(user?.id ?? null);

  const foundationPriceLabel = getFromPriceLabel(foundationPricing);
  const higherPriceLabel = getFromPriceLabel(higherPricing);
  const hasActiveSubscription = Boolean(
    activeSubscriptions.foundation || activeSubscriptions.higher
  );

  return (
    <main className="space-y-5">
      <section className="app-surface-brand p-4">
        <div className="mx-auto max-w-5xl space-y-5">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge tone="info" icon="billing">
                  Course plan
                </Badge>
                <Badge tone="muted" icon="pricing">
                  Lifetime is best value
                </Badge>
              </div>

              <div className="space-y-2">
                <h1 className="app-heading-hero">
                  Choose a GCSE Russian course plan
                </h1>
                <p className="app-subtitle max-w-2xl">
                  Pick the course tier that fits you, then choose how long you want to
                  keep it. Lifetime is the simplest option if you want GCSE
                  preparation covered without renewals.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="app-pill app-pill-info">
                  Recommended: lifetime plan
                </span>
                <span className="app-pill app-pill-muted">
                  Monthly and 3-month plans stay available
                </span>
              </div>
            </div>

            <div className="app-card px-4 py-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl [background:var(--accent-gradient-soft)] text-[var(--accent-on-soft)]">
                  <AppIcon icon="lock" size={16} />
                </span>
                <div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">
                    Secure checkout
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
                    Payment happens through Stripe, and your course plan is added after
                    checkout.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <PlanCard
              title="Foundation"
              subtitle="Beginner-friendly structured GCSE Russian learning"
              bestFor="For building confidence and Foundation-tier preparation"
              priceLabel={foundationPriceLabel}
              optionNote="After checkout, it appears in your GCSE Russian dashboard."
              features={[
                "Full Foundation course",
                "Structured lessons and exercises",
                "Progress tracking",
                "Exam-focused content",
                "Suitable if you are starting out",
              ]}
            >
              <FoundationPlanPanel
                user={user ? { id: user.id } : null}
                pricing={foundationPricing}
                planState={planState}
                activeSubscriptions={activeSubscriptions}
                foundationMonthlyToThreeMonthQuote={foundationMonthlyToThreeMonthQuote}
                foundationMonthlyToFoundationLifetimeQuote={
                  foundationMonthlyToFoundationLifetimeQuote
                }
                foundationThreeMonthToFoundationLifetimeQuote={
                  foundationThreeMonthToFoundationLifetimeQuote
                }
              />
            </PlanCard>

            <PlanCard
              title="Higher"
              subtitle="Advanced GCSE Russian preparation"
              bestFor="For aiming towards Grades 7-9"
              priceLabel={higherPriceLabel}
              tone="highlight"
              optionNote="After checkout, it appears in your GCSE Russian dashboard."
              features={[
                "Full Higher course",
                "Advanced grammar and vocabulary",
                "Exam-style questions and mock exams",
                "Speaking, writing, listening, and reading practice",
                "Designed for Grades 7-9",
                "Progress tracking and structured learning",
              ]}
            >
              <HigherPlanPanel
                user={user ? { id: user.id } : null}
                pricing={higherPricing}
                foundationPricing={foundationPricing}
                planState={planState}
                activeSubscriptions={activeSubscriptions}
                foundationMonthlyToHigherMonthlyQuote={
                  foundationMonthlyToHigherMonthlyQuote
                }
                foundationMonthlyToHigherThreeMonthQuote={
                  foundationMonthlyToHigherThreeMonthQuote
                }
                foundationThreeMonthToHigherThreeMonthQuote={
                  foundationThreeMonthToHigherThreeMonthQuote
                }
                foundationLifetimeToHigherLifetimeQuote={
                  foundationLifetimeToHigherLifetimeQuote
                }
                higherMonthlyToThreeMonthQuote={higherMonthlyToThreeMonthQuote}
                higherMonthlyToHigherLifetimeQuote={higherMonthlyToHigherLifetimeQuote}
                higherThreeMonthToHigherLifetimeQuote={
                  higherThreeMonthToHigherLifetimeQuote
                }
              />
            </PlanCard>
          </div>

          {resolvedSearchParams.checkout === "success" ? (
            <FeedbackBanner
              tone="success"
              title="Checkout complete"
              description="Your course plan is being added. If it does not appear straight away, refresh the dashboard in a moment."
            />
          ) : null}

          {resolvedSearchParams.checkout === "cancelled" ? (
            <FeedbackBanner
              tone="warning"
              title="Checkout cancelled"
              description="No payment was taken. You can choose a plan again whenever you are ready."
            />
          ) : null}

          <VolnaSchoolRoute />

          <details className="app-card group px-4 py-3 text-sm text-[var(--text-secondary)]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-[var(--text-primary)]">
              <span className="inline-flex items-center gap-2">
                <AppIcon icon="help" size={16} />
                Not sure which option to choose?
              </span>
              <AppIcon
                icon="down"
                size={16}
                className="transition group-open:rotate-180"
              />
            </summary>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[...tierGuidance, ...checkoutSteps].map((item) => (
                <BillingInfoCard
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </details>

          <div className="app-card px-5 py-4 text-sm text-[var(--text-secondary)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="font-medium text-[var(--text-primary)]">
                  Need to change a monthly or 3-month plan?
                </p>
                <p className="text-sm leading-6 text-[var(--text-secondary)]">
                  Open Stripe&apos;s secure page to update payment details, renewal, or
                  cancellation.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 md:shrink-0 md:justify-end">
                <BillingPortalButton disabled={!hasActiveSubscription} />

                <Link
                  href="/pricing"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-ink)] hover:underline"
                >
                  Open public pricing
                  <AppIcon icon="externalLink" size={14} />
                </Link>

                <Link
                  href="/account"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-ink)] hover:underline"
                >
                  <AppIcon icon="back" size={14} />
                  Back to account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

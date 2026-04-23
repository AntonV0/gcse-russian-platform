import Link from "next/link";
import Badge from "@/components/ui/badge";
import AppIcon from "@/components/ui/app-icon";
import PlanCard from "@/components/billing/pricing/plan-card";
import FoundationPlanPanel from "@/components/billing/pricing/foundation-plan-panel";
import HigherPlanPanel from "@/components/billing/pricing/higher-plan-panel";
import { getPricingPageData } from "@/components/billing/pricing/data";
import { getCurrentUser } from "@/lib/auth/auth";
import { getFromPriceLabel } from "@/lib/billing/pricing-ui";

export default async function PricingPage() {
  const user = await getCurrentUser();

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

  return (
    <div className="py-5 md:py-8">
      <section className="app-surface-brand px-4 py-5 md:px-6 md:py-7">
        <div className="mx-auto max-w-5xl space-y-5">
          <div className="space-y-3 text-center">
            <Badge tone="info" icon="info">
              Pricing
            </Badge>

            <div className="space-y-2">
              <h1 className="text-balance text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-5xl">
                Choose your GCSE Russian course access
              </h1>
              <p className="mx-auto max-w-2xl text-sm leading-6 text-[var(--text-secondary)] md:text-base">
                Start with Foundation or go straight to Higher. Higher includes more
                advanced content and is designed for students aiming for the top grades.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
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

          <div className="app-card px-5 py-4 text-sm text-[var(--text-secondary)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="font-medium text-[var(--text-primary)]">
                  Looking for teacher-led learning?
                </p>
                <p className="text-sm leading-6 text-[var(--text-secondary)]">
                  You can also study through Volna School with live lessons and teacher
                  support. That flow stays separate from Stripe.
                </p>
              </div>

              <div className="md:shrink-0">
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
        </div>
      </section>
    </div>
  );
}

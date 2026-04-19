import Link from "next/link";
import Badge from "@/components/ui/badge";
import AppIcon from "@/components/ui/app-icon";
import CheckoutButton from "@/components/billing/checkout-button";
import { appIcons } from "@/lib/shared/icons";

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

export default function PricingPage() {
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
                Start with Foundation or go straight to Higher. All plans use Stripe
                checkout. Higher includes more advanced content and is designed for
                students aiming for the top grades.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <PlanCard
              title="Foundation"
              subtitle="Beginner-friendly structured GCSE Russian learning"
              priceLabel="From £49"
              features={[
                "Full Foundation course access",
                "Structured lessons and exercises",
                "Progress tracking",
                "Exam-focused content",
                "Suitable for beginners and GCSE students",
              ]}
            >
              <div className="space-y-3">
                <CheckoutButton
                  productCode="gcse-russian-foundation"
                  billingType="subscription"
                  intervalUnit="month"
                >
                  Buy Foundation Monthly (£49)
                </CheckoutButton>

                <CheckoutButton
                  productCode="gcse-russian-foundation"
                  billingType="one_time"
                >
                  Buy Foundation Lifetime (£299)
                </CheckoutButton>

                <p className="text-xs text-[var(--text-secondary)]">
                  3-month Foundation plans can be added to the UI next if you want, but
                  monthly is enough to test the full Stripe flow properly.
                </p>
              </div>
            </PlanCard>

            <PlanCard
              title="Higher"
              subtitle="Advanced GCSE Russian preparation for stronger students"
              priceLabel="From £59"
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
                <CheckoutButton
                  productCode="gcse-russian-higher"
                  billingType="subscription"
                  intervalUnit="month"
                >
                  Buy Higher Monthly (£59)
                </CheckoutButton>

                <CheckoutButton productCode="gcse-russian-higher" billingType="one_time">
                  Buy Higher Lifetime (£399)
                </CheckoutButton>

                <p className="text-xs text-[var(--text-secondary)]">
                  Upgrade pricing can be added after the main checkout + webhook flow is
                  fully working.
                </p>
              </div>
            </PlanCard>
          </div>

          <div className="app-card app-section-padding text-sm text-[var(--text-secondary)]">
            <p className="font-medium text-[var(--text-primary)]">
              Looking for teacher-led learning?
            </p>
            <p className="mt-2">
              You can also study through Volna School with live lessons and teacher
              support. That flow can stay separate from Stripe.
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

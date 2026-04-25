import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";

const plans = [
  {
    title: "Foundation",
    description:
      "Structured GCSE Russian learning for students building confidence with core topics, grammar, and exam practice.",
    features: [
      "Foundation pathway",
      "Trial lessons first",
      "Vocabulary and grammar practice",
      "Upgrade from inside the app",
    ],
  },
  {
    title: "Higher",
    description:
      "A more advanced route for students aiming for stronger GCSE outcomes and deeper exam preparation.",
    features: [
      "Higher pathway",
      "Advanced grammar and vocabulary",
      "Mock exam preparation",
      "Upgrade options for eligible students",
    ],
  },
];

export default function MarketingPricingPage() {
  return (
    <div className="space-y-8 py-8 md:py-12">
      <PageIntroPanel
        tone="brand"
        eyebrow="Pricing"
        title="Try the platform first, then choose access when ready"
        description="Most students should begin with a trial account. The marketing pricing page explains the available pathways, while exact checkout and upgrade options are handled securely inside the app."
        badges={
          <>
            <Badge tone="success" icon="completed">
              Trial-first funnel
            </Badge>
            <Badge tone="muted" icon="pricing">
              Foundation and Higher
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/signup" variant="primary" icon="create">
              Start trial
            </Button>
            <Button href="/login" variant="secondary" icon="user">
              Log in
            </Button>
          </>
        }
      />

      <section className="grid gap-4 lg:grid-cols-2">
        {plans.map((plan) => (
          <SectionCard
            key={plan.title}
            title={plan.title}
            description={plan.description}
            tone={plan.title === "Higher" ? "brand" : "student"}
            footer={
              <Button href="/signup" variant="primary" icon="create">
                Start trial
              </Button>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {plan.features.map((feature) => (
                <Card key={feature}>
                  <CardBody className="text-sm font-medium text-[var(--text-primary)]">
                    {feature}
                  </CardBody>
                </Card>
              ))}
            </div>
          </SectionCard>
        ))}
      </section>

      <SectionCard
        title="Already using the app?"
        description="Signed-in students can view exact billing and upgrade actions from their account area."
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

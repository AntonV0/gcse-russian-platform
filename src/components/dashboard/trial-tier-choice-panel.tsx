import { chooseTrialTierAction } from "@/app/actions/access/trial-access-actions";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";

const tierOptions = [
  {
    tier: "higher",
    label: "Higher Tier",
    badge: "Grades 7-9 possible",
    title: "I want access to the top grades",
    description:
      "Choose Higher if you already know some Russian or want the route that keeps grades 7-9 open.",
  },
  {
    tier: "foundation",
    label: "Foundation Tier",
    badge: "More supported start",
    title: "I need the gentler route",
    description:
      "Choose Foundation if Russian is very new and you want a slower, more scaffolded start.",
  },
] as const;

export function TrialTierChoicePanel() {
  return (
    <>
      <section className="app-surface-brand app-section-padding-lg">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <Badge tone="info" icon="unlocked">
              Trial account ready
            </Badge>
            <Badge tone="muted" icon="school">
              One GCSE tier decision
            </Badge>
          </div>

          <div className="space-y-2">
            <h2 className="app-heading-hero max-w-3xl">Choose your trial path</h2>
            <p className="app-subtitle max-w-2xl">
              Start with the route that best matches your goal. You can still sample the
              other tier during trial, but your dashboard will stay focused on this choice.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {tierOptions.map((option, index) => (
          <DashboardCard key={option.tier} className="h-full">
            <form action={chooseTrialTierAction} className="flex h-full flex-col gap-4">
              <input type="hidden" name="tier" value={option.tier} />

              <div className="flex flex-wrap gap-2">
                <Badge tone={option.tier === "higher" ? "info" : "success"} icon="layers">
                  {option.label}
                </Badge>
                <Badge tone="muted" icon={option.tier === "higher" ? "star" : "learning"}>
                  {option.badge}
                </Badge>
                {index === 0 ? (
                  <Badge tone="success" icon="sparkles">
                    Most students choose this
                  </Badge>
                ) : null}
              </div>

              <div className="min-h-[8rem] space-y-2">
                <h3 className="app-heading-section">{option.title}</h3>
                <p className="app-text-body-muted">{option.description}</p>
              </div>

              <div className="mt-auto">
                <Button type="submit" variant={index === 0 ? "primary" : "secondary"} icon="next">
                  Start {option.label} trial
                </Button>
              </div>
            </form>
          </DashboardCard>
        ))}
      </section>
    </>
  );
}

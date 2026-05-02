import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import EmptyState from "@/components/ui/empty-state";
import VisualPlaceholder from "@/components/ui/visual-placeholder";

const previewCards = [
  {
    title: "Past papers",
    description: "Free Pearson paper links stay open so families can use official resources.",
    href: "/past-papers",
    label: "Open past papers",
  },
  {
    title: "Vocabulary preview",
    description: "Browse the public vocabulary hub before creating a trial account.",
    href: "/vocabulary",
    label: "Preview vocabulary",
  },
  {
    title: "Grammar preview",
    description: "Use the public grammar hub to see how reference content is organised.",
    href: "/grammar",
    label: "Preview grammar",
  },
] as const;

export function GuestDashboardPanel() {
  return (
    <>
      <section className="app-surface-brand app-section-padding-lg">
        <EmptyState
          title="Preview the GCSE Russian app"
          description="Create a free trial account to choose Foundation or Higher, try sample lessons, save progress, and see the full dashboard experience."
          visual={
            <VisualPlaceholder
              category="learningPath"
              ariaLabel="Dashboard sign-in placeholder"
            />
          }
          action={
            <div className="flex flex-wrap gap-3">
              <Button href="/signup" variant="primary" icon="create">
                Start trial
              </Button>
              <Button href="/login" variant="secondary" icon="user">
                Log in
              </Button>
            </div>
          }
        />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {previewCards.map((card) => (
          <DashboardCard key={card.title} title={card.title}>
            <div className="space-y-3">
              <p>{card.description}</p>
              <Button href={card.href} variant="secondary" size="sm" icon="preview">
                {card.label}
              </Button>
            </div>
          </DashboardCard>
        ))}
      </section>

      <DashboardCard title="Course lessons are trial-only">
        <div className="space-y-3">
          <p>
            Course paths, modules, and lesson content unlock after signup so your trial can
            save the tier decision and lesson progress.
          </p>
          <Button href="/signup" variant="primary" icon="create">
            Create trial account
          </Button>
        </div>
      </DashboardCard>
    </>
  );
}

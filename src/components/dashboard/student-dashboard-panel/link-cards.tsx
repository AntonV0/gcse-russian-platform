import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";

export function DashboardLinkCard({
  title,
  description,
  href,
  linkLabel,
}: {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <DashboardCard title={title}>
      <div className="space-y-3">
        <p>{description}</p>
        <Button
          href={href}
          variant="secondary"
          size="sm"
          icon="next"
          iconPosition="right"
        >
          {linkLabel}
        </Button>
      </div>
    </DashboardCard>
  );
}

export function StudentSupportCard({
  accessMode,
}: {
  accessMode: DashboardInfo["accessMode"];
}) {
  return (
    <DashboardCard title={accessMode === "volna" ? "Assignments" : "Live support"}>
      <div className="space-y-3">
        {accessMode === "volna" ? (
          <>
            <p>
              Your Volna student area includes teacher-led assignments and guided support.
            </p>

            <Button href="/assignments" variant="secondary" size="sm" icon="assignments">
              View assignments
            </Button>
          </>
        ) : (
          <>
            <p>
              Looking for live support as well as self-study? Explore Volna School&apos;s
              online GCSE Russian classes.
            </p>

            <Button href="/online-classes" variant="secondary" size="sm" icon="school">
              Explore online classes
            </Button>
          </>
        )}
      </div>
    </DashboardCard>
  );
}

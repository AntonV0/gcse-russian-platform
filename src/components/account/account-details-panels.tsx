import AppIcon from "@/components/ui/app-icon";
import DashboardCard from "@/components/ui/dashboard-card";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import type { AppIconKey } from "@/lib/shared/icons";
import {
  formatAccessLabel,
  formatRoleLabel,
  getVariantLabel,
} from "./account-formatters";
import type { AccountProfileSummary } from "./account-overview-panel";

const recommendedSteps: {
  title: string;
  description: string;
  icon: AppIconKey;
}[] = [
  {
    title: "Make your profile feel right",
    description: "Set the name and avatar you want to use while studying.",
    icon: "userCheck",
  },
  {
    title: "Check course plans",
    description: "Compare Foundation, Higher, and Volna options when you are ready.",
    icon: "billing",
  },
  {
    title: "Choose your display style",
    description: "Pick a theme and colour that make the course easy to read.",
    icon: "palette",
  },
  {
    title: "Continue learning",
    description: "Head back to your dashboard for lessons and next steps.",
    icon: "dashboard",
  },
];

export function AccountDetailsPanels({
  dashboard,
  profile,
  email,
  courseAccessMode,
}: {
  dashboard: DashboardInfo;
  profile: AccountProfileSummary;
  email: string | null | undefined;
  courseAccessMode: string | null | undefined;
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
      <DashboardCard title="Account details">
        <div className="grid gap-3 sm:grid-cols-2">
          <AccountDetailTile
            label="Full name"
            value={profile.fullName ?? "No name saved"}
          />
          <AccountDetailTile
            label="Display name"
            value={profile.displayName ?? "No display name saved"}
          />
          <AccountDetailTile label="Email" value={email ?? "Not logged in"} />
          <AccountDetailTile label="Role" value={formatRoleLabel(dashboard.role)} />
          <AccountDetailTile
            label="Learning variant"
            value={getVariantLabel(dashboard.variant)}
          />
          <AccountDetailTile
            label="Access mode"
            value={formatAccessLabel(courseAccessMode ?? dashboard.accessMode)}
          />
        </div>
      </DashboardCard>

      <DashboardCard title="Helpful next steps">
        <div className="space-y-3">
          <p>Small account checks that make the course easier to come back to.</p>

          <div className="space-y-2">
            {recommendedSteps.map((step) => (
              <div key={step.title} className="app-tactile-row rounded-xl border p-3">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-[var(--accent-ink)]">
                    <AppIcon icon={step.icon} size={17} />
                  </span>

                  <div>
                    <div className="font-semibold text-[var(--text-primary)]">
                      {step.title}
                    </div>
                    <p className="mt-1 app-text-caption">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>
    </section>
  );
}

function AccountDetailTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="app-stat-tile">
      <div className="app-stat-label">{label}</div>
      <div className="app-stat-value">{value}</div>
    </div>
  );
}

import DashboardCard from "@/components/ui/dashboard-card";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  formatAccessLabel,
  formatRoleLabel,
  getVariantLabel,
} from "./account-formatters";
import type { AccountProfileSummary } from "./account-overview-panel";

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
        <div className="space-y-3">
          <div>
            <span className="font-medium text-[var(--text-primary)]">Full name:</span>{" "}
            {profile.fullName ?? "No name saved"}
          </div>

          <div>
            <span className="font-medium text-[var(--text-primary)]">
              Display name:
            </span>{" "}
            {profile.displayName ?? "No display name saved"}
          </div>

          <div>
            <span className="font-medium text-[var(--text-primary)]">Email:</span>{" "}
            {email ?? "Not logged in"}
          </div>

          <div>
            <span className="font-medium text-[var(--text-primary)]">Role:</span>{" "}
            {formatRoleLabel(dashboard.role)}
          </div>

          <div>
            <span className="font-medium text-[var(--text-primary)]">
              Learning variant:
            </span>{" "}
            {getVariantLabel(dashboard.variant)}
          </div>

          <div>
            <span className="font-medium text-[var(--text-primary)]">Access mode:</span>{" "}
            {formatAccessLabel(courseAccessMode ?? dashboard.accessMode)}
          </div>
        </div>
      </DashboardCard>

      <DashboardCard title="How this area is organised">
        <div className="space-y-3">
          <p>
            Account is the overview page for this section, while Profile and Settings
            handle the main editable parts of your student account.
          </p>

          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li>- Overview for account summary, access, and quick links</li>
            <li>- Profile for names and avatar</li>
            <li>- Settings for password, appearance, and future preferences</li>
          </ul>
        </div>
      </DashboardCard>
    </section>
  );
}

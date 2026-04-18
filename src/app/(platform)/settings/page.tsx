import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import EmptyState from "@/components/ui/empty-state";
import PageHeader from "@/components/layout/page-header";
import { appIcons } from "@/lib/shared/icons";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth/auth";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();

  if (!user) {
    return (
      <main className="space-y-6">
        <PageHeader
          title="Settings"
          description="Manage your account settings and security options."
        />

        <EmptyState
          title="You are not signed in"
          description="Log in to access your account settings."
          action={
            <Button href="/login" variant="primary" icon={appIcons.user}>
              Log in
            </Button>
          }
        />
      </main>
    );
  }

  return (
    <main className="space-y-8">
      <PageHeader
        title="Settings"
        description="Your account settings, security controls, and future preferences."
      />

      <section className="app-surface-brand app-section-padding-lg">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_320px] xl:items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon={appIcons.settings}>
                Account settings
              </Badge>
              <Badge tone="muted" icon={appIcons.user}>
                Student area
              </Badge>
            </div>

            <div className="space-y-2">
              <h2 className="app-title">Manage your account</h2>
              <p className="app-subtitle max-w-2xl">
                This page will become the main place for changing your email, updating
                your password, and managing account preferences safely.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href="/profile" variant="secondary" icon={appIcons.user}>
                View profile
              </Button>

              <Button href="/dashboard" variant="secondary" icon={appIcons.dashboard}>
                Back to dashboard
              </Button>
            </div>
          </div>

          <DashboardCard title="Account summary" className="h-full">
            <div className="space-y-3">
              <div>
                <div className="mb-1 text-xs font-medium uppercase tracking-wide app-text-soft">
                  Email
                </div>
                <div className="font-medium text-[var(--text-primary)]">
                  {user.email ?? "No email"}
                </div>
              </div>

              <div>
                <div className="mb-1 text-xs font-medium uppercase tracking-wide app-text-soft">
                  Full name
                </div>
                <div className="font-medium text-[var(--text-primary)]">
                  {profile?.full_name ?? "Not added yet"}
                </div>
              </div>

              <div>
                <div className="mb-1 text-xs font-medium uppercase tracking-wide app-text-soft">
                  Security
                </div>
                <div className="font-medium text-[var(--text-primary)]">
                  Settings foundation ready
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DashboardCard title="Email address">
          <div className="space-y-3">
            <p>Your current email is the address used for sign-in and account access.</p>

            <div className="rounded-xl bg-[var(--background-muted)] p-3">
              <div className="text-sm font-medium text-[var(--text-primary)]">
                {user.email ?? "No email"}
              </div>
            </div>

            <p className="text-sm app-text-muted">
              Email update controls can be added next once you are happy with the account
              settings flow.
            </p>
          </div>
        </DashboardCard>

        <DashboardCard title="Password">
          <div className="space-y-3">
            <p>
              Password change tools can live here as part of the secure account settings
              flow.
            </p>

            <div className="rounded-xl bg-[var(--background-muted)] p-3">
              <div className="text-sm font-medium text-[var(--text-primary)]">
                Password management coming next
              </div>
            </div>

            <p className="text-sm app-text-muted">
              This is intentionally left as a safe placeholder until the write actions are
              added.
            </p>
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DashboardCard title="Preferences">
          <div className="space-y-3">
            <p>
              Future settings can include dashboard preferences, revision options, and
              account-level choices.
            </p>

            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>• Personalisation options</li>
              <li>• Theme and interface preferences</li>
              <li>• Revision-related settings</li>
            </ul>
          </div>
        </DashboardCard>

        <DashboardCard title="Safety and account care">
          <div className="space-y-3">
            <p>
              Since many students are younger, account features should stay simple,
              predictable, and easy to understand.
            </p>

            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>• Preset avatars instead of image uploads</li>
              <li>• Clear wording for security changes</li>
              <li>• Minimal friction for core account tasks</li>
            </ul>
          </div>
        </DashboardCard>
      </section>
    </main>
  );
}

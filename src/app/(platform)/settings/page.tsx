import ThemeAccentSelector from "@/components/settings/theme-accent-selector";
import ThemeModeSelector from "@/components/settings/theme-mode-selector";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import { updatePassword } from "@/app/actions/auth/auth";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth/auth";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string; error?: string }>;
}) {
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();
  const resolvedSearchParams = (await searchParams) ?? {};

  if (!user) {
    return (
      <main className="space-y-6">
        <PageHeader
          title="Settings"
          description="Manage your account security, appearance, and preferences."
        />

        <EmptyState
          title="You are not signed in"
          description="Log in to access your account settings."
          action={
            <Button href="/login" variant="primary" icon="user">
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
        description="Manage your account security, appearance, and preferences."
      />

      {resolvedSearchParams.success ? (
        <FeedbackBanner
          tone="success"
          title="Password updated"
          description="Your password was updated successfully."
        />
      ) : null}

      {resolvedSearchParams.error ? (
        <FeedbackBanner
          tone="danger"
          title="Password update failed"
          description={resolvedSearchParams.error}
        />
      ) : null}

      <section className="app-surface-brand app-section-padding-lg">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_320px] xl:items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="settings">
                Settings
              </Badge>
              <Badge tone="muted" icon="dashboard">
                Account area
              </Badge>
            </div>

            <div className="space-y-2">
              <h2 className="app-title">Security, appearance, and preferences</h2>
              <p className="app-subtitle max-w-2xl">
                Settings is where you manage how your account behaves. Password changes
                are available now, and appearance and preference tools can grow here
                without mixing into Profile.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href="/account" variant="secondary" icon="dashboard">
                Open overview
              </Button>

              <Button href="/profile" variant="secondary" icon="user">
                View profile
              </Button>

              <Button href="/dashboard" variant="secondary" icon="dashboard">
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
                  Display name
                </div>
                <div className="font-medium text-[var(--text-primary)]">
                  {profile?.display_name ?? "Not added yet"}
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DashboardCard title="Email address">
          <div className="space-y-3">
            <p>Your sign-in email is shown below.</p>

            <div className="rounded-xl bg-[var(--background-muted)] p-3">
              <div className="text-sm font-medium text-[var(--text-primary)]">
                {user.email ?? "No email"}
              </div>
            </div>

            <p className="text-sm app-text-muted">
              Changing sign-in email should be added as a separate Supabase auth flow,
              rather than only updating the profile table.
            </p>
          </div>
        </DashboardCard>

        <DashboardCard title="Password">
          <form action={updatePassword} className="space-y-4">
            <FormField label="New password">
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter new password"
                minLength={8}
                required
              />
            </FormField>

            <FormField label="Confirm new password">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repeat new password"
                minLength={8}
                required
              />
            </FormField>

            <p className="text-sm app-text-muted">
              Use at least 8 characters for a stronger password.
            </p>

            <Button type="submit" variant="primary" icon="save">
              Update password
            </Button>
          </form>
        </DashboardCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DashboardCard title="Appearance">
          <div className="space-y-6">
            <ThemeModeSelector />
            <div className="h-px bg-[var(--border-subtle)]" />
            <ThemeAccentSelector />
          </div>
        </DashboardCard>

        <DashboardCard title="Preferences">
          <div className="space-y-3">
            <p>
              Future settings can include personalisation, revision preferences, and
              dashboard options.
            </p>

            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>• Revision preferences</li>
              <li>• Dashboard preferences</li>
              <li>• Study experience options</li>
            </ul>
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DashboardCard title="How this area is organised">
          <div className="space-y-3">
            <p>
              Settings controls how your account behaves, while Overview and Profile cover
              account summary and personal identity details.
            </p>

            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>• Overview for account summary and access</li>
              <li>• Profile for names and avatar</li>
              <li>• Settings for security, appearance, and preferences</li>
            </ul>
          </div>
        </DashboardCard>

        <DashboardCard title="Account design notes">
          <div className="space-y-3">
            <p>
              This settings area is designed to stay simple and easy to understand for
              younger students.
            </p>

            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>• Clear account wording</li>
              <li>• Minimal friction for key actions</li>
              <li>• Safer preset profile customisation</li>
            </ul>
          </div>
        </DashboardCard>
      </section>
    </main>
  );
}

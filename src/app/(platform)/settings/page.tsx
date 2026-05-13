import ThemeAccentSelector from "@/components/settings/theme-accent-selector";
import ThemeModeSelector from "@/components/settings/theme-mode-selector";
import PasswordSecurityForm from "@/components/settings/password-security-form";
import PageHeader from "@/components/layout/page-header";
import AppIcon from "@/components/ui/app-icon";
import AppLogo from "@/components/ui/app-logo";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth/auth";

function AppearancePreview() {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)]/90 p-4 shadow-[var(--shadow-sm)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <AppLogo
          variant="domain"
          size="sm"
          subtitle="Theme preview"
          showIcon
          className="min-w-0"
        />

        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--accent-selected-border)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--background-elevated))] text-[var(--accent-on-soft)]">
          <AppIcon icon="palette" size={18} />
        </span>
      </div>

      <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--background-muted)_70%,var(--background-elevated))] p-3">
        <div className="rounded-lg border border-[var(--accent-selected-border)] bg-[var(--background-elevated)] p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-[var(--accent-ink)]">
                Lesson progress
              </div>
              <div className="mt-1 text-sm font-bold text-[var(--text-primary)]">
                Ready for the next small step
              </div>
            </div>
            <span className="rounded-full bg-[var(--accent-fill)] px-2.5 py-1 text-xs font-bold text-[var(--accent-on-fill)] shadow-[0_8px_18px_color-mix(in_srgb,var(--accent)_12%,transparent)]">
              72%
            </span>
          </div>

          <div className="app-progress-track">
            <div className="app-progress-bar w-[72%]" />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--accent)_8%,var(--background-elevated))] text-[var(--accent-on-soft)]">
                <AppIcon icon="lessons" size={15} />
              </span>
              <span className="text-sm font-bold text-[var(--text-primary)]">
                Practice
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-[var(--background-muted)]" />
            <div className="mt-2 h-2 w-2/3 rounded-full [background:var(--accent-progress-gradient)]" />
          </div>

          <div className="app-selected-surface rounded-lg border p-3">
            <div className="mb-2 flex items-center gap-2">
              <AppIcon icon="completed" size={16} />
              <span className="text-sm font-bold">Selected style</span>
            </div>
            <div className="h-2 w-4/5 rounded-full bg-[var(--background-elevated)]/70" />
            <div className="mt-2 h-2 w-1/2 rounded-full bg-[var(--background-elevated)]/70" />
          </div>
        </div>
      </div>
    </div>
  );
}

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
          description="Choose how the course looks, then manage your account security."
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

  const profileComplete = Boolean(profile?.full_name && profile?.display_name);

  return (
    <main className="space-y-7">
      {resolvedSearchParams.success ? (
        <FeedbackBanner
          tone="success"
          title="Password updated"
          description="Your new password is ready to use the next time you sign in."
        />
      ) : null}

      {resolvedSearchParams.error ? (
        <FeedbackBanner
          tone="danger"
          title="Password update failed"
          description={resolvedSearchParams.error}
        />
      ) : null}

      <section id="appearance" className="app-settings-surface app-section-padding-lg">
        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge tone="info" icon="palette">
                  Appearance
                </Badge>
                <Badge tone={profileComplete ? "success" : "warning"} icon="userCheck">
                  {profileComplete ? "Profile ready" : "Profile needs details"}
                </Badge>
              </div>

              <div className="space-y-2">
                <h1 className="app-heading-hero">Make GCSE Russian feel like yours</h1>
                <p className="app-subtitle max-w-2xl">
                  Pick a comfortable display mode and a colour that makes the learning
                  space feel clear, bright, and easy to come back to.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="app-pill app-pill-info">Changes save as you choose</span>
                <span className="app-pill app-pill-muted">Password settings below</span>
              </div>
            </div>

            <AppearancePreview />
          </div>

          <div className="grid gap-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)]/76 p-4 shadow-[var(--shadow-sm)]">
            <ThemeModeSelector />
            <div className="h-px bg-[var(--border-subtle)]" />
            <ThemeAccentSelector />
          </div>
        </div>
      </section>

      <section id="security" className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_360px]">
        <DashboardCard title="Password and security">
          <PasswordSecurityForm />
        </DashboardCard>

        <DashboardCard title="Account details">
          <div className="grid gap-3">
            <div className="app-stat-tile">
              <div className="app-stat-label">Email</div>
              <div className="app-stat-value">{user.email ?? "No email"}</div>
            </div>

            <div className="app-stat-tile">
              <div className="app-stat-label">Display name</div>
              <div className="app-stat-value">
                {profile?.display_name ?? "Not added yet"}
              </div>
            </div>

            <div className="app-stat-tile">
              <div className="app-stat-label">Full name</div>
              <div className="app-stat-value">
                {profile?.full_name ?? "Not added yet"}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button href="/profile" variant="secondary" icon="user">
              Edit profile
            </Button>

            <Button href="/account/billing" variant="secondary" icon="billing">
              Billing
            </Button>

            <Button href="/account" variant="secondary" icon="dashboard">
              Account overview
            </Button>
          </div>
        </DashboardCard>
      </section>
    </main>
  );
}

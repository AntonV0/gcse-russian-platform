import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import EmptyState from "@/components/ui/empty-state";
import PageHeader from "@/components/layout/page-header";
import { appIcons } from "@/lib/shared/icons";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth/auth";

const presetAvatars = [
  { id: "snow-fox", emoji: "🦊", label: "Snow Fox" },
  { id: "polar-bear", emoji: "🐻‍❄️", label: "Polar Bear" },
  { id: "owl", emoji: "🦉", label: "Owl" },
  { id: "wolf", emoji: "🐺", label: "Wolf" },
  { id: "penguin", emoji: "🐧", label: "Penguin" },
  { id: "tiger", emoji: "🐯", label: "Tiger" },
  { id: "cat", emoji: "🐱", label: "Cat" },
  { id: "dog", emoji: "🐶", label: "Dog" },
];

function getInitials(name: string | null | undefined, email: string | null | undefined) {
  if (name && name.trim()) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }

  if (email) {
    return email.slice(0, 2).toUpperCase();
  }

  return "ST";
}

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();

  if (!user) {
    return (
      <main className="space-y-6">
        <PageHeader
          title="Profile"
          description="View your account details and personalise your student profile."
        />

        <EmptyState
          title="You are not signed in"
          description="Log in to access your student profile."
          action={
            <Button href="/login" variant="primary" icon={appIcons.user}>
              Log in
            </Button>
          }
        />
      </main>
    );
  }

  const fullName = profile?.full_name ?? null;
  const initials = getInitials(fullName, user.email);

  return (
    <main className="space-y-8">
      <PageHeader
        title="Profile"
        description="Your student profile, account summary, and future personalisation settings."
      />

      <section className="app-surface-brand app-section-padding-lg">
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background-elevated)] text-2xl font-semibold text-[var(--brand-blue)] shadow-[var(--shadow-sm)]">
              {initials}
            </div>

            <div className="space-y-1">
              <div className="text-lg font-semibold text-[var(--text-primary)]">
                {fullName ?? "Student"}
              </div>
              <div className="text-sm app-text-muted">{user.email}</div>
            </div>

            <Badge tone="info" icon={appIcons.user}>
              Student profile
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="app-title">Your profile area</h2>
              <p className="app-subtitle max-w-2xl">
                This page will become the main place for choosing a preset avatar,
                updating your display details, and personalising your student account.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href="/settings" variant="primary" icon={appIcons.settings}>
                Open settings
              </Button>

              <Button href="/dashboard" variant="secondary" icon={appIcons.dashboard}>
                Back to dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DashboardCard title="Profile details">
          <div className="space-y-3">
            <div>
              <div className="mb-1 text-xs font-medium uppercase tracking-wide app-text-soft">
                Full name
              </div>
              <div className="font-medium text-[var(--text-primary)]">
                {fullName ?? "Not added yet"}
              </div>
            </div>

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
                Profile status
              </div>
              <div className="font-medium text-[var(--text-primary)]">
                Ready for customisation
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="What comes next">
          <div className="space-y-3">
            <p>
              The next account milestone can add editable profile fields, preset avatar
              saving, and account security actions once the profile schema is confirmed.
            </p>

            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>• Preset avatar selection</li>
              <li>• Display name / username editing</li>
              <li>• Email update flow</li>
              <li>• Password change tools</li>
            </ul>
          </div>
        </DashboardCard>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Preset avatars
          </h2>
          <p className="mt-1 text-sm app-text-muted">
            A safe preset avatar system is a better fit for younger students than free
            image uploads.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {presetAvatars.map((avatar) => (
            <div
              key={avatar.id}
              className="app-card flex flex-col items-center gap-3 p-5 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--background-muted)] text-3xl">
                <span aria-hidden="true">{avatar.emoji}</span>
              </div>

              <div>
                <div className="font-medium text-[var(--text-primary)]">
                  {avatar.label}
                </div>
                <div className="mt-1 text-xs app-text-soft">Preset avatar option</div>
              </div>

              <Button type="button" variant="secondary" icon={appIcons.user}>
                Choose later
              </Button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

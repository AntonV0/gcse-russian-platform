import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import { updateStudentProfile } from "@/app/actions/auth/auth";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth/auth";

const presetAvatars = [
  { key: "snow-fox", emoji: "🦊", label: "Snow Fox", russian: "Снежная лиса" },
  { key: "owl", emoji: "🦉", label: "Owl", russian: "Сова" },
  { key: "wolf", emoji: "🐺", label: "Wolf", russian: "Волк" },
  { key: "tiger", emoji: "🐯", label: "Tiger", russian: "Тигр" },
  { key: "cat", emoji: "🐱", label: "Cat", russian: "Кот" },
  { key: "dog", emoji: "🐶", label: "Dog", russian: "Собака" },
  { key: "bear", emoji: "🐻", label: "Bear", russian: "Медведь" },
  { key: "penguin", emoji: "🐧", label: "Penguin", russian: "Пингвин" },
  { key: "rabbit", emoji: "🐰", label: "Rabbit", russian: "Кролик" },
  { key: "hedgehog", emoji: "🦔", label: "Hedgehog", russian: "Ёж" },
  { key: "frog", emoji: "🐸", label: "Frog", russian: "Лягушка" },
  { key: "whale", emoji: "🐋", label: "Whale", russian: "Кит" },

  { key: "star", emoji: "⭐", label: "Star", russian: "Звезда" },
  { key: "moon", emoji: "🌙", label: "Moon", russian: "Луна" },
  { key: "sun", emoji: "☀️", label: "Sun", russian: "Солнце" },
  { key: "book", emoji: "📘", label: "Book", russian: "Книга" },
  { key: "globe", emoji: "🌍", label: "Globe", russian: "Мир" },
  { key: "mountain", emoji: "⛰️", label: "Mountain", russian: "Гора" },
  { key: "wave", emoji: "🌊", label: "Wave", russian: "Волна" },
  { key: "sparkles", emoji: "✨", label: "Sparkles", russian: "Искры" },
  { key: "compass", emoji: "🧭", label: "Compass", russian: "Компас" },
  { key: "crown", emoji: "👑", label: "Crown", russian: "Корона" },
];

function getAvatarEmoji(avatarKey: string | null | undefined) {
  return presetAvatars.find((avatar) => avatar.key === avatarKey)?.emoji ?? "🎓";
}

export default async function ProfilePage({
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
          title="Profile"
          description="Update the personal details used around your account area."
        />

        <EmptyState
          title="You are not signed in"
          description="Log in to access your student profile."
          action={
            <Button href="/login" variant="primary" icon="user">
              Log in
            </Button>
          }
        />
      </main>
    );
  }

  const currentAvatarKey =
    "avatar_key" in (profile ?? {}) && typeof profile?.avatar_key === "string"
      ? profile.avatar_key
      : null;

  return (
    <main className="space-y-8">
      <PageHeader
        title="Profile"
        description="Update the personal details used around your account area."
      />

      {resolvedSearchParams.success ? (
        <FeedbackBanner
          tone="success"
          title="Profile updated"
          description="Your profile was updated successfully."
        />
      ) : null}

      {resolvedSearchParams.error ? (
        <FeedbackBanner
          tone="danger"
          title="Profile update failed"
          description={resolvedSearchParams.error}
        />
      ) : null}

      <section className="app-surface-brand app-section-padding-lg">
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background-elevated)] text-5xl shadow-[var(--shadow-sm)]">
              <span aria-hidden="true">{getAvatarEmoji(currentAvatarKey)}</span>
            </div>

            <div className="space-y-1">
              <div className="text-lg font-semibold text-[var(--text-primary)]">
                {profile?.display_name ?? profile?.full_name ?? "Student"}
              </div>
              <div className="text-sm app-text-muted">{user.email}</div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <Badge tone="info" icon="user">
                Profile
              </Badge>
              <Badge tone="muted" icon="dashboard">
                Account area
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="app-title">Personalise your profile</h2>
              <p className="app-subtitle max-w-2xl">
                Choose a preset avatar and update the name shown around your student area.
                Profile is where you manage your personal identity details, while Settings
                handles security and appearance.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href="/account" variant="secondary" icon="dashboard">
                Open overview
              </Button>

              <Button href="/settings" variant="secondary" icon="settings">
                Open settings
              </Button>

              <Button href="/dashboard" variant="secondary" icon="dashboard">
                Back to dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      <form action={updateStudentProfile} className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-2">
          <DashboardCard title="Profile details">
            <div className="space-y-4">
              <FormField label="Full name">
                <Input
                  id="fullName"
                  name="fullName"
                  defaultValue={profile?.full_name ?? ""}
                  placeholder="Enter full name"
                />
              </FormField>

              <FormField label="Display name">
                <Input
                  id="displayName"
                  name="displayName"
                  defaultValue={profile?.display_name ?? ""}
                  placeholder="Enter display name"
                />
              </FormField>

              <FormField label="Email">
                <Input id="email" name="email" defaultValue={user.email ?? ""} disabled />
              </FormField>

              <p className="text-sm app-text-muted">
                Email sign-in changes live in Settings. This field is shown here for
                reference only.
              </p>
            </div>
          </DashboardCard>

          <DashboardCard title="Selected avatar">
            <div className="flex h-full flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="rounded-2xl bg-[var(--background-muted)] p-4">
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide app-text-soft">
                    Current choice
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--background-elevated)] text-3xl">
                      <span aria-hidden="true">{getAvatarEmoji(currentAvatarKey)}</span>
                    </div>

                    <div>
                      <div className="font-medium text-[var(--text-primary)]">
                        {presetAvatars.find((avatar) => avatar.key === currentAvatarKey)
                          ?.label ?? "Default student avatar"}
                      </div>
                      <div className="text-sm app-text-muted">
                        {presetAvatars.find((avatar) => avatar.key === currentAvatarKey)
                          ?.russian ?? "Студент"}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm app-text-muted">
                  Pick an avatar that feels fun and easy to recognise inside the platform.
                </p>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" icon="save">
                  Save profile
                </Button>
              </div>
            </div>
          </DashboardCard>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Preset avatars
            </h2>
            <p className="mt-1 text-sm app-text-muted">
              Choose from preset avatars with a little Russian included.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {presetAvatars.map((avatar) => {
              const isSelected = currentAvatarKey === avatar.key;

              return (
                <label
                  key={avatar.key}
                  className={[
                    "app-card flex cursor-pointer flex-col items-center gap-3 p-5 text-center transition",
                    isSelected
                      ? "app-selected-surface"
                      : "hover:-translate-y-0.5",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="avatarKey"
                    value={avatar.key}
                    defaultChecked={isSelected}
                    className="sr-only"
                  />

                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--background-muted)] text-3xl">
                    <span aria-hidden="true">{avatar.emoji}</span>
                  </div>

                  <div>
                    <div className="font-medium text-[var(--text-primary)]">
                      {avatar.label}
                    </div>
                    <div className="mt-1 text-sm app-text-muted">{avatar.russian}</div>
                  </div>

                  <span
                    className={[
                      "rounded-full px-3 py-1 text-xs font-medium",
                      isSelected
                        ? "[background:var(--accent-gradient-fill)] text-[var(--accent-on-fill)] shadow-[0_8px_18px_color-mix(in_srgb,var(--accent)_16%,transparent)]"
                        : "bg-[var(--background-muted)] text-[var(--text-secondary)]",
                    ].join(" ")}
                  >
                    {isSelected ? "Selected" : "Choose"}
                  </span>
                </label>
              );
            })}
          </div>
        </section>
      </form>
    </main>
  );
}

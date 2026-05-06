"use client";

import { useEffect, useMemo, useState } from "react";
import { updateStudentProfile } from "@/app/actions/auth/auth";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";

export type ProfileAvatarOption = {
  key: string;
  emoji: string;
  label: string;
  russian: string;
};

export type ProfileLearningSnapshot = {
  roleLabel: string;
  courseLabel: string;
  accessLabel: string;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  nextLessonTitle: string | null;
  nextLessonMeta: string | null;
  nextLessonHref: string | null;
};

type ProfileEditorProps = {
  avatars: ProfileAvatarOption[];
  email: string | null | undefined;
  initialFullName: string | null | undefined;
  initialDisplayName: string | null | undefined;
  initialAvatarKey: string | null | undefined;
  learningSnapshot: ProfileLearningSnapshot;
  profileUpdated?: boolean;
};

const AVATARS_PER_PAGE = 12;

const defaultAvatar = {
  key: "default",
  emoji: "",
  label: "Initials",
  russian: "Инициалы",
} satisfies ProfileAvatarOption;

function AvatarEmoji({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={[
        "inline-flex h-[1em] w-[1em] items-center justify-center leading-none",
        "[font-family:'Segoe_UI_Emoji','Apple_Color_Emoji','Noto_Color_Emoji',sans-serif]",
        "[font-variant-emoji:emoji]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

function getAvatar(avatars: ProfileAvatarOption[], avatarKey: string | null | undefined) {
  return avatars.find((avatar) => avatar.key === avatarKey) ?? defaultAvatar;
}

function getProfileInitials(name: string, email: string | null | undefined) {
  const source = name.trim() || email?.split("@")[0] || "Student";
  const parts = source.split(/[\s._-]+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }

  return (parts[0] ?? "ST").slice(0, 2).toUpperCase();
}

function isInitialsAvatar(avatar: ProfileAvatarOption) {
  return avatar.key === "" || avatar.key === "default";
}

function AvatarMark({
  avatar,
  initials,
}: {
  avatar: ProfileAvatarOption;
  initials: string;
}) {
  if (isInitialsAvatar(avatar)) {
    return (
      <span className="text-[0.62em] font-bold leading-none tracking-normal text-[var(--accent-ink)]">
        {initials}
      </span>
    );
  }

  return <AvatarEmoji>{avatar.emoji}</AvatarEmoji>;
}

function getAvatarPageForKey(avatars: ProfileAvatarOption[], avatarKey: string) {
  const selectedIndex = avatars.findIndex((avatar) => avatar.key === avatarKey);

  return selectedIndex >= 0 ? Math.floor(selectedIndex / AVATARS_PER_PAGE) : 0;
}

function ProfilePreviewCard({
  avatar,
  displayName,
  hasChanges,
  initials,
  compact = false,
}: {
  avatar: ProfileAvatarOption;
  displayName: string;
  hasChanges: boolean;
  initials: string;
  compact?: boolean;
}) {
  return (
    <div
      className={["app-feature-panel-preview", compact ? "p-4" : "p-5"].join(" ")}
      aria-live="polite"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[0.78rem] font-semibold text-[var(--accent-ink)]">
            <AppIcon icon="preview" size={15} />
            Your profile preview
          </div>
          <p className="mt-1 text-sm app-text-muted">
            Check how your name and avatar look.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[var(--accent-decorative-border)] bg-[var(--surface-muted-bg)] text-5xl shadow-[0_10px_24px_color-mix(in_srgb,var(--accent)_7%,transparent)]">
          <AvatarMark avatar={avatar} initials={initials} />
        </span>

        <div className="min-w-0">
          <div className="text-xl font-bold text-[var(--text-primary)]">
            {displayName}
          </div>
          <p className="mt-1.5 text-sm app-text-muted">
            Shown in lessons and your account.
          </p>
        </div>
      </div>

      {hasChanges ? (
        <div className="mt-5 border-t border-[var(--border-subtle)] pt-4">
          <div className="flex flex-col gap-3 rounded-xl border border-[var(--accent-decorative-border)] bg-[var(--surface-muted-bg)] p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Ready to save this profile?
            </p>
            <Button
              type="submit"
              name="intent"
              value="all"
              variant="primary"
              size="sm"
              icon="save"
            >
              Save changes
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProfileUpdatedInline() {
  return (
    <div className="rounded-lg border border-[var(--success-border)] bg-[var(--success-surface)] px-3.5 py-2.5 text-[var(--success-text)] shadow-[0_8px_18px_var(--success-shadow)]">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <AppIcon icon="completed" size={16} strokeWidth={2.2} />
        Profile updated
      </div>
      <p className="mt-0.5 text-sm app-text-muted">
        Your saved name and avatar have been updated.
      </p>
    </div>
  );
}

function LearningSnapshotCard({ snapshot }: { snapshot: ProfileLearningSnapshot }) {
  const progressLabel =
    snapshot.totalLessons > 0
      ? `${snapshot.completedLessons} of ${snapshot.totalLessons}`
      : `${snapshot.completedLessons} completed`;

  return (
    <section className="app-surface-muted p-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
            <AppIcon icon="dashboard" size={15} />
            Learning context
          </div>
          <p className="mt-1 text-sm app-text-muted">
            Your profile stays connected to your course and lesson progress.
          </p>
        </div>

        {snapshot.nextLessonHref ? (
          <Button href={snapshot.nextLessonHref} variant="secondary" icon="next">
            Continue learning
          </Button>
        ) : (
          <Button href="/dashboard" variant="secondary" icon="dashboard">
            Open dashboard
          </Button>
        )}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
            <AppIcon icon="userCheck" size={15} />
            Account role
          </div>
          <div className="mt-1.5 text-base font-semibold text-[var(--text-primary)]">
            {snapshot.roleLabel}
          </div>
          <p className="mt-1 text-sm app-text-muted">{snapshot.accessLabel}</p>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
            <AppIcon icon="courses" size={15} />
            Course path
          </div>
          <div className="mt-1.5 text-base font-semibold text-[var(--text-primary)]">
            {snapshot.courseLabel}
          </div>
          <p className="mt-1 text-sm app-text-muted">Current learning route</p>
        </div>

        <div className="rounded-xl border border-[var(--surface-accent-border)] bg-[var(--surface-muted-bg)] p-3 shadow-[var(--shadow-xs)]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent-ink)]">
            <AppIcon icon="completed" size={15} />
            Lesson progress
          </div>
          <div className="mt-1.5 text-base font-semibold text-[var(--text-primary)]">
            {progressLabel}
          </div>
          <div
            className="app-progress-track mt-3"
            role="progressbar"
            aria-label="Course lesson progress"
            aria-valuenow={snapshot.progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="app-progress-bar"
              style={{ width: `${snapshot.progressPercent}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
            <AppIcon icon={snapshot.nextLessonHref ? "next" : "dashboard"} size={15} />
            Next step
          </div>
          <div className="min-w-0">
            <div className="mt-1.5 truncate text-base font-semibold text-[var(--text-primary)]">
              {snapshot.nextLessonTitle ?? "Open your dashboard"}
            </div>
            <p className="mt-1 text-sm app-text-muted">
              {snapshot.nextLessonMeta ??
                "Your dashboard will show the best next place to continue."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProfileEditor({
  avatars,
  email,
  initialFullName,
  initialDisplayName,
  initialAvatarKey,
  learningSnapshot,
  profileUpdated = false,
}: ProfileEditorProps) {
  const [fullName, setFullName] = useState(initialFullName ?? "");
  const [displayName, setDisplayName] = useState(initialDisplayName ?? "");
  const [avatarKey, setAvatarKey] = useState(initialAvatarKey ?? "");
  const [showProfileUpdated, setShowProfileUpdated] = useState(profileUpdated);
  const [avatarPage, setAvatarPage] = useState(() => {
    return getAvatarPageForKey(avatars, initialAvatarKey ?? "");
  });

  const selectedAvatar = useMemo(
    () => getAvatar(avatars, avatarKey),
    [avatarKey, avatars]
  );
  const avatarPageCount = Math.max(1, Math.ceil(avatars.length / AVATARS_PER_PAGE));
  const activeAvatarPage = Math.min(avatarPage, avatarPageCount - 1);
  const visibleAvatars = avatars.slice(
    activeAvatarPage * AVATARS_PER_PAGE,
    activeAvatarPage * AVATARS_PER_PAGE + AVATARS_PER_PAGE
  );
  const previewName = displayName.trim() || fullName.trim() || "Student";
  const initials = getProfileInitials(fullName || displayName, email);
  const hasDetailsChanges =
    fullName !== (initialFullName ?? "") || displayName !== (initialDisplayName ?? "");
  const hasAvatarChanges = avatarKey !== (initialAvatarKey ?? "");
  const hasAnyChanges = hasDetailsChanges || hasAvatarChanges;
  const resetDetailsChanges = () => {
    setFullName(initialFullName ?? "");
    setDisplayName(initialDisplayName ?? "");
  };
  const resetAvatarChanges = () => {
    const savedAvatarKey = initialAvatarKey ?? "";

    setAvatarKey(savedAvatarKey);
    setAvatarPage(getAvatarPageForKey(avatars, savedAvatarKey));
  };

  useEffect(() => {
    if (!profileUpdated) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShowProfileUpdated(false);

      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }, 5200);

    return () => window.clearTimeout(timeoutId);
  }, [profileUpdated]);

  return (
    <form action={updateStudentProfile} className="space-y-6 xl:-mb-6">
      <section className="app-surface-brand app-section-padding-lg">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-center">
          <div className="flex min-w-0 flex-col justify-center gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="user">
                Student profile
              </Badge>
              <Badge tone="muted" icon="palette">
                Name and avatar
              </Badge>
            </div>

            <div className="space-y-2">
              <h1 className="app-heading-hero">Build your student profile</h1>
              <p className="app-subtitle max-w-2xl">
                Choose a name and avatar that make GCSE Russian feel like yours.
              </p>
            </div>

            {showProfileUpdated ? <ProfileUpdatedInline /> : null}

            <div className="app-feature-panel-actions">
              <Button href="#profile-details" variant="secondary" size="sm" icon="user">
                Edit details
              </Button>

              <Button href="#profile-avatar" variant="quiet" size="sm" icon="palette">
                Choose avatar
              </Button>
            </div>
          </div>

          <ProfilePreviewCard
            avatar={selectedAvatar}
            displayName={previewName}
            hasChanges={hasAnyChanges}
            initials={initials}
          />
        </div>
      </section>

      <section
        id="profile-details"
        className="app-surface app-section-padding flex flex-col gap-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="app-heading-section">Your details</h2>
            <p className="mt-1 text-sm app-text-muted">Choose how your name appears.</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <FormField
            label="Full name"
            description="For certificates, reports, and teacher feedback."
          >
            <Input
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Enter full name"
            />
          </FormField>

          <FormField
            label="Display name"
            description="The shorter name you want to see in lessons."
          >
            <Input
              id="displayName"
              name="displayName"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Enter display name"
            />
          </FormField>

          <FormField
            label="Email"
            description={
              <>
                Sign-in email changes are found in{" "}
                <a
                  href="/settings"
                  className="font-bold text-[var(--accent-ink)] underline-offset-4 hover:underline"
                >
                  Settings
                </a>
                .
              </>
            }
            className="lg:col-span-2"
          >
            <Input id="email" name="email" value={email ?? ""} disabled readOnly />
          </FormField>
        </div>

        <div
          className={[
            "mt-auto flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between",
            hasDetailsChanges
              ? "border-[var(--accent-decorative-border)] bg-[var(--surface-muted-bg)] shadow-[0_8px_18px_color-mix(in_srgb,var(--accent)_8%,transparent)]"
              : "border-[var(--border-subtle)] bg-[var(--background-muted)]",
          ].join(" ")}
        >
          <div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">
              {hasDetailsChanges ? "Ready to update your details?" : "No detail changes"}
            </div>
            <p className="mt-1 text-sm app-text-muted">
              {hasDetailsChanges
                ? "Save after changing your full name or display name."
                : "Your details are saved."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Button
              type="submit"
              name="intent"
              value="details"
              variant={hasDetailsChanges ? "primary" : "quiet"}
              size="md"
              icon={hasDetailsChanges ? "save" : "completed"}
              disabled={!hasDetailsChanges}
            >
              {hasDetailsChanges ? "Save profile details" : "Saved"}
            </Button>

            {hasDetailsChanges ? (
              <Button
                type="button"
                variant="secondary"
                icon="cancel"
                iconOnly
                ariaLabel="Cancel profile detail changes"
                onClick={resetDetailsChanges}
              />
            ) : null}
          </div>
        </div>
      </section>

      <section id="profile-avatar" className="app-surface app-section-padding space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="app-heading-section">Choose an avatar</h2>
            <p className="mt-1 text-sm app-text-muted">
              Pick a preset avatar with a little Russian included.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
            <div className="flex items-center gap-2 rounded-2xl border border-[var(--accent-decorative-border)] bg-[var(--surface-raised-bg)] p-1.5 shadow-[0_6px_14px_color-mix(in_srgb,var(--accent)_7%,transparent)]">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon="back"
                iconOnly
                ariaLabel="Show previous avatar set"
                disabled={activeAvatarPage === 0}
                onClick={() => setAvatarPage((page) => Math.max(0, page - 1))}
              />

              <div className="flex min-w-[7.5rem] flex-col items-center px-2 text-center">
                <span className="text-xs font-semibold text-[var(--accent-ink)]">
                  Avatar set {activeAvatarPage + 1} of {avatarPageCount}
                </span>
                <span className="mt-1 flex gap-1">
                  {Array.from({ length: avatarPageCount }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={`Show avatar set ${index + 1}`}
                      aria-current={index === activeAvatarPage ? "true" : undefined}
                      onClick={() => setAvatarPage(index)}
                      className={[
                        "h-1.5 rounded-full transition-all",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-elevated)]",
                        index === activeAvatarPage
                          ? "w-5 bg-[var(--accent-fill)]"
                          : "w-1.5 bg-[var(--accent-decorative-border)] hover:bg-[var(--accent-fill)]",
                      ].join(" ")}
                    />
                  ))}
                </span>
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon="next"
                iconOnly
                ariaLabel="Show next avatar set"
                disabled={activeAvatarPage >= avatarPageCount - 1}
                onClick={() =>
                  setAvatarPage((page) => Math.min(avatarPageCount - 1, page + 1))
                }
              />
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleAvatars.map((avatar) => {
            const isSelected = avatarKey === avatar.key;

            return (
              <label
                key={avatar.key}
                className={[
                  "app-focus-ring app-card flex cursor-pointer items-center gap-3 rounded-xl p-3 transition",
                  "hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]",
                  isSelected ? "app-selected-surface" : "",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="avatarKey"
                  value={avatar.key}
                  checked={isSelected}
                  onChange={() => setAvatarKey(avatar.key)}
                  className="sr-only"
                />

                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--accent-decorative-border)] bg-[var(--background-muted)] text-3xl shadow-[var(--shadow-xs)]">
                  <AvatarMark avatar={avatar} initials={initials} />
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className={[
                      "block truncate text-sm font-semibold",
                      isSelected
                        ? "text-[var(--accent-on-soft)]"
                        : "text-[var(--text-primary)]",
                    ].join(" ")}
                  >
                    {avatar.label}
                  </span>
                  <span lang="ru" className="mt-0.5 block truncate text-sm app-text-muted">
                    {avatar.russian}
                  </span>
                </span>

                <span
                  className={[
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition",
                    isSelected
                      ? "border-[var(--accent-selected-border)] [background:var(--accent-gradient-fill)] text-[var(--accent-on-fill)] shadow-[0_8px_18px_var(--accent-decorative-glow)]"
                      : "border-[var(--border)] bg-[var(--background-muted)] text-transparent",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  <AppIcon icon="confirm" size={15} strokeWidth={2.2} />
                </span>
              </label>
            );
          })}
        </div>

        <div
          className={[
            "flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between",
            hasAvatarChanges
              ? "border-[var(--accent-decorative-border)] bg-[var(--surface-muted-bg)] shadow-[0_8px_18px_color-mix(in_srgb,var(--accent)_8%,transparent)]"
              : "border-[var(--border-subtle)] bg-[var(--background-muted)]",
          ].join(" ")}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--accent-decorative-border)] bg-[var(--background-elevated)] text-3xl shadow-[var(--shadow-xs)]">
              <AvatarMark avatar={selectedAvatar} initials={initials} />
            </span>

            <div className="min-w-0">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                {hasAvatarChanges ? selectedAvatar.label : "Current avatar saved"}
              </div>
              <div className="text-sm app-text-muted">
                {hasAvatarChanges ? "Save this avatar to your profile." : "\u00a0"}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Button
              type="submit"
              name="intent"
              value="avatar"
              variant={hasAvatarChanges ? "primary" : "quiet"}
              size="md"
              icon={hasAvatarChanges ? "save" : "completed"}
              disabled={!hasAvatarChanges}
            >
              {hasAvatarChanges ? "Save avatar" : "Saved"}
            </Button>

            {hasAvatarChanges ? (
              <Button
                type="button"
                variant="secondary"
                icon="cancel"
                onClick={resetAvatarChanges}
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      <LearningSnapshotCard snapshot={learningSnapshot} />

      <div className="sticky bottom-3 z-20 flex justify-end xl:hidden">
        <div className="rounded-xl border border-[var(--accent-decorative-border)] bg-[var(--background-elevated)]/92 p-2 shadow-[var(--shadow-md)] backdrop-blur">
          <Button
            type="submit"
            name="intent"
            value="all"
            variant={hasAnyChanges ? "primary" : "secondary"}
            icon={hasAnyChanges ? "save" : "completed"}
            disabled={!hasAnyChanges}
          >
            {hasAnyChanges ? "Save changes" : "Saved"}
          </Button>
        </div>
      </div>
    </form>
  );
}

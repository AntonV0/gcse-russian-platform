"use client";

import { useEffect, useMemo, useState } from "react";
import { updateStudentProfile } from "@/app/actions/auth/auth";
import AppIcon from "@/components/ui/app-icon";
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

function AvatarEmoji({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
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

function getAvatar(
  avatars: ProfileAvatarOption[],
  avatarKey: string | null | undefined
) {
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
      <span className="text-[0.62em] font-extrabold leading-none tracking-normal text-[var(--accent-ink)]">
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
  courseLabel,
  displayName,
  initials,
  compact = false,
}: {
  avatar: ProfileAvatarOption;
  courseLabel: string;
  displayName: string;
  initials: string;
  compact?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-xl border border-[var(--accent-decorative-border)] bg-[var(--background-elevated)]/90 shadow-[0_10px_24px_color-mix(in_srgb,var(--accent)_7%,transparent)]",
        compact ? "p-4" : "p-5",
      ].join(" ")}
      aria-live="polite"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--accent-ink)]">
            <AppIcon icon="preview" size={15} />
            Student card preview
          </div>
          <p className="mt-1 text-sm app-text-muted">
            This is the name and avatar students see around lessons.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[var(--accent-decorative-border)] [background:var(--accent-gradient-soft)] text-5xl shadow-[0_8px_18px_color-mix(in_srgb,var(--accent)_8%,transparent)]">
          <AvatarMark avatar={avatar} initials={initials} />
        </span>

        <div className="min-w-0">
          <div className="text-xl font-extrabold text-[var(--text-primary)]">
            {displayName}
          </div>
          <p className="mt-1.5 text-sm app-text-muted">
            Shown around lessons and your student area.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2 border-t border-[var(--border-subtle)] pt-4">
        <div className="flex items-center justify-between gap-3 rounded-lg bg-[var(--background-muted)] px-3 py-2">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">
            <AppIcon icon="user" size={14} />
            Visible name
          </span>
          <span className="min-w-0 truncate text-sm font-bold text-[var(--text-primary)]">
            {displayName}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg bg-[var(--background-muted)] px-3 py-2">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">
            <AppIcon icon="courses" size={14} />
            Course path
          </span>
          <span className="min-w-0 truncate text-sm font-bold text-[var(--text-primary)]">
            {courseLabel}
          </span>
        </div>

        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-muted)] px-3 py-2.5">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)]">
            <AppIcon icon="preview" size={15} />
            Changes update here before you save.
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileIdentityCard({
  displayName,
  email,
}: {
  displayName: string;
  email: string | null | undefined;
}) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4 shadow-[0_8px_20px_color-mix(in_srgb,var(--text-primary)_5%,transparent)]">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">
          <AppIcon icon="student" size={15} />
          Profile guidance
        </div>
        <p className="mt-1 text-sm app-text-muted">
          Where these details appear and what each field is used for.
        </p>
      </div>

      <div className="mt-4 space-y-2">
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-elevated)]/76 p-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">
            <AppIcon icon="preview" size={14} />
            Where this appears
          </div>
          <p className="mt-1 text-sm app-text-muted">
            Display name and avatar appear in lessons, navigation, and student
            account areas.
          </p>
        </div>

        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-elevated)]/76 p-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">
            <AppIcon icon="user" size={14} />
            Current display name
          </div>
          <p className="mt-1 truncate text-sm font-medium text-[var(--text-primary)]">
            {displayName}
          </p>
        </div>

        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-elevated)]/76 p-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">
            <AppIcon icon="userCheck" size={14} />
            Account email
          </div>
          <p className="mt-1 truncate text-sm font-medium text-[var(--text-primary)]">
            {email ?? "No email connected"}
          </p>
        </div>
      </div>
    </div>
  );
}

function ProfileUpdatedInline() {
  return (
    <div className="rounded-lg border border-[var(--success-border)] bg-[var(--success-surface)] px-3.5 py-2.5 text-[var(--success-text)] shadow-[0_8px_18px_var(--success-shadow)]">
      <div className="flex items-center gap-2 text-sm font-bold">
        <AppIcon icon="completed" size={16} strokeWidth={2.2} />
        Profile updated
      </div>
      <p className="mt-0.5 text-sm app-text-muted">
        Your saved name and avatar are now live around your student area.
      </p>
    </div>
  );
}

function LearningSnapshotCard({
  snapshot,
}: {
  snapshot: ProfileLearningSnapshot;
}) {
  const progressLabel =
    snapshot.totalLessons > 0
      ? `${snapshot.completedLessons} of ${snapshot.totalLessons}`
      : `${snapshot.completedLessons} completed`;

  return (
    <section className="app-surface-muted p-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">
            <AppIcon icon="dashboard" size={15} />
            Learning context
          </div>
          <p className="mt-1 text-sm app-text-muted">
            Profile identity connects into this account and learning route.
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
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">
            <AppIcon icon="userCheck" size={15} />
            Account role
          </div>
          <div className="mt-1.5 text-base font-extrabold text-[var(--text-primary)]">
            {snapshot.roleLabel}
          </div>
          <p className="mt-1 text-sm app-text-muted">{snapshot.accessLabel}</p>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">
            <AppIcon icon="courses" size={15} />
            Course path
          </div>
          <div className="mt-1.5 text-base font-extrabold text-[var(--text-primary)]">
            {snapshot.courseLabel}
          </div>
          <p className="mt-1 text-sm app-text-muted">Current learning route</p>
        </div>

        <div className="rounded-xl border border-[var(--accent-decorative-border)] [background:var(--accent-gradient-soft)] p-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--accent-ink)]">
            <AppIcon icon="completed" size={15} />
            Lesson progress
          </div>
          <div className="mt-1.5 text-base font-extrabold text-[var(--text-primary)]">
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
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">
            <AppIcon icon={snapshot.nextLessonHref ? "next" : "dashboard"} size={15} />
            Next step
          </div>
          <div className="min-w-0">
            <div className="mt-1.5 truncate text-base font-extrabold text-[var(--text-primary)]">
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
    fullName !== (initialFullName ?? "") ||
    displayName !== (initialDisplayName ?? "");
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
      setShowProfileUpdated(false);
      return;
    }

    setShowProfileUpdated(true);

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
      <section className="app-surface-brand app-section-padding">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="app-heading-hero">Build your student profile</h2>
              <p className="app-subtitle max-w-2xl">
                Choose the name and avatar that make your account easy to recognise
                while you study.
              </p>
            </div>

            {showProfileUpdated ? <ProfileUpdatedInline /> : null}

            <div className="flex flex-wrap gap-3">
              <span className="app-pill app-pill-info">Names update the preview</span>
              <span className="app-pill app-pill-muted">Security lives in Settings</span>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button href="/settings" variant="quiet" size="sm" icon="settings">
                Open settings
              </Button>

              <Button href="/dashboard" variant="quiet" size="sm" icon="dashboard">
                Back to dashboard
              </Button>
            </div>
          </div>

          <ProfilePreviewCard
            avatar={selectedAvatar}
            courseLabel={learningSnapshot.courseLabel}
            displayName={previewName}
            initials={initials}
          />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-stretch">
        <div className="app-surface app-section-padding flex h-full flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="app-heading-section">Your details</h2>
              <p className="mt-1 text-sm app-text-muted">
                These fields update the preview above before you save.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <FormField
              label="Full name"
              description="Used for account records and teacher/admin views."
              className="lg:[&_.app-form-field-header]:min-h-[4.25rem]"
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
              description="Shown around your student area when a shorter name feels better."
              className="lg:[&_.app-form-field-header]:min-h-[4.25rem]"
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
              description="Sign-in email changes live in Settings."
              className="lg:col-span-2"
            >
              <Input id="email" name="email" value={email ?? ""} disabled readOnly />
            </FormField>
          </div>

          <div
            className={[
              "mt-auto flex flex-col gap-3 border sm:flex-row sm:items-center sm:justify-between",
              hasDetailsChanges
                ? "rounded-xl border-[var(--accent-decorative-border)] [background:var(--accent-gradient-soft)] p-4 shadow-[0_8px_18px_color-mix(in_srgb,var(--accent)_9%,transparent)]"
                : "rounded-lg border-[var(--border-subtle)] bg-[var(--background-muted)] px-3 py-2.5",
            ].join(" ")}
          >
            <div>
              <div className="text-sm font-bold text-[var(--text-primary)]">
                {hasDetailsChanges
                  ? "Ready to update your details?"
                  : "No detail changes"}
              </div>
              {hasDetailsChanges ? (
                <p className="mt-1 text-sm app-text-muted">
                  Save after changing your full name or display name.
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2 sm:justify-end">
              <Button
                type="submit"
                name="intent"
                value="details"
                variant={hasDetailsChanges ? "primary" : "quiet"}
                size={hasDetailsChanges ? "md" : "sm"}
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
        </div>

        <div className="sticky top-[calc(var(--sticky-site-offset)+0.75rem)] h-full">
          <ProfileIdentityCard
            displayName={previewName}
            email={email}
          />
        </div>
      </section>

      <section className="app-surface app-section-padding space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="app-heading-section">Choose an avatar</h2>
            <p className="mt-1 text-sm app-text-muted">
              Pick a preset avatar with a little Russian included.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
            <div className="flex items-center gap-2 rounded-2xl border border-[var(--accent-decorative-border)] [background:var(--accent-gradient-soft)] p-1.5 shadow-[0_6px_14px_color-mix(in_srgb,var(--accent)_8%,transparent)]">
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
                <span className="text-xs font-bold uppercase tracking-wide text-[var(--accent-ink)]">
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
                      "block truncate text-sm font-bold",
                      isSelected
                        ? "text-[var(--accent-on-soft)]"
                        : "text-[var(--text-primary)]",
                    ].join(" ")}
                  >
                    {avatar.label}
                  </span>
                  <span className="mt-0.5 block truncate text-sm app-text-muted">
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
            "flex flex-col gap-3 border sm:flex-row sm:items-center sm:justify-between",
            hasAvatarChanges
              ? "rounded-xl border-[var(--accent-decorative-border)] [background:var(--accent-gradient-soft)] p-4 shadow-[0_8px_18px_color-mix(in_srgb,var(--accent)_9%,transparent)]"
              : "rounded-lg border-[var(--border-subtle)] bg-[var(--background-muted)] px-3 py-2.5",
          ].join(" ")}
        >
          <div className="flex items-center gap-3">
            {hasAvatarChanges ? (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--accent-decorative-border)] bg-[var(--background-elevated)] text-3xl shadow-[var(--shadow-xs)]">
                <AvatarMark avatar={selectedAvatar} initials={initials} />
              </span>
            ) : null}

            <div className="min-w-0">
              <div className="text-sm font-bold text-[var(--text-primary)]">
                {hasAvatarChanges ? selectedAvatar.label : "Current avatar saved"}
              </div>
              {hasAvatarChanges ? (
                <div className="text-sm app-text-muted">
                  Save this avatar to your profile.
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Button
              type="submit"
              name="intent"
              value="avatar"
              variant={hasAvatarChanges ? "primary" : "quiet"}
              size={hasAvatarChanges ? "md" : "sm"}
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

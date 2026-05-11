"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import StudentAvatar from "@/components/profile/student-avatar";
import {
  DEFAULT_AVATAR_BACKGROUND_KEY,
  DEFAULT_AVATAR_FRAME_KEY,
  avatarBackgroundOptions,
  avatarFrameOptions,
  getSafeAvatarBackgroundKey,
  getSafeAvatarFrameKey,
  type AvatarFrameOption,
  type AvatarBackgroundKey,
  type AvatarFrameKey,
  type ProfileAvatarOption,
} from "@/lib/profile/avatar-customization";

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
  initialAvatarBackgroundKey: AvatarBackgroundKey;
  initialAvatarFrameKey: AvatarFrameKey;
  unlockedAvatarFrameKeys: AvatarFrameKey[];
  learningSnapshot: ProfileLearningSnapshot;
  profileUpdated?: boolean;
};

type SavedProfileResponse = {
  savedProfile?: {
    fullName: string;
    displayName: string;
    avatarKey: string;
    avatarBackgroundKey: string;
    avatarFrameKey: string;
  };
  message?: string;
};

const PROFILE_SAVE_TIMEOUT_MS = 10000;
const PROFILE_RECONCILE_TIMEOUT_MS = 6000;
const PROFILE_UPDATED_EVENT = "profile:updated";
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

async function fetchProfileJson(url: string, options: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        ...options.headers,
      },
      signal: controller.signal,
    });
    const payload = (await response.json().catch(() => ({}))) as SavedProfileResponse;

    return { response, payload };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function ProfileSubmitButton({
  intent,
  hasChanges,
  idleLabel,
  pending,
  size = "md",
  className,
}: {
  intent: "all" | "details" | "avatar";
  hasChanges: boolean;
  idleLabel: string;
  pending: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  if (!hasChanges) {
    return null;
  }

  return (
    <Button
      type="submit"
      name="intent"
      value={intent}
      variant="primary"
      size={size}
      className={className}
      icon="save"
      disabled={pending}
      loading={pending}
      loadingLabel="Saving..."
    >
      {idleLabel}
    </Button>
  );
}

function getFrameProgress(
  frameKey: AvatarFrameKey,
  snapshot: ProfileLearningSnapshot,
  isUnlocked: boolean
) {
  if (frameKey === DEFAULT_AVATAR_FRAME_KEY) {
    return {
      label: "Always available",
      percent: 100,
    };
  }

  if (frameKey === "course-complete") {
    const totalLessons = Math.max(0, snapshot.totalLessons);
    const completedLessons = Math.max(0, snapshot.completedLessons);
    const percent =
      totalLessons > 0
        ? Math.min(100, Math.round((completedLessons / totalLessons) * 100))
        : 0;

    return {
      label: isUnlocked
        ? "Unlocked"
        : totalLessons > 0
          ? `${Math.min(completedLessons, totalLessons)} / ${totalLessons} lessons`
          : "Complete all lessons",
      percent: isUnlocked ? 100 : percent,
    };
  }

  const targetLessons =
    frameKey === "first-lesson" ? 1 : frameKey === "five-lessons" ? 5 : 10;
  const completedLessons = Math.max(0, snapshot.completedLessons);

  return {
    label: isUnlocked
      ? "Unlocked"
      : `${Math.min(completedLessons, targetLessons)} / ${targetLessons} lessons`,
    percent: isUnlocked
      ? 100
      : Math.min(100, Math.round((completedLessons / targetLessons) * 100)),
  };
}

function ProfilePreviewCard({
  avatar,
  backgroundKey,
  displayName,
  frameKey,
  hasChanges,
  initials,
  pending,
  earnedFrames,
  compact = false,
}: {
  avatar: ProfileAvatarOption;
  backgroundKey: AvatarBackgroundKey;
  displayName: string;
  frameKey: AvatarFrameKey;
  hasChanges: boolean;
  initials: string;
  pending: boolean;
  earnedFrames: AvatarFrameOption[];
  compact?: boolean;
}) {
  const equippedFrame = avatarFrameOptions.find((frame) => frame.key === frameKey);

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
        <StudentAvatar
          avatar={avatar}
          initials={initials}
          backgroundKey={backgroundKey}
          frameKey={frameKey}
          size="lg"
          aria-label={`${displayName} avatar preview`}
        />

        <div className="min-w-0">
          <div className="text-xl font-bold text-[var(--text-primary)]">
            {displayName}
          </div>
          <p className="mt-1.5 text-sm app-text-muted">
            Shown in lessons and your account.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)] p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
              Achievement borders
            </div>
            <p className="mt-1 text-sm app-text-muted">
              {earnedFrames.length > 0
                ? `${earnedFrames.length} earned${
                    equippedFrame && equippedFrame.key !== DEFAULT_AVATAR_FRAME_KEY
                      ? `, ${equippedFrame.label.toLowerCase()} equipped`
                      : ""
                  }.`
                : "Complete lessons to unlock your first border."}
            </p>
          </div>
          <div className="flex -space-x-2">
            {(earnedFrames.length > 0
              ? earnedFrames
              : avatarFrameOptions.slice(1, 2)
            ).map((frame) => (
              <StudentAvatar
                key={frame.key}
                avatar={avatar}
                initials={initials}
                backgroundKey={backgroundKey}
                frameKey={frame.key}
                size="xs"
                className={
                  earnedFrames.length > 0
                    ? "ring-2 ring-[var(--background-muted)]"
                    : "opacity-55"
                }
              />
            ))}
          </div>
        </div>
      </div>

      {hasChanges ? (
        <div className="mt-5 border-t border-[var(--border-subtle)] pt-4">
          <div className="flex flex-col gap-3 rounded-xl border border-[var(--accent-decorative-border)] bg-[var(--surface-muted-bg)] p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Ready to save this profile?
            </p>
            <ProfileSubmitButton
              intent="all"
              hasChanges
              idleLabel="Save changes"
              pending={pending}
              size="sm"
            />
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

function ProfileActionErrorInline({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-[var(--danger-border)] bg-[var(--danger-surface)] px-3.5 py-2.5 text-[var(--danger-text)] shadow-[0_8px_18px_var(--danger-shadow)]">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <AppIcon icon="warning" size={16} strokeWidth={2.2} />
        Profile update failed
      </div>
      <p className="mt-0.5 text-sm">{message}</p>
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
          <Button
            href={snapshot.nextLessonHref}
            variant="journey"
            icon="next"
            iconPosition="right"
          >
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
  initialAvatarBackgroundKey,
  initialAvatarFrameKey,
  unlockedAvatarFrameKeys,
  learningSnapshot,
  profileUpdated = false,
}: ProfileEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedFullName, setSavedFullName] = useState(initialFullName ?? "");
  const [savedDisplayName, setSavedDisplayName] = useState(initialDisplayName ?? "");
  const [savedAvatarKey, setSavedAvatarKey] = useState(initialAvatarKey ?? "");
  const [savedAvatarBackgroundKey, setSavedAvatarBackgroundKey] =
    useState<AvatarBackgroundKey>(
      initialAvatarBackgroundKey ?? DEFAULT_AVATAR_BACKGROUND_KEY
    );
  const [savedAvatarFrameKey, setSavedAvatarFrameKey] = useState<AvatarFrameKey>(
    initialAvatarFrameKey ?? DEFAULT_AVATAR_FRAME_KEY
  );
  const [fullName, setFullName] = useState(initialFullName ?? "");
  const [displayName, setDisplayName] = useState(initialDisplayName ?? "");
  const [avatarKey, setAvatarKey] = useState(initialAvatarKey ?? "");
  const [avatarBackgroundKey, setAvatarBackgroundKey] = useState<AvatarBackgroundKey>(
    initialAvatarBackgroundKey ?? DEFAULT_AVATAR_BACKGROUND_KEY
  );
  const [avatarFrameKey, setAvatarFrameKey] = useState<AvatarFrameKey>(
    initialAvatarFrameKey ?? DEFAULT_AVATAR_FRAME_KEY
  );
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
  const unlockedFrameKeys = useMemo(
    () => new Set<AvatarFrameKey>([...unlockedAvatarFrameKeys, savedAvatarFrameKey]),
    [savedAvatarFrameKey, unlockedAvatarFrameKeys]
  );
  const earnedFrames = avatarFrameOptions.filter(
    (frame) => frame.key !== DEFAULT_AVATAR_FRAME_KEY && unlockedFrameKeys.has(frame.key)
  );
  const hasDetailsChanges =
    fullName !== savedFullName || displayName !== savedDisplayName;
  const hasAvatarChanges =
    avatarKey !== savedAvatarKey ||
    avatarBackgroundKey !== savedAvatarBackgroundKey ||
    avatarFrameKey !== savedAvatarFrameKey;
  const hasAnyChanges = hasDetailsChanges || hasAvatarChanges;
  const resetDetailsChanges = () => {
    setFullName(savedFullName);
    setDisplayName(savedDisplayName);
  };
  const resetAvatarChanges = () => {
    setAvatarKey(savedAvatarKey);
    setAvatarBackgroundKey(savedAvatarBackgroundKey);
    setAvatarFrameKey(savedAvatarFrameKey);
    setAvatarPage(getAvatarPageForKey(avatars, savedAvatarKey));
  };
  const shouldShowProfileUpdated = showProfileUpdated && !hasAnyChanges;

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSaving || !hasAnyChanges) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    setIsSaving(true);
    setSaveError(null);

    try {
      let result: Awaited<ReturnType<typeof fetchProfileJson>>;

      try {
        result = await fetchProfileJson(
          "/api/profile",
          {
            method: "POST",
            body: formData,
          },
          PROFILE_SAVE_TIMEOUT_MS
        );
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          throw error;
        }

        await new Promise((resolve) => window.setTimeout(resolve, 800));
        result = await fetchProfileJson(
          `/api/profile?reconcile=${Date.now()}`,
          {
            method: "GET",
          },
          PROFILE_RECONCILE_TIMEOUT_MS
        );
      }

      const { response, payload } = result;

      if (!response.ok || !payload.savedProfile) {
        throw new Error(payload.message || "Profile update failed.");
      }

      const savedProfile = payload.savedProfile;
      const nextAvatarBackgroundKey = getSafeAvatarBackgroundKey(
        savedProfile.avatarBackgroundKey
      );
      const nextAvatarFrameKey = getSafeAvatarFrameKey(savedProfile.avatarFrameKey);

      setFullName(savedProfile.fullName);
      setDisplayName(savedProfile.displayName);
      setAvatarKey(savedProfile.avatarKey);
      setAvatarBackgroundKey(nextAvatarBackgroundKey);
      setAvatarFrameKey(nextAvatarFrameKey);
      setSavedFullName(savedProfile.fullName);
      setSavedDisplayName(savedProfile.displayName);
      setSavedAvatarKey(savedProfile.avatarKey);
      setSavedAvatarBackgroundKey(nextAvatarBackgroundKey);
      setSavedAvatarFrameKey(nextAvatarFrameKey);
      setAvatarPage(getAvatarPageForKey(avatars, savedProfile.avatarKey));
      setShowProfileUpdated(true);
      window.dispatchEvent(
        new CustomEvent(PROFILE_UPDATED_EVENT, {
          detail: savedProfile,
        })
      );

      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      url.searchParams.delete("error");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Profile update failed.");
      setShowProfileUpdated(false);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!shouldShowProfileUpdated) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShowProfileUpdated(false);

      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }, 5200);

    return () => window.clearTimeout(timeoutId);
  }, [shouldShowProfileUpdated]);

  return (
    <form onSubmit={handleProfileSubmit} className="space-y-6 xl:-mb-6">
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

            {shouldShowProfileUpdated ? <ProfileUpdatedInline /> : null}
            {saveError ? <ProfileActionErrorInline message={saveError} /> : null}

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
            backgroundKey={avatarBackgroundKey}
            displayName={previewName}
            frameKey={avatarFrameKey}
            hasChanges={hasAnyChanges}
            initials={initials}
            pending={isSaving}
            earnedFrames={earnedFrames}
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
            <ProfileSubmitButton
              intent="details"
              hasChanges={hasDetailsChanges}
              idleLabel="Save profile details"
              pending={isSaving}
            />

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

        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4">
          {visibleAvatars.map((avatar) => {
            const isSelected = avatarKey === avatar.key;

            return (
              <label
                key={avatar.key}
                className={[
                  "app-focus-ring app-card app-card-interaction-subtle flex cursor-pointer items-center gap-2 rounded-xl p-2 sm:gap-3 sm:p-3",
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

                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--accent-decorative-border)] bg-[var(--background-muted)] text-2xl shadow-[var(--shadow-xs)] sm:h-14 sm:w-14 sm:text-3xl">
                  <AvatarMark avatar={avatar} initials={initials} />
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className={[
                      "block text-xs font-semibold leading-tight sm:truncate sm:text-sm",
                      isSelected
                        ? "text-[var(--accent-on-soft)]"
                        : "text-[var(--text-primary)]",
                    ].join(" ")}
                  >
                    {avatar.label}
                  </span>
                  <span
                    lang="ru"
                    className="mt-0.5 block text-xs leading-tight app-text-muted sm:truncate sm:text-sm"
                  >
                    {avatar.russian}
                  </span>
                </span>

                <span
                  className={[
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition sm:h-7 sm:w-7",
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

        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Avatar background
                </h3>
                <p className="mt-1 text-sm app-text-muted">
                  Pick the colour behind your avatar mark.
                </p>
              </div>
              <StudentAvatar
                avatar={selectedAvatar}
                initials={initials}
                backgroundKey={avatarBackgroundKey}
                frameKey={avatarFrameKey}
                size="sm"
                aria-label="Selected avatar background preview"
              />
            </div>

            <div
              className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7"
              role="radiogroup"
              aria-label="Avatar background colour"
            >
              {avatarBackgroundOptions.map((background) => {
                const isSelected = avatarBackgroundKey === background.key;

                return (
                  <label
                    key={background.key}
                    className={[
                      "app-focus-ring flex cursor-pointer items-center gap-2 rounded-lg border p-2 text-sm font-semibold transition",
                      isSelected
                        ? "border-[var(--accent-selected-border)] bg-[var(--accent-selected-bg)] text-[var(--accent-on-soft)]"
                        : "border-[var(--border-subtle)] bg-[var(--background-elevated)] text-[var(--text-secondary)] hover:border-[var(--accent-decorative-border)] hover:text-[var(--text-primary)]",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="avatarBackgroundKey"
                      value={background.key}
                      checked={isSelected}
                      onChange={() => setAvatarBackgroundKey(background.key)}
                      className="sr-only"
                    />
                    <span
                      className="h-6 w-6 shrink-0 rounded-full border border-white/70 shadow-[0_0_0_1px_color-mix(in_srgb,var(--text-primary)_10%,transparent)]"
                      style={{ background: background.background }}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 leading-tight">
                      <span className="block truncate">{background.label}</span>
                      <span
                        lang="ru"
                        className="block truncate text-[0.72rem] font-medium opacity-75"
                      >
                        {background.russian}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)] p-4">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Achievement frame
              </h3>
              <p className="mt-1 text-sm app-text-muted">
                Equip an unlocked border around your avatar.
              </p>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {avatarFrameOptions.map((frame) => {
                const isUnlocked = unlockedFrameKeys.has(frame.key);
                const isSelected = avatarFrameKey === frame.key;
                const progress = getFrameProgress(
                  frame.key,
                  learningSnapshot,
                  isUnlocked
                );

                return (
                  <label
                    key={frame.key}
                    className={[
                      "app-focus-ring flex min-h-24 gap-3 rounded-xl border p-3 transition",
                      isUnlocked
                        ? "cursor-pointer bg-[var(--background-elevated)] hover:border-[var(--accent-decorative-border)]"
                        : "cursor-not-allowed bg-[color-mix(in_srgb,var(--background-muted)_78%,var(--background-elevated))] opacity-72",
                      isSelected
                        ? "border-[var(--accent-selected-border)] shadow-[0_10px_22px_color-mix(in_srgb,var(--accent)_10%,transparent)]"
                        : "border-[var(--border-subtle)]",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="avatarFrameKey"
                      value={frame.key}
                      checked={isSelected}
                      disabled={!isUnlocked}
                      onChange={() => {
                        if (isUnlocked) {
                          setAvatarFrameKey(frame.key);
                        }
                      }}
                      className="sr-only"
                    />
                    <StudentAvatar
                      avatar={selectedAvatar}
                      initials={initials}
                      backgroundKey={avatarBackgroundKey}
                      frameKey={frame.key}
                      size="sm"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-bold leading-tight text-[var(--text-primary)]">
                          {frame.label}
                        </span>
                        {!isUnlocked ? (
                          <AppIcon
                            icon="locked"
                            size={13}
                            className="text-[var(--text-muted)]"
                          />
                        ) : null}
                      </span>
                      <span className="mt-1 block text-xs leading-5 app-text-muted">
                        {isUnlocked ? frame.description : frame.requirementLabel}
                      </span>
                      <span className="mt-2 block">
                        <span className="flex items-center justify-between gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]">
                          <span>{progress.label}</span>
                          <span>{progress.percent}%</span>
                        </span>
                        <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[var(--background-muted)]">
                          <span
                            className="block h-full rounded-full [background:var(--accent-gradient-fill)]"
                            style={{ width: `${progress.percent}%` }}
                          />
                        </span>
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
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
            <StudentAvatar
              avatar={selectedAvatar}
              initials={initials}
              backgroundKey={avatarBackgroundKey}
              frameKey={avatarFrameKey}
              size="sm"
              aria-label="Current avatar appearance preview"
            />

            <div className="min-w-0">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                {hasAvatarChanges ? "Avatar appearance ready" : "Current avatar saved"}
              </div>
              <div className="text-sm app-text-muted">
                {hasAvatarChanges ? "Save this avatar to your profile." : "\u00a0"}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            {hasAvatarChanges ? (
              <ProfileSubmitButton
                intent="avatar"
                hasChanges={hasAvatarChanges}
                idleLabel="Save avatar"
                pending={isSaving}
              />
            ) : null}

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

      {hasAnyChanges ? (
        <div className="sticky bottom-3 z-20 flex justify-end xl:hidden">
          <div className="rounded-xl border border-[var(--accent-decorative-border)] bg-[var(--background-elevated)]/92 p-2 shadow-[var(--shadow-md)] backdrop-blur">
            <ProfileSubmitButton
              intent="all"
              hasChanges={hasAnyChanges}
              idleLabel="Save changes"
              pending={isSaving}
            />
          </div>
        </div>
      ) : null}
    </form>
  );
}

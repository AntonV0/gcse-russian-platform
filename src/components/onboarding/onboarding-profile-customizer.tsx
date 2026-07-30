"use client";

import { useMemo, useState } from "react";
import {
  saveOnboardingProfileAction,
  skipOnboardingProfileAction,
} from "@/app/actions/onboarding/onboarding-actions";
import StudentAvatar from "@/components/profile/student-avatar";
import AppIcon from "@/components/ui/app-icon";
import Button from "@/components/ui/button";
import FeedbackBanner from "@/components/ui/feedback-banner";
import LoadingButton from "@/components/ui/loading-button";
import {
  avatarBackgroundOptions,
  getAvatarBackgroundOption,
  getAvatarOption,
  profileAvatarOptions,
  type AvatarBackgroundKey,
} from "@/lib/profile/avatar-customization";
import type {
  AccentPreference,
  ThemePreference,
} from "@/components/providers/theme-provider";

const accentOptions = [
  { key: "blue", label: "Blue" },
  { key: "purple", label: "Purple" },
  { key: "pink", label: "Pink" },
  { key: "red", label: "Red" },
  { key: "orange", label: "Orange" },
  { key: "yellow", label: "Yellow" },
  { key: "green", label: "Green" },
  { key: "teal", label: "Teal" },
  { key: "brown", label: "Brown" },
  { key: "slate", label: "Slate" },
] as const;

function getInitials(name: string | null | undefined, email: string | null | undefined) {
  const source = name?.trim() || email?.trim() || "Student";
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

export default function OnboardingProfileCustomizer({
  email,
  fullName,
  initialDisplayName,
  initialAvatarKey,
  initialBackgroundKey,
  initialThemePreference,
  initialAccentPreference,
  nextPath,
  error,
}: {
  email?: string | null;
  fullName?: string | null;
  initialDisplayName?: string | null;
  initialAvatarKey: string;
  initialBackgroundKey: AvatarBackgroundKey;
  initialThemePreference: ThemePreference;
  initialAccentPreference: AccentPreference;
  nextPath: string;
  error?: string;
}) {
  const avatarOptions = profileAvatarOptions.slice(0, 8);
  const backgroundOptions = avatarBackgroundOptions.slice(0, 8);
  const [displayName, setDisplayName] = useState(initialDisplayName ?? "");
  const [avatarKey, setAvatarKey] = useState(initialAvatarKey);
  const [backgroundKey, setBackgroundKey] =
    useState<AvatarBackgroundKey>(initialBackgroundKey);
  const [themePreference, setThemePreference] =
    useState<ThemePreference>(initialThemePreference);
  const [accentPreference, setAccentPreference] = useState<AccentPreference>(
    initialAccentPreference
  );
  const selectedAvatar = useMemo(() => getAvatarOption(avatarKey), [avatarKey]);
  const selectedBackground = useMemo(
    () => getAvatarBackgroundOption(backgroundKey),
    [backgroundKey]
  );
  const previewName = displayName.trim() || fullName?.trim() || "Student";
  const initials = getInitials(displayName || fullName, email);
  const resolvedPreviewTheme = themePreference === "system" ? "light" : themePreference;

  return (
    <form action={saveOnboardingProfileAction} className="px-5 py-5 sm:px-6">
      <input type="hidden" name="next" value={nextPath} />

      {error ? (
        <FeedbackBanner
          tone="danger"
          title="Profile setup was not saved"
          description={
            error === "avatar"
              ? "Choose a valid avatar before saving."
              : "We could not save those profile choices. Try again or skip for now."
          }
          className="mb-5"
        />
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="space-y-5">
          <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)]/45 p-4">
            <label htmlFor="displayName" className="app-form-label">
              Display name
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              maxLength={50}
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder={fullName ?? "Student"}
              className="app-form-control app-form-input mt-2"
            />
          </section>

          <fieldset className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)]/45 p-4">
            <legend className="app-heading-subsection">Choose an avatar</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {avatarOptions.map((avatar) => {
                const selected = avatar.key === avatarKey;

                return (
                  <label
                    key={avatar.key || "initials"}
                    className={[
                      "cursor-pointer rounded-xl border p-3 transition",
                      selected
                        ? "border-[var(--accent-selected-border)] bg-[var(--surface-muted-bg)] shadow-[0_8px_18px_color-mix(in_srgb,var(--accent-border-ink)_12%,transparent)]"
                        : "border-[var(--border-subtle)] bg-[var(--background-elevated)] hover:border-[var(--accent-selected-border)]",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="avatarKey"
                      value={avatar.key}
                      checked={selected}
                      onChange={() => setAvatarKey(avatar.key)}
                      className="sr-only"
                    />
                    <span className="flex items-center gap-3">
                      <StudentAvatar
                        avatar={avatar}
                        initials={initials}
                        backgroundKey={backgroundKey}
                        size="sm"
                      />
                      <span className="min-w-0 flex-1 text-sm font-semibold text-[var(--text-primary)]">
                        {avatar.label}
                      </span>
                      {selected ? (
                        <AppIcon
                          icon="completed"
                          size={15}
                          className="shrink-0 text-[var(--success-text)]"
                        />
                      ) : null}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)]/45 p-4">
            <legend className="app-heading-subsection">Avatar background</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {backgroundOptions.map((background) => {
                const selected = background.key === backgroundKey;

                return (
                  <label
                    key={background.key}
                    className={[
                      "cursor-pointer rounded-xl border p-3 transition",
                      selected
                        ? "border-[var(--accent-selected-border)] bg-[var(--surface-muted-bg)] shadow-[0_8px_18px_color-mix(in_srgb,var(--accent-border-ink)_12%,transparent)]"
                        : "border-[var(--border-subtle)] bg-[var(--background-elevated)] hover:border-[var(--accent-selected-border)]",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="avatarBackgroundKey"
                      value={background.key}
                      checked={selected}
                      onChange={() => setBackgroundKey(background.key)}
                      className="sr-only"
                    />
                    <span className="flex items-center gap-3">
                      <span
                        className="h-7 w-7 rounded-full border border-white/70 shadow-[0_0_0_1px_color-mix(in_srgb,var(--text-primary)_10%,transparent)]"
                        style={{ background: background.background }}
                      />
                      <span className="min-w-0 flex-1 text-sm font-semibold text-[var(--text-primary)]">
                        {background.label}
                      </span>
                      {selected ? (
                        <AppIcon
                          icon="completed"
                          size={15}
                          className="shrink-0 text-[var(--success-text)]"
                        />
                      ) : null}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-5">
          <section
            data-theme={resolvedPreviewTheme}
            data-accent={accentPreference}
            className="overflow-hidden rounded-xl border border-[var(--accent-selected-border)] bg-[var(--background-elevated)] p-5 shadow-[var(--shadow-sm)]"
          >
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent-ink)]">
              Live preview
            </p>
            <div className="mt-4 flex items-center gap-4">
              <StudentAvatar
                avatar={selectedAvatar}
                initials={initials}
                backgroundKey={selectedBackground.key}
                size="lg"
              />
              <div className="min-w-0">
                <p className="truncate text-lg font-extrabold text-[var(--text-primary)]">
                  {previewName}
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  GCSE Russian student
                </p>
              </div>
            </div>
          </section>

          <fieldset className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)]/45 p-4">
            <legend className="app-heading-subsection">Theme</legend>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {(["system", "light", "dark"] as const).map((theme) => {
                const selected = themePreference === theme;

                return (
                  <label
                    key={theme}
                    className={[
                      "cursor-pointer rounded-lg border px-3 py-2 text-center text-sm font-semibold capitalize",
                      selected
                        ? "border-[var(--accent-selected-border)] bg-[var(--surface-muted-bg)] text-[var(--text-primary)]"
                        : "border-[var(--border-subtle)] bg-[var(--background-elevated)] text-[var(--text-secondary)]",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="themePreference"
                      value={theme}
                      checked={selected}
                      onChange={() => setThemePreference(theme)}
                      className="sr-only"
                    />
                    {theme}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)]/45 p-4">
            <legend className="app-heading-subsection">Accent colour</legend>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {accentOptions.map((accent) => {
                const selected = accentPreference === accent.key;

                return (
                  <label
                    key={accent.key}
                    className={[
                      "cursor-pointer rounded-lg border px-3 py-2 text-sm font-semibold",
                      selected
                        ? "border-[var(--accent-selected-border)] bg-[var(--surface-muted-bg)] text-[var(--text-primary)]"
                        : "border-[var(--border-subtle)] bg-[var(--background-elevated)] text-[var(--text-secondary)]",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="accentPreference"
                      value={accent.key}
                      checked={selected}
                      onChange={() => setAccentPreference(accent.key)}
                      className="sr-only"
                    />
                    <span className="flex items-center justify-between gap-2">
                      {accent.label}
                      {selected ? <AppIcon icon="completed" size={14} /> : null}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4">
            <div className="flex flex-col gap-3">
              <LoadingButton
                idleLabel="Save and continue"
                pendingLabel="Saving setup..."
                idleIcon="save"
                variant="primary"
              />
              <Button
                formAction={skipOnboardingProfileAction}
                type="submit"
                variant="secondary"
                icon="next"
                iconPosition="right"
              >
                Skip for now
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}

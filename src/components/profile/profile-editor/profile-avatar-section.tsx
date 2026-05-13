import AppIcon from "@/components/ui/app-icon";
import Button from "@/components/ui/button";
import StudentAvatar from "@/components/profile/student-avatar";
import {
  avatarBackgroundOptions,
  avatarFrameOptions,
  type AvatarBackgroundKey,
  type AvatarFrameKey,
  type ProfileAvatarOption,
} from "@/lib/profile/avatar-customization";
import type { ProfileLearningSnapshot } from "./profile-editor-types";
import { getFrameProgress } from "./profile-editor-utils";
import ProfileSubmitButton from "./profile-submit-button";

export default function ProfileAvatarSection({
  visibleAvatars,
  selectedAvatar,
  avatarKey,
  avatarBackgroundKey,
  avatarFrameKey,
  initials,
  isSaving,
  activeAvatarPage,
  avatarPageCount,
  unlockedFrameKeys,
  learningSnapshot,
  hasAvatarChanges,
  onAvatarKeyChange,
  onAvatarBackgroundKeyChange,
  onAvatarFrameKeyChange,
  onAvatarPageChange,
  onReset,
}: {
  visibleAvatars: ProfileAvatarOption[];
  selectedAvatar: ProfileAvatarOption;
  avatarKey: string;
  avatarBackgroundKey: AvatarBackgroundKey;
  avatarFrameKey: AvatarFrameKey;
  initials: string;
  isSaving: boolean;
  activeAvatarPage: number;
  avatarPageCount: number;
  unlockedFrameKeys: Set<AvatarFrameKey>;
  learningSnapshot: ProfileLearningSnapshot;
  hasAvatarChanges: boolean;
  onAvatarKeyChange: (value: string) => void;
  onAvatarBackgroundKeyChange: (value: AvatarBackgroundKey) => void;
  onAvatarFrameKeyChange: (value: AvatarFrameKey) => void;
  onAvatarPageChange: (value: number | ((current: number) => number)) => void;
  onReset: () => void;
}) {
  return (
    <section id="profile-avatar" className="app-surface app-section-padding space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="app-heading-section">Choose an avatar</h2>
          <p className="mt-1 text-sm app-text-muted">
            Pick a preset avatar with a little Russian included.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
          <div className="flex items-center gap-2 rounded-2xl border border-[var(--accent-selected-border)] bg-[var(--surface-raised-bg)] p-1.5 shadow-[0_6px_14px_color-mix(in_srgb,var(--accent-border-ink)_10%,transparent)]">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon="back"
              iconOnly
              ariaLabel="Show previous avatar set"
              disabled={isSaving || activeAvatarPage === 0}
              onClick={() => onAvatarPageChange((page) => Math.max(0, page - 1))}
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
                    disabled={isSaving}
                    onClick={() => onAvatarPageChange(index)}
                    className={[
                      "h-1.5 rounded-full transition-all",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-elevated)]",
                      index === activeAvatarPage
                        ? "w-5 bg-[var(--accent-fill)]"
                        : "w-1.5 bg-[color-mix(in_srgb,var(--accent-border-ink)_44%,transparent)] hover:bg-[var(--accent-fill)]",
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
              disabled={isSaving || activeAvatarPage >= avatarPageCount - 1}
              onClick={() =>
                onAvatarPageChange((page) => Math.min(avatarPageCount - 1, page + 1))
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
                "app-focus-ring app-focus-within-ring app-card app-card-interaction-subtle flex items-center gap-2 rounded-xl p-2 sm:gap-3 sm:p-3",
                isSaving ? "cursor-not-allowed opacity-70" : "cursor-pointer",
                isSelected ? "app-selected-surface" : "",
              ].join(" ")}
            >
              <input
                type="radio"
                name="avatarKey"
                value={avatar.key}
                checked={isSelected}
                disabled={isSaving}
                onChange={() => onAvatarKeyChange(avatar.key)}
                className="sr-only"
              />

              <StudentAvatar
                avatar={avatar}
                initials={initials}
                backgroundKey={avatarBackgroundKey}
                frameKey={avatarFrameKey}
                size="md"
                aria-label={`${avatar.label} avatar option`}
              />

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
        <AvatarBackgroundPicker
          selectedAvatar={selectedAvatar}
          initials={initials}
          avatarBackgroundKey={avatarBackgroundKey}
          avatarFrameKey={avatarFrameKey}
          isSaving={isSaving}
          onChange={onAvatarBackgroundKeyChange}
        />
        <AvatarFramePicker
          selectedAvatar={selectedAvatar}
          initials={initials}
          avatarBackgroundKey={avatarBackgroundKey}
          avatarFrameKey={avatarFrameKey}
          isSaving={isSaving}
          unlockedFrameKeys={unlockedFrameKeys}
          learningSnapshot={learningSnapshot}
          onChange={onAvatarFrameKeyChange}
        />
      </div>

      <div
        className={[
          "flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between",
          hasAvatarChanges
            ? "border-[var(--accent-selected-border)] bg-[var(--surface-muted-bg)] shadow-[0_8px_18px_color-mix(in_srgb,var(--accent-border-ink)_12%,transparent)]"
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
              disabled={isSaving}
              onClick={onReset}
            >
              Cancel
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function AvatarBackgroundPicker({
  selectedAvatar,
  initials,
  avatarBackgroundKey,
  avatarFrameKey,
  isSaving,
  onChange,
}: {
  selectedAvatar: ProfileAvatarOption;
  initials: string;
  avatarBackgroundKey: AvatarBackgroundKey;
  avatarFrameKey: AvatarFrameKey;
  isSaving: boolean;
  onChange: (value: AvatarBackgroundKey) => void;
}) {
  return (
    <div className="rounded-xl border border-[color-mix(in_srgb,var(--accent-border-ink)_10%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--background-elevated)_88%,var(--background-muted))] p-4 shadow-[inset_0_1px_0_color-mix(in_srgb,var(--text-primary)_4%,transparent)]">
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
                "app-focus-ring app-focus-within-ring flex items-center gap-2 rounded-lg border p-2 text-sm font-semibold transition",
                isSaving ? "cursor-not-allowed opacity-70" : "cursor-pointer",
                isSelected
                  ? "border-[var(--accent-selected-border)] bg-[var(--accent-selected-bg)] text-[var(--accent-on-soft)]"
                  : "border-[var(--border-subtle)] bg-[var(--background-elevated)] text-[var(--text-secondary)] hover:border-[var(--accent-selected-border)] hover:text-[var(--text-primary)]",
              ].join(" ")}
            >
              <input
                type="radio"
                name="avatarBackgroundKey"
                value={background.key}
                checked={isSelected}
                disabled={isSaving}
                onChange={() => onChange(background.key)}
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
  );
}

function AvatarFramePicker({
  selectedAvatar,
  initials,
  avatarBackgroundKey,
  avatarFrameKey,
  isSaving,
  unlockedFrameKeys,
  learningSnapshot,
  onChange,
}: {
  selectedAvatar: ProfileAvatarOption;
  initials: string;
  avatarBackgroundKey: AvatarBackgroundKey;
  avatarFrameKey: AvatarFrameKey;
  isSaving: boolean;
  unlockedFrameKeys: Set<AvatarFrameKey>;
  learningSnapshot: ProfileLearningSnapshot;
  onChange: (value: AvatarFrameKey) => void;
}) {
  return (
    <div className="rounded-xl border border-[color-mix(in_srgb,var(--accent-border-ink)_10%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--background-elevated)_88%,var(--background-muted))] p-4 shadow-[inset_0_1px_0_color-mix(in_srgb,var(--text-primary)_4%,transparent)]">
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
          const progress = getFrameProgress(frame.key, learningSnapshot, isUnlocked);

          return (
            <label
              key={frame.key}
              className={[
                "app-focus-ring app-focus-within-ring flex min-h-24 gap-3 rounded-xl border p-3 transition",
                isUnlocked && !isSaving
                  ? "cursor-pointer bg-[var(--background-elevated)] hover:border-[var(--accent-selected-border)]"
                  : "cursor-not-allowed bg-[color-mix(in_srgb,var(--background-muted)_78%,var(--background-elevated))] opacity-72",
                isSelected
                  ? "border-[var(--accent-selected-border)] shadow-[0_10px_22px_color-mix(in_srgb,var(--accent-border-ink)_14%,transparent)]"
                  : "border-[var(--border-subtle)]",
              ].join(" ")}
            >
              <input
                type="radio"
                name="avatarFrameKey"
                value={frame.key}
                checked={isSelected}
                disabled={!isUnlocked || isSaving}
                onChange={() => {
                  if (isUnlocked && !isSaving) {
                    onChange(frame.key);
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
  );
}

import AppIcon from "@/components/ui/app-icon";
import StudentAvatar from "@/components/profile/student-avatar";
import {
  DEFAULT_AVATAR_FRAME_KEY,
  avatarFrameOptions,
  type AvatarBackgroundKey,
  type AvatarFrameKey,
  type AvatarFrameOption,
  type ProfileAvatarOption,
} from "@/lib/profile/avatar-customization";
import ProfileSubmitButton from "./profile-submit-button";

export default function ProfilePreviewCard({
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
          <div className="flex flex-col gap-3 rounded-xl border border-[var(--accent-selected-border)] bg-[var(--surface-muted-bg)] p-3 sm:flex-row sm:items-center sm:justify-between">
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

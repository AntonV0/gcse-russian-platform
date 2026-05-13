import type { CSSProperties } from "react";
import {
  type AvatarBackgroundKey,
  type AvatarFrameKey,
  type ProfileAvatarOption,
  getAvatarBackgroundOption,
  getAvatarFrameOption,
} from "@/lib/profile/avatar-customization";

type StudentAvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

type StudentAvatarProps = {
  avatar: ProfileAvatarOption;
  initials: string;
  backgroundKey?: AvatarBackgroundKey | null;
  frameKey?: AvatarFrameKey | null;
  size?: StudentAvatarSize;
  className?: string;
  "aria-label"?: string;
};

const sizeMap: Record<StudentAvatarSize, number> = {
  xs: 32,
  sm: 48,
  md: 56,
  lg: 80,
  xl: 104,
};

function isInitialsAvatar(avatar: ProfileAvatarOption) {
  return avatar.key === "" || avatar.key === "default";
}

function AvatarEmoji({ children }: { children: string }) {
  return (
    <span
      className={[
        "inline-flex h-[1em] w-[1em] items-center justify-center leading-none",
        "[font-family:'Segoe_UI_Emoji','Apple_Color_Emoji','Noto_Color_Emoji',sans-serif]",
        "[font-variant-emoji:emoji]",
      ].join(" ")}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

export default function StudentAvatar({
  avatar,
  initials,
  backgroundKey,
  frameKey,
  size = "md",
  className,
  "aria-label": ariaLabel,
}: StudentAvatarProps) {
  const background = getAvatarBackgroundOption(backgroundKey);
  const frame = getAvatarFrameOption(frameKey);
  const sizePx = sizeMap[size];
  const isInitials = isInitialsAvatar(avatar);
  const hasAchievementFrame = frame.key !== "none";
  const fontSize = isInitials ? Math.max(11, Math.round(sizePx * 0.27)) : Math.round(sizePx * 0.54);
  const style = {
    width: sizePx,
    height: sizePx,
    padding: frame.frameSize,
    background: frame.frameBackground,
    boxShadow: frame.frameShadow,
    "--student-avatar-bg": background.background,
  } as CSSProperties & Record<string, string | number>;

  return (
    <span
      className={["inline-flex shrink-0 items-center justify-center rounded-full", className]
        .filter(Boolean)
        .join(" ")}
      style={style}
      aria-label={ariaLabel}
      role={ariaLabel ? "img" : undefined}
    >
      <span
        className={[
          "flex h-full w-full items-center justify-center rounded-full border",
          hasAchievementFrame
            ? "border-transparent"
            : "border-white/65 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]",
          background.textClassName,
        ].join(" ")}
        style={{ background: "var(--student-avatar-bg)", fontSize }}
        aria-hidden={ariaLabel ? "true" : undefined}
      >
        {isInitials ? (
          <span className="font-bold leading-none tracking-normal">{initials}</span>
        ) : (
          <AvatarEmoji>{avatar.emoji}</AvatarEmoji>
        )}
      </span>
    </span>
  );
}

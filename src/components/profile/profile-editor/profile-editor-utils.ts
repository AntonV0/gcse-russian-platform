import type { AvatarFrameKey, ProfileAvatarOption } from "@/lib/profile/avatar-customization";
import { DEFAULT_AVATAR_FRAME_KEY } from "@/lib/profile/avatar-customization";
import type { ProfileLearningSnapshot, SavedProfileResponse } from "./profile-editor-types";

export const PROFILE_SAVE_TIMEOUT_MS = 10000;
export const PROFILE_RECONCILE_TIMEOUT_MS = 6000;
export const PROFILE_UNSAVED_CHANGES_MESSAGE =
  "You have unsaved profile changes. Leave without saving?";
export const AVATARS_PER_PAGE = 12;

const defaultAvatar = {
  key: "default",
  emoji: "",
  label: "Initials",
  russian: "Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ñ‹",
} satisfies ProfileAvatarOption;

export function getAvatar(
  avatars: ProfileAvatarOption[],
  avatarKey: string | null | undefined
) {
  return avatars.find((avatar) => avatar.key === avatarKey) ?? defaultAvatar;
}

export function getProfileInitials(name: string, email: string | null | undefined) {
  const source = name.trim() || email?.split("@")[0] || "Student";
  const parts = source.split(/[\s._-]+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }

  return (parts[0] ?? "ST").slice(0, 2).toUpperCase();
}

export function getAvatarPageForKey(avatars: ProfileAvatarOption[], avatarKey: string) {
  const selectedIndex = avatars.findIndex((avatar) => avatar.key === avatarKey);

  return selectedIndex >= 0 ? Math.floor(selectedIndex / AVATARS_PER_PAGE) : 0;
}

export async function fetchProfileJson(
  url: string,
  options: RequestInit,
  timeoutMs: number
) {
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

export function getFrameProgress(
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

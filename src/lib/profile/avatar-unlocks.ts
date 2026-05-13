import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  getDashboardVariantLabel,
  getStudentLearningPlan,
} from "@/lib/dashboard/learning-plan";
import { getCourseProgressSummary } from "@/lib/progress/progress";
import { getCurrentUser } from "@/lib/auth/auth";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import {
  DEFAULT_AVATAR_FRAME_KEY,
  avatarFrameOptions,
  getUnlockedAvatarFrameKeys,
  type AvatarFrameKey,
} from "@/lib/profile/avatar-customization";

const AVATAR_FRAME_ACHIEVEMENT_TYPE = "avatar_frame";

function getPersistableAvatarFrameKeys(frameKeys: Set<AvatarFrameKey>) {
  return Array.from(frameKeys).filter(
    (frameKey) => frameKey !== DEFAULT_AVATAR_FRAME_KEY
  );
}

async function getPersistedAvatarFrameKeysForCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    return new Set<AvatarFrameKey>();
  }

  const supabase = await createClient();
  const validFrameKeys = new Set(avatarFrameOptions.map((frame) => frame.key));
  const { data, error } = await supabase
    .from("profile_achievement_unlocks")
    .select("achievement_key")
    .eq("user_id", user.id)
    .eq("achievement_type", AVATAR_FRAME_ACHIEVEMENT_TYPE);

  if (error || !data) {
    return new Set<AvatarFrameKey>();
  }

  return new Set(
    data
      .map((row) => row.achievement_key)
      .filter((frameKey): frameKey is AvatarFrameKey =>
        validFrameKeys.has(frameKey as AvatarFrameKey)
      )
  );
}

export async function getComputedAvatarFrameKeysForCurrentUser() {
  const dashboard = await getDashboardInfo();
  const activeVariant = dashboard.variant;
  const hasActiveStudentPath =
    dashboard.role === "student" &&
    activeVariant !== null &&
    dashboard.accessState !== "trial_needs_tier" &&
    dashboard.accessState !== "expired";

  if (!hasActiveStudentPath || !activeVariant) {
    return new Set<AvatarFrameKey>([DEFAULT_AVATAR_FRAME_KEY]);
  }

  const progressSummary = await getCourseProgressSummary("gcse-russian", activeVariant);
  const learningPlan = await getStudentLearningPlan(
    activeVariant,
    progressSummary.completedLessons
  );

  return getUnlockedAvatarFrameKeys({
    completedLessons: learningPlan.completedLessons,
    totalLessons: learningPlan.totalLessons,
  });
}

export async function persistCurrentAvatarFrameUnlocksForCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    return new Set<AvatarFrameKey>([DEFAULT_AVATAR_FRAME_KEY]);
  }

  const computedFrameKeys = await getComputedAvatarFrameKeysForCurrentUser();
  const frameKeysToPersist = getPersistableAvatarFrameKeys(computedFrameKeys);

  if (frameKeysToPersist.length === 0) {
    return computedFrameKeys;
  }

  const dashboard = await getDashboardInfo();
  const rows = frameKeysToPersist.map((frameKey) => ({
    user_id: user.id,
    achievement_key: frameKey,
    achievement_type: AVATAR_FRAME_ACHIEVEMENT_TYPE,
    source: "lesson_progress",
    source_course_slug: "gcse-russian",
    source_variant_slug: dashboard.variant,
    metadata: {},
  }));
  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("profile_achievement_unlocks")
    .upsert(rows, { onConflict: "user_id,achievement_type,achievement_key" });

  if (error) {
    console.error("Error persisting avatar frame unlocks:", error);
  }

  return computedFrameKeys;
}

export async function getUnlockedAvatarFrameKeysForCurrentUser() {
  const [computedFrameKeys, persistedFrameKeys] = await Promise.all([
    getComputedAvatarFrameKeysForCurrentUser(),
    getPersistedAvatarFrameKeysForCurrentUser(),
  ]);

  return new Set<AvatarFrameKey>([
    DEFAULT_AVATAR_FRAME_KEY,
    ...computedFrameKeys,
    ...persistedFrameKeys,
  ]);
}

export async function getAvatarFrameUnlockContextForCurrentUser() {
  const dashboard = await getDashboardInfo();

  return {
    courseLabel: getDashboardVariantLabel(dashboard.variant),
    unlockedFrameKeys: await getUnlockedAvatarFrameKeysForCurrentUser(),
  };
}

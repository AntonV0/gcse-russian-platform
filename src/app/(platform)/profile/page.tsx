import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import ProfileEditor, {
  type ProfileLearningSnapshot,
} from "@/components/profile/profile-editor";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth/auth";
import { getStudentLearningPlan } from "@/lib/dashboard/learning-plan";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  getSafeAvatarBackgroundKey,
  getSafeAvatarFrameKey,
  getUnlockedAvatarFrameKeys,
  profileAvatarOptions,
} from "@/lib/profile/avatar-customization";
import { getCourseProgressSummary } from "@/lib/progress/progress";

async function getProfileLearningSnapshot(): Promise<ProfileLearningSnapshot> {
  const dashboard = await getDashboardInfo();
  const activeVariant = dashboard.variant;
  const hasActiveStudentPath =
    dashboard.role === "student" &&
    activeVariant !== null &&
    dashboard.accessState !== "trial_needs_tier" &&
    dashboard.accessState !== "expired";

  if (!hasActiveStudentPath || !activeVariant) {
    return {
      completedLessons: 0,
      totalLessons: 0,
    };
  }

  const progressSummary = await getCourseProgressSummary("gcse-russian", activeVariant);
  const learningPlan = await getStudentLearningPlan(
    activeVariant,
    progressSummary.completedLessons
  );

  return {
    completedLessons: learningPlan.completedLessons,
    totalLessons: learningPlan.totalLessons,
  };
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
          description="Choose the name and avatar you want to see while you study."
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
  const currentAvatarBackgroundKey = getSafeAvatarBackgroundKey(
    "avatar_background_key" in (profile ?? {}) &&
      typeof profile?.avatar_background_key === "string"
      ? profile.avatar_background_key
      : null
  );
  const currentAvatarFrameKey = getSafeAvatarFrameKey(
    "equipped_avatar_frame_key" in (profile ?? {}) &&
      typeof profile?.equipped_avatar_frame_key === "string"
      ? profile.equipped_avatar_frame_key
      : null
  );
  const learningSnapshot = await getProfileLearningSnapshot();
  const unlockedAvatarFrameKeys = Array.from(
    getUnlockedAvatarFrameKeys({
      completedLessons: learningSnapshot.completedLessons,
      totalLessons: learningSnapshot.totalLessons,
    })
  );

  return (
    <main className="space-y-8">
      {resolvedSearchParams.error ? (
        <FeedbackBanner
          tone="danger"
          title="Profile update failed"
          description={resolvedSearchParams.error}
        />
      ) : null}

      <ProfileEditor
        avatars={profileAvatarOptions}
        email={user.email}
        initialFullName={profile?.full_name}
        initialDisplayName={profile?.display_name}
        initialAvatarKey={currentAvatarKey}
        initialAvatarBackgroundKey={currentAvatarBackgroundKey}
        initialAvatarFrameKey={currentAvatarFrameKey}
        unlockedAvatarFrameKeys={unlockedAvatarFrameKeys}
        learningSnapshot={learningSnapshot}
        profileUpdated={Boolean(resolvedSearchParams.success)}
      />
    </main>
  );
}

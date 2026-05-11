import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import ProfileEditor, {
  type ProfileLearningSnapshot,
} from "@/components/profile/profile-editor";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth/auth";
import {
  getDashboardAccessLabel,
  getDashboardVariantLabel,
  getStudentLearningPlan,
} from "@/lib/dashboard/learning-plan";
import { getDashboardInfo, type DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  getSafeAvatarBackgroundKey,
  getSafeAvatarFrameKey,
  getUnlockedAvatarFrameKeys,
  profileAvatarOptions,
} from "@/lib/profile/avatar-customization";
import { getCourseProgressSummary } from "@/lib/progress/progress";

function getDashboardRoleLabel(role: DashboardInfo["role"]) {
  if (role === "admin") return "Admin";
  if (role === "teacher") return "Teacher";
  if (role === "student") return "Student";
  return "Guest";
}

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
      roleLabel: getDashboardRoleLabel(dashboard.role),
      courseLabel: getDashboardVariantLabel(dashboard.variant),
      accessLabel: getDashboardAccessLabel(dashboard.accessMode),
      completedLessons: 0,
      totalLessons: 0,
      progressPercent: 0,
      nextLessonTitle: null,
      nextLessonMeta: null,
      nextLessonHref: null,
    };
  }

  const progressSummary = await getCourseProgressSummary("gcse-russian", activeVariant);
  const learningPlan = await getStudentLearningPlan(
    activeVariant,
    progressSummary.completedLessons
  );

  return {
    roleLabel: getDashboardRoleLabel(dashboard.role),
    courseLabel: getDashboardVariantLabel(dashboard.variant),
    accessLabel: getDashboardAccessLabel(dashboard.accessMode),
    completedLessons: learningPlan.completedLessons,
    totalLessons: learningPlan.totalLessons,
    progressPercent: learningPlan.progressPercent,
    nextLessonTitle: learningPlan.nextLesson?.title ?? null,
    nextLessonMeta: learningPlan.nextLesson?.moduleTitle ?? null,
    nextLessonHref: learningPlan.nextLesson?.href ?? null,
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

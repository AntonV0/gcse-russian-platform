import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import ProfileEditor, {
  type ProfileLearningSnapshot,
  type ProfileAvatarOption,
} from "@/components/profile/profile-editor";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth/auth";
import {
  getDashboardAccessLabel,
  getDashboardVariantLabel,
  getStudentLearningPlan,
} from "@/lib/dashboard/learning-plan";
import { getDashboardInfo, type DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import { getCourseProgressSummary } from "@/lib/progress/progress";

const presetAvatars: ProfileAvatarOption[] = [
  { key: "", emoji: "", label: "Initials", russian: "Инициалы" },
  { key: "snow-fox", emoji: "🦊", label: "Fox", russian: "Лиса" },
  { key: "cat", emoji: "🐱", label: "Cat", russian: "Кот" },
  { key: "dog", emoji: "🐶", label: "Dog", russian: "Собака" },
  { key: "owl", emoji: "🦉", label: "Owl", russian: "Сова" },
  { key: "wolf", emoji: "🐺", label: "Wolf", russian: "Волк" },
  { key: "tiger", emoji: "🐯", label: "Tiger", russian: "Тигр" },
  { key: "lion", emoji: "🦁", label: "Lion", russian: "Лев" },
  { key: "bear", emoji: "🐻", label: "Bear", russian: "Медведь" },
  { key: "panda", emoji: "🐼", label: "Panda", russian: "Панда" },
  { key: "koala", emoji: "🐨", label: "Koala", russian: "Коала" },
  { key: "monkey", emoji: "🐵", label: "Monkey", russian: "Обезьяна" },
  { key: "rabbit", emoji: "🐰", label: "Rabbit", russian: "Кролик" },
  { key: "hedgehog", emoji: "🦔", label: "Hedgehog", russian: "Ёж" },
  { key: "frog", emoji: "🐸", label: "Frog", russian: "Лягушка" },
  { key: "penguin", emoji: "🐧", label: "Penguin", russian: "Пингвин" },
  { key: "turtle", emoji: "🐢", label: "Turtle", russian: "Черепаха" },
  { key: "dolphin", emoji: "🐬", label: "Dolphin", russian: "Дельфин" },
  { key: "whale", emoji: "🐋", label: "Whale", russian: "Кит" },
  { key: "butterfly", emoji: "🦋", label: "Butterfly", russian: "Бабочка" },
  { key: "eagle", emoji: "🦅", label: "Eagle", russian: "Орёл" },
  { key: "parrot", emoji: "🦜", label: "Parrot", russian: "Попугай" },
  { key: "dragon", emoji: "🐉", label: "Dragon", russian: "Дракон" },
  { key: "unicorn", emoji: "🦄", label: "Unicorn", russian: "Единорог" },
  { key: "robot", emoji: "🤖", label: "Robot", russian: "Робот" },
  { key: "rocket", emoji: "🚀", label: "Rocket", russian: "Ракета" },
  { key: "astronaut", emoji: "🧑‍🚀", label: "Astronaut", russian: "Космонавт" },
  { key: "artist", emoji: "🧑‍🎨", label: "Artist", russian: "Художник" },
  { key: "mage", emoji: "🧙", label: "Mage", russian: "Маг" },
  { key: "ninja", emoji: "🥷", label: "Ninja", russian: "Ниндзя" },
  { key: "star", emoji: "⭐", label: "Star", russian: "Звезда" },
  { key: "sparkles", emoji: "✨", label: "Sparkles", russian: "Искры" },
  { key: "crown", emoji: "👑", label: "Crown", russian: "Корона" },
  { key: "medal", emoji: "🏅", label: "Medal", russian: "Медаль" },
  { key: "gem", emoji: "💎", label: "Gem", russian: "Алмаз" },
  { key: "book", emoji: "📘", label: "Book", russian: "Книга" },
  { key: "globe", emoji: "🌍", label: "Globe", russian: "Мир" },
  { key: "compass", emoji: "🧭", label: "Compass", russian: "Компас" },
  { key: "moon", emoji: "🌙", label: "Moon", russian: "Луна" },
  { key: "sun", emoji: "☀️", label: "Sun", russian: "Солнце" },
  { key: "mountain", emoji: "⛰️", label: "Mountain", russian: "Гора" },
  { key: "wave", emoji: "🌊", label: "Wave", russian: "Волна" },
  { key: "anchor", emoji: "⚓", label: "Anchor", russian: "Якорь" },
  { key: "camera", emoji: "📷", label: "Camera", russian: "Камера" },
  { key: "palette", emoji: "🎨", label: "Palette", russian: "Палитра" },
  { key: "guitar", emoji: "🎸", label: "Guitar", russian: "Гитара" },
  { key: "octopus", emoji: "🐙", label: "Octopus", russian: "Осьминог" },
  { key: "crab", emoji: "🦀", label: "Crab", russian: "Краб" },
];

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

  const progressSummary = await getCourseProgressSummary(
    "gcse-russian",
    activeVariant
  );
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
          description="Choose the name and avatar shown around your student area."
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
  const learningSnapshot = await getProfileLearningSnapshot();

  return (
    <main className="space-y-8">
      <PageHeader
        title="Profile"
        description="Choose the name and avatar shown around your student area."
      />

      {resolvedSearchParams.error ? (
        <FeedbackBanner
          tone="danger"
          title="Profile update failed"
          description={resolvedSearchParams.error}
        />
      ) : null}

      <ProfileEditor
        avatars={presetAvatars}
        email={user.email}
        initialFullName={profile?.full_name}
        initialDisplayName={profile?.display_name}
        initialAvatarKey={currentAvatarKey}
        learningSnapshot={learningSnapshot}
        profileUpdated={Boolean(resolvedSearchParams.success)}
      />
    </main>
  );
}

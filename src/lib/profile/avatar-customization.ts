export type ProfileAvatarOption = {
  key: string;
  emoji: string;
  label: string;
  russian: string;
};

export type AvatarBackgroundKey =
  | "sky"
  | "mint"
  | "sunset"
  | "rose"
  | "lilac"
  | "amber"
  | "volna"
  | "midnight"
  | "birch"
  | "ruby"
  | "forest"
  | "ocean"
  | "grape"
  | "blush";

export type AvatarFrameKey =
  | "none"
  | "first-lesson"
  | "five-lessons"
  | "ten-lessons"
  | "course-complete";

export type AvatarBackgroundOption = {
  key: AvatarBackgroundKey;
  label: string;
  russian: string;
  background: string;
  textClassName: string;
};

export type AvatarFrameOption = {
  key: AvatarFrameKey;
  label: string;
  description: string;
  requirementLabel: string;
  frameBackground: string;
  frameShadow: string;
  frameSize: number;
  textClassName: string;
};

export type AvatarFrameProgressSnapshot = {
  completedLessons: number;
  totalLessons: number;
};

export const DEFAULT_AVATAR_BACKGROUND_KEY: AvatarBackgroundKey = "sky";
export const DEFAULT_AVATAR_FRAME_KEY: AvatarFrameKey = "none";

export const profileAvatarOptions: ProfileAvatarOption[] = [
  { key: "", emoji: "", label: "Initials", russian: "Инициалы" },
  { key: "student", emoji: "🧑‍🎓", label: "Student", russian: "Ученик" },
  { key: "star", emoji: "⭐", label: "Star", russian: "Звезда" },
  { key: "sparkles", emoji: "✨", label: "Sparkles", russian: "Искры" },
  { key: "rocket", emoji: "🚀", label: "Rocket", russian: "Ракета" },
  { key: "book", emoji: "📘", label: "Book", russian: "Книга" },
  { key: "scientist", emoji: "🧑‍🔬", label: "Scientist", russian: "Учёный" },
  { key: "artist", emoji: "🧑‍🎨", label: "Artist", russian: "Художник" },
  { key: "astronaut", emoji: "🧑‍🚀", label: "Astronaut", russian: "Космонавт" },
  { key: "programmer", emoji: "🧑‍💻", label: "Programmer", russian: "Программист" },
  { key: "mage", emoji: "🧙", label: "Mage", russian: "Маг" },
  { key: "robot", emoji: "🤖", label: "Robot", russian: "Робот" },

  { key: "musician", emoji: "🧑‍🎤", label: "Musician", russian: "Музыкант" },
  { key: "writer", emoji: "✍️", label: "Writer", russian: "Писатель" },
  { key: "teacher", emoji: "🧑‍🏫", label: "Teacher", russian: "Учитель" },
  { key: "detective", emoji: "🕵️", label: "Detective", russian: "Детектив" },
  { key: "explorer", emoji: "🗺️", label: "Explorer", russian: "Исследователь" },
  { key: "pilot", emoji: "🧑‍✈️", label: "Pilot", russian: "Пилот" },
  { key: "chef", emoji: "🧑‍🍳", label: "Chef", russian: "Повар" },
  { key: "engineer", emoji: "🧑‍🔧", label: "Engineer", russian: "Инженер" },
  { key: "gardener", emoji: "🧑‍🌾", label: "Gardener", russian: "Садовник" },
  { key: "globe", emoji: "🌍", label: "Globe", russian: "Мир" },
  { key: "compass", emoji: "🧭", label: "Compass", russian: "Компас" },
  { key: "medal", emoji: "🏅", label: "Medal", russian: "Медаль" },

  { key: "cat", emoji: "🐱", label: "Cat", russian: "Кот" },
  { key: "dog", emoji: "🐶", label: "Dog", russian: "Собака" },
  { key: "panda", emoji: "🐼", label: "Panda", russian: "Панда" },
  { key: "rabbit", emoji: "🐰", label: "Rabbit", russian: "Кролик" },
  { key: "penguin", emoji: "🐧", label: "Penguin", russian: "Пингвин" },
  { key: "turtle", emoji: "🐢", label: "Turtle", russian: "Черепаха" },
  { key: "dolphin", emoji: "🐬", label: "Dolphin", russian: "Дельфин" },
  { key: "butterfly", emoji: "🦋", label: "Butterfly", russian: "Бабочка" },
  { key: "snow-fox", emoji: "🦊", label: "Fox", russian: "Лиса" },
  { key: "owl", emoji: "🦉", label: "Owl", russian: "Сова" },
  { key: "koala", emoji: "🐨", label: "Koala", russian: "Коала" },
  { key: "hedgehog", emoji: "🦔", label: "Hedgehog", russian: "Ёж" },

  { key: "palette", emoji: "🎨", label: "Palette", russian: "Палитра" },
  { key: "camera", emoji: "📷", label: "Camera", russian: "Камера" },
  { key: "guitar", emoji: "🎸", label: "Guitar", russian: "Гитара" },
  { key: "football", emoji: "⚽", label: "Football", russian: "Футбол" },
  { key: "gem", emoji: "💎", label: "Gem", russian: "Алмаз" },
  { key: "crown", emoji: "👑", label: "Crown", russian: "Корона" },
  { key: "sun", emoji: "☀️", label: "Sun", russian: "Солнце" },
  { key: "moon", emoji: "🌙", label: "Moon", russian: "Луна" },
  { key: "mountain", emoji: "⛰️", label: "Mountain", russian: "Гора" },
  { key: "wave", emoji: "🌊", label: "Wave", russian: "Волна" },
  { key: "anchor", emoji: "⚓", label: "Anchor", russian: "Якорь" },
  { key: "unicorn", emoji: "🦄", label: "Unicorn", russian: "Единорог" },

  { key: "wolf", emoji: "🐺", label: "Wolf", russian: "Волк" },
  { key: "tiger", emoji: "🐯", label: "Tiger", russian: "Тигр" },
  { key: "lion", emoji: "🦁", label: "Lion", russian: "Лев" },
  { key: "bear", emoji: "🐻", label: "Bear", russian: "Медведь" },
  { key: "monkey", emoji: "🐵", label: "Monkey", russian: "Обезьяна" },
  { key: "frog", emoji: "🐸", label: "Frog", russian: "Лягушка" },
  { key: "parrot", emoji: "🦜", label: "Parrot", russian: "Попугай" },
  { key: "eagle", emoji: "🦅", label: "Eagle", russian: "Орёл" },
  { key: "whale", emoji: "🐋", label: "Whale", russian: "Кит" },
  { key: "octopus", emoji: "🐙", label: "Octopus", russian: "Осьминог" },
  { key: "crab", emoji: "🦀", label: "Crab", russian: "Краб" },
  { key: "dragon", emoji: "🐉", label: "Dragon", russian: "Дракон" },
];

export const avatarBackgroundOptions: AvatarBackgroundOption[] = [
  {
    key: "sky",
    label: "Sky",
    russian: "Небо",
    background: "linear-gradient(135deg, #dbeafe 0%, #f8fafc 100%)",
    textClassName: "text-blue-900",
  },
  {
    key: "mint",
    label: "Mint",
    russian: "Мята",
    background: "linear-gradient(135deg, #bbf7d0 0%, #f0fdf4 100%)",
    textClassName: "text-emerald-950",
  },
  {
    key: "sunset",
    label: "Sunset",
    russian: "Закат",
    background: "linear-gradient(135deg, #fed7aa 0%, #fef3c7 100%)",
    textClassName: "text-orange-950",
  },
  {
    key: "rose",
    label: "Rose",
    russian: "Роза",
    background: "linear-gradient(135deg, #fecdd3 0%, #fff1f2 100%)",
    textClassName: "text-rose-950",
  },
  {
    key: "lilac",
    label: "Lilac",
    russian: "Сирень",
    background: "linear-gradient(135deg, #ddd6fe 0%, #faf5ff 100%)",
    textClassName: "text-violet-950",
  },
  {
    key: "amber",
    label: "Amber",
    russian: "Янтарь",
    background: "linear-gradient(135deg, #fde68a 0%, #fff7ed 100%)",
    textClassName: "text-amber-950",
  },
  {
    key: "volna",
    label: "Ice",
    russian: "Лёд",
    background: "linear-gradient(135deg, #a5f3fc 0%, #ecfeff 100%)",
    textClassName: "text-cyan-950",
  },
  {
    key: "midnight",
    label: "Midnight",
    russian: "Полночь",
    background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
    textClassName: "text-white",
  },
  {
    key: "birch",
    label: "Birch",
    russian: "Берёза",
    background: "linear-gradient(135deg, #e5e7eb 0%, #ffffff 100%)",
    textClassName: "text-slate-900",
  },
  {
    key: "ruby",
    label: "Ruby",
    russian: "Рубин",
    background: "linear-gradient(135deg, #991b1b 0%, #ef4444 100%)",
    textClassName: "text-white",
  },
  {
    key: "forest",
    label: "Forest",
    russian: "Лес",
    background: "linear-gradient(135deg, #166534 0%, #22c55e 100%)",
    textClassName: "text-white",
  },
  {
    key: "ocean",
    label: "Ocean",
    russian: "Океан",
    background: "linear-gradient(135deg, #0e7490 0%, #38bdf8 100%)",
    textClassName: "text-white",
  },
  {
    key: "grape",
    label: "Grape",
    russian: "Виноград",
    background: "linear-gradient(135deg, #6d28d9 0%, #c4b5fd 100%)",
    textClassName: "text-white",
  },
  {
    key: "blush",
    label: "Blush",
    russian: "Румянец",
    background: "linear-gradient(135deg, #f9a8d4 0%, #fde68a 100%)",
    textClassName: "text-rose-950",
  },
];

export const avatarFrameOptions: AvatarFrameOption[] = [
  {
    key: "none",
    label: "No frame",
    description: "Keep the avatar clean and simple.",
    requirementLabel: "Always available",
    frameBackground: "color-mix(in srgb, var(--accent) 18%, var(--border-subtle))",
    frameShadow: "0 8px 18px color-mix(in srgb, var(--accent) 7%, transparent)",
    frameSize: 1,
    textClassName: "text-[var(--text-secondary)]",
  },
  {
    key: "first-lesson",
    label: "First lesson",
    description: "A bright starter ring for the first saved lesson.",
    requirementLabel: "Complete 1 lesson",
    frameBackground:
      "conic-gradient(from 180deg, #38bdf8, #60a5fa, #a78bfa, #38bdf8)",
    frameShadow: "0 0 0 1px rgba(96,165,250,0.2), 0 12px 26px rgba(59,130,246,0.22)",
    frameSize: 3,
    textClassName: "text-sky-700",
  },
  {
    key: "five-lessons",
    label: "Five lessons",
    description: "A polished progress frame for steady course movement.",
    requirementLabel: "Complete 5 lessons",
    frameBackground:
      "conic-gradient(from 120deg, #22c55e, #84cc16, #facc15, #22c55e)",
    frameShadow: "0 0 0 1px rgba(34,197,94,0.18), 0 12px 28px rgba(34,197,94,0.22)",
    frameSize: 3,
    textClassName: "text-emerald-700",
  },
  {
    key: "ten-lessons",
    label: "Ten lessons",
    description: "A stronger frame for reaching double figures.",
    requirementLabel: "Complete 10 lessons",
    frameBackground:
      "conic-gradient(from 45deg, #f97316, #facc15, #fb7185, #f97316)",
    frameShadow: "0 0 0 1px rgba(249,115,22,0.2), 0 14px 32px rgba(249,115,22,0.24)",
    frameSize: 4,
    textClassName: "text-orange-700",
  },
  {
    key: "course-complete",
    label: "Course complete",
    description: "The full-path frame for completing every available lesson.",
    requirementLabel: "Complete all lessons",
    frameBackground:
      "conic-gradient(from 90deg, #facc15, #f8fafc, #f59e0b, #fef3c7, #facc15)",
    frameShadow: "0 0 0 1px rgba(250,204,21,0.24), 0 16px 38px rgba(234,179,8,0.32)",
    frameSize: 4,
    textClassName: "text-amber-700",
  },
];

const avatarBackgroundKeys = new Set(avatarBackgroundOptions.map((option) => option.key));
const avatarFrameKeys = new Set(avatarFrameOptions.map((option) => option.key));
const profileAvatarKeys = new Set(profileAvatarOptions.map((option) => option.key));

export function getAvatarOption(avatarKey: string | null | undefined) {
  return (
    profileAvatarOptions.find((avatar) => avatar.key === (avatarKey ?? "")) ??
    profileAvatarOptions[0]
  );
}

export function getAvatarBackgroundOption(
  backgroundKey: string | null | undefined
) {
  return (
    avatarBackgroundOptions.find((background) => background.key === backgroundKey) ??
    avatarBackgroundOptions[0]
  );
}

export function getAvatarFrameOption(frameKey: string | null | undefined) {
  return (
    avatarFrameOptions.find((frame) => frame.key === (frameKey ?? "none")) ??
    avatarFrameOptions[0]
  );
}

export function isAvatarBackgroundKey(value: string): value is AvatarBackgroundKey {
  return avatarBackgroundKeys.has(value as AvatarBackgroundKey);
}

export function isAvatarFrameKey(value: string): value is AvatarFrameKey {
  return avatarFrameKeys.has(value as AvatarFrameKey);
}

export function isProfileAvatarKey(value: string) {
  return profileAvatarKeys.has(value);
}

export function getSafeProfileAvatarKey(value: string | null | undefined) {
  return value && isProfileAvatarKey(value) ? value : "";
}

export function getSafeAvatarBackgroundKey(value: string | null | undefined) {
  return value && isAvatarBackgroundKey(value) ? value : DEFAULT_AVATAR_BACKGROUND_KEY;
}

export function getSafeAvatarFrameKey(value: string | null | undefined) {
  return value && isAvatarFrameKey(value) ? value : DEFAULT_AVATAR_FRAME_KEY;
}

export function getUnlockedAvatarFrameKeys(snapshot: AvatarFrameProgressSnapshot) {
  const unlocked = new Set<AvatarFrameKey>([DEFAULT_AVATAR_FRAME_KEY]);

  if (snapshot.completedLessons >= 1) {
    unlocked.add("first-lesson");
  }

  if (snapshot.completedLessons >= 5) {
    unlocked.add("five-lessons");
  }

  if (snapshot.completedLessons >= 10) {
    unlocked.add("ten-lessons");
  }

  if (snapshot.totalLessons > 0 && snapshot.completedLessons >= snapshot.totalLessons) {
    unlocked.add("course-complete");
  }

  return unlocked;
}

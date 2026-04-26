export type OgImageKey =
  | "course"
  | "edexcel"
  | "lessons"
  | "past-papers"
  | "pricing"
  | "private-candidates"
  | "revision"
  | "tutor";

export type OgImageDefinition = {
  title: string;
  kicker: string;
  description: string;
  accent: string;
  softAccent: string;
};

export const OG_IMAGE_DEFINITIONS: Record<OgImageKey, OgImageDefinition> = {
  course: {
    title: "Online GCSE Russian Course",
    kicker: "GCSE Russian",
    description:
      "Structured Pearson Edexcel 1RU0 lessons, grammar, vocabulary, and exam practice.",
    accent: "#3563d8",
    softAccent: "#e8eefc",
  },
  edexcel: {
    title: "Pearson Edexcel GCSE Russian 1RU0",
    kicker: "Exam guide",
    description:
      "Four papers, Foundation and Higher tiers, and practical preparation guidance.",
    accent: "#0f766e",
    softAccent: "#ddf7f3",
  },
  lessons: {
    title: "Online GCSE Russian Lessons",
    kicker: "Teacher support",
    description:
      "Live guidance, speaking practice, writing feedback, and course structure.",
    accent: "#8b5a12",
    softAccent: "#fff3d6",
  },
  "past-papers": {
    title: "GCSE Russian Past Papers",
    kicker: "Revision strategy",
    description:
      "Use official papers, mark schemes, mocks, and mistake review more effectively.",
    accent: "#7c3aed",
    softAccent: "#efe7ff",
  },
  pricing: {
    title: "GCSE Russian Course Pricing",
    kicker: "Trial-first access",
    description: "Compare Foundation and Higher access before upgrading inside the app.",
    accent: "#be123c",
    softAccent: "#ffe4ec",
  },
  "private-candidates": {
    title: "Russian GCSE Private Candidate Guide",
    kicker: "Exam-centre planning",
    description:
      "Preparation, tier choice, speaking support, and centre questions for families.",
    accent: "#166534",
    softAccent: "#dcfce7",
  },
  revision: {
    title: "GCSE Russian Revision Guide",
    kicker: "Weekly study plan",
    description: "Vocabulary, grammar, paper practice, and measurable review routines.",
    accent: "#c2410c",
    softAccent: "#ffedd5",
  },
  tutor: {
    title: "GCSE Russian Tutor or Online Course?",
    kicker: "Support comparison",
    description:
      "Compare live lessons, tutor feedback, independent study, and platform structure.",
    accent: "#4338ca",
    softAccent: "#e7e7ff",
  },
};

export function getOgImagePath(key: OgImageKey) {
  return `/og/${key}`;
}

export function getOgImageDefinition(key: string) {
  return OG_IMAGE_DEFINITIONS[key as OgImageKey] ?? null;
}

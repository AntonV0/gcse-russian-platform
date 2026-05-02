export type OgImageKey =
  | "about"
  | "blog"
  | "course"
  | "edexcel"
  | "exam-guide"
  | "faq"
  | "foundation"
  | "grammar"
  | "higher"
  | "lessons"
  | "listening"
  | "parents"
  | "past-papers"
  | "pricing"
  | "private-candidates"
  | "reading"
  | "resources"
  | "revision"
  | "speaking"
  | "tutor"
  | "vocabulary"
  | "writing";

export type OgImageDefinition = {
  title: string;
  kicker: string;
  description: string;
  accent: string;
  softAccent: string;
};

export const OG_IMAGE_DEFINITIONS: Record<OgImageKey, OgImageDefinition> = {
  about: {
    title: "About GCSERussian.com",
    kicker: "Course platform",
    description:
      "A structured GCSE Russian course platform for students, parents, and private candidates.",
    accent: "#0f766e",
    softAccent: "#ddf7f3",
  },
  blog: {
    title: "GCSE Russian Articles",
    kicker: "Coming soon",
    description:
      "Exam advice, revision routines, vocabulary, grammar, and course updates.",
    accent: "#4338ca",
    softAccent: "#e7e7ff",
  },
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
  "exam-guide": {
    title: "GCSE Russian Exam Guide",
    kicker: "Four papers",
    description:
      "Listening, speaking, reading, writing, tier choice, and structured revision.",
    accent: "#2563eb",
    softAccent: "#e6efff",
  },
  faq: {
    title: "GCSE Russian Course FAQ",
    kicker: "Clear answers",
    description:
      "Trial access, pricing, tiers, support, parents, and private candidates.",
    accent: "#2563eb",
    softAccent: "#e6efff",
  },
  foundation: {
    title: "GCSE Russian Foundation Tier",
    kicker: "Core confidence",
    description:
      "Secure vocabulary, reliable grammar, accessible tasks, and steady progress.",
    accent: "#0f766e",
    softAccent: "#ddf7f3",
  },
  grammar: {
    title: "GCSE Russian Grammar Guide",
    kicker: "Sentence control",
    description: "Tense, cases, endings, translation, and grammar in context.",
    accent: "#4338ca",
    softAccent: "#e7e7ff",
  },
  higher: {
    title: "GCSE Russian Higher Tier",
    kicker: "Range and accuracy",
    description:
      "Wider vocabulary, controlled grammar, translation, and developed answers.",
    accent: "#7c3aed",
    softAccent: "#efe7ff",
  },
  lessons: {
    title: "Online GCSE Russian Lessons",
    kicker: "Teacher support",
    description:
      "Live guidance, speaking practice, writing feedback, and course structure.",
    accent: "#8b5a12",
    softAccent: "#fff3d6",
  },
  listening: {
    title: "GCSE Russian Listening Exam",
    kicker: "Paper 1",
    description: "Gist, detail, opinions, audio strategy, and vocabulary recognition.",
    accent: "#2563eb",
    softAccent: "#e6efff",
  },
  parents: {
    title: "GCSE Russian for Parents",
    kicker: "Family support",
    description:
      "Course structure, progress visibility, support decisions, and calmer planning.",
    accent: "#0f766e",
    softAccent: "#ddf7f3",
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
  reading: {
    title: "GCSE Russian Reading Exam",
    kicker: "Paper 3",
    description: "Comprehension, inference, grammar clues, and translation into English.",
    accent: "#7c3aed",
    softAccent: "#efe7ff",
  },
  resources: {
    title: "GCSE Russian Resources",
    kicker: "Guide library",
    description:
      "Exam guides, revision, grammar, vocabulary, tiers, and family support.",
    accent: "#2563eb",
    softAccent: "#e6efff",
  },
  revision: {
    title: "GCSE Russian Revision Guide",
    kicker: "Weekly study plan",
    description: "Vocabulary, grammar, paper practice, and measurable review routines.",
    accent: "#c2410c",
    softAccent: "#ffedd5",
  },
  speaking: {
    title: "GCSE Russian Speaking Exam",
    kicker: "Paper 2",
    description: "Role play, picture-based tasks, conversation, and confidence.",
    accent: "#0f766e",
    softAccent: "#ddf7f3",
  },
  tutor: {
    title: "GCSE Russian Tutor or Online Course?",
    kicker: "Support comparison",
    description:
      "Compare live lessons, tutor feedback, independent study, and platform structure.",
    accent: "#4338ca",
    softAccent: "#e7e7ff",
  },
  vocabulary: {
    title: "GCSE Russian Vocabulary Guide",
    kicker: "Active revision",
    description: "Themes, recall, recognition, productive vocabulary, and exam use.",
    accent: "#0f766e",
    softAccent: "#ddf7f3",
  },
  writing: {
    title: "GCSE Russian Writing Exam",
    kicker: "Paper 4",
    description: "Translation, grammar accuracy, task planning, and written answers.",
    accent: "#be123c",
    softAccent: "#ffe4ec",
  },
};

export function getOgImagePath(key: OgImageKey) {
  return `/og/${key}`;
}

export function getOgImageDefinition(key: string) {
  return OG_IMAGE_DEFINITIONS[key as OgImageKey] ?? null;
}

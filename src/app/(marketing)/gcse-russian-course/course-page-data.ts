import type { AppIconKey } from "@/lib/shared/icons";

type FeatureItem = {
  title: string;
  description: string;
  icon: AppIconKey;
};

type FaqItem = {
  question: string;
  answer: string;
};

export const courseLayers = [
  {
    title: "Start here",
    time: "2-3 hours",
    description: "Orientation, exam overview, and Foundation vs Higher explained.",
    icon: "school",
  },
  {
    title: "Core foundations",
    time: "10-15 hours",
    description: "High-frequency vocabulary, sentence building, present tense, opinions.",
    icon: "brain",
  },
  {
    title: "GCSE themes",
    time: "50-60 hours",
    description: "Identity, travel, school, future plans, and global issues.",
    icon: "layers",
  },
  {
    title: "Skill training",
    time: "15-20 hours",
    description: "Listening, speaking, reading, writing, and translation technique.",
    icon: "exam",
  },
  {
    title: "Revision and mocks",
    time: "15-20 hours",
    description: "Mixed practice, paper practice, mock exams, and weakness targeting.",
    icon: "mockExam",
  },
] satisfies FeatureItem[] & Array<{ time: string }>;

export const lessonFlow = [
  {
    title: "Learn",
    description: "Explanations, notes, vocabulary, examples, and exam tips.",
    icon: "lessonContent",
  },
  {
    title: "Practise",
    description: "Controlled exercises, sentence building, gap fills, and question sets.",
    icon: "exercise",
  },
  {
    title: "Apply",
    description: "Reading, listening, writing, speaking, and translation-style tasks.",
    icon: "examTip",
  },
] satisfies FeatureItem[];

export const courseIncludes = [
  {
    title: "Variant-aware lessons",
    description:
      "Shared teaching can sit alongside Foundation-only and Higher-only sections.",
    icon: "layers",
  },
  {
    title: "Vocabulary that returns",
    description:
      "Words introduced in lessons can reappear in revision and practice tools.",
    icon: "vocabulary",
  },
  {
    title: "Grammar with output",
    description:
      "Patterns are practised through examples, translations, and written answers.",
    icon: "grammar",
  },
  {
    title: "Question-set practice",
    description:
      "Controlled practice prepares students before they meet harder exam tasks.",
    icon: "questionSet",
  },
  {
    title: "Mock preparation",
    description:
      "Platform-created GCSE-style mocks sit separately from official Pearson links.",
    icon: "mockExam",
  },
  {
    title: "Progress visibility",
    description:
      "Students can return to the next useful step and revisit earlier sections.",
    icon: "completed",
  },
] satisfies FeatureItem[];

export const tierComparison = [
  {
    label: "Shared course core",
    foundation:
      "Secure the high-frequency language and GCSE routines that every student needs.",
    higher:
      "Use the same core as a launchpad before moving into harder sentence patterns.",
    icon: "layers",
  },
  {
    label: "Difficulty control",
    foundation:
      "Focus on accessible output, reliable comprehension, and confidence with common tasks.",
    higher:
      "Unlock extra challenge, fuller answers, richer grammar, and more demanding practice.",
    icon: "settings",
  },
  {
    label: "Revision route",
    foundation: "Revisit essentials without being buried under extension work.",
    higher:
      "Target weaknesses while keeping higher-tier vocabulary and paper demands visible.",
    icon: "completed",
  },
] satisfies Array<{
  label: string;
  foundation: string;
  higher: string;
  icon: AppIconKey;
}>;

export const examPapers = [
  {
    paper: "Paper 1",
    title: "Listening",
    description:
      "Audio-led comprehension practice, topic vocabulary, and question handling.",
    icon: "listening",
  },
  {
    paper: "Paper 2",
    title: "Speaking",
    description:
      "Role play, picture-based discussion, conversation themes, and answer building.",
    icon: "speaking",
  },
  {
    paper: "Paper 3",
    title: "Reading",
    description:
      "Short texts, inference, translation into English, and paper-style questions.",
    icon: "lessonContent",
  },
  {
    paper: "Paper 4",
    title: "Writing",
    description:
      "Sentence control, translation into Russian, opinions, reasons, and longer answers.",
    icon: "write",
  },
] satisfies FeatureItem[] & Array<{ paper: string }>;

export const publicAppSplit = [
  {
    title: "Public guide pages",
    description:
      "Useful for families comparing tiers, exam papers, private-candidate logistics, and revision decisions.",
    icon: "pastPapers",
  },
  {
    title: "Trial course access",
    description:
      "Useful when the student needs to see the learning route, sample lessons, practice surfaces, and dashboard flow.",
    icon: "unlocked",
  },
  {
    title: "Paid course routine",
    description:
      "Useful once weekly study, revision, mock preparation, and optional live support need to become repeatable.",
    icon: "calendar",
  },
] satisfies FeatureItem[];

export const audiences = [
  {
    title: "Self-study students",
    description:
      "A clear route through the course when school support is limited or uneven.",
    icon: "student",
  },
  {
    title: "Parents",
    description:
      "Enough structure to understand the plan without becoming the Russian teacher.",
    icon: "users",
  },
  {
    title: "Private candidates",
    description: "Course preparation can run alongside separate exam-entry arrangements.",
    icon: "userCheck",
  },
  {
    title: "Volna learners",
    description:
      "The same platform can support teacher-led assignments and feedback workflows.",
    icon: "teacher",
  },
] satisfies FeatureItem[];

export const faqs: FaqItem[] = [
  {
    question: "Is the course only for Pearson Edexcel GCSE Russian?",
    answer:
      "The course is designed around Pearson Edexcel GCSE Russian 1RU0. It is not an official Pearson product or endorsement.",
  },
  {
    question: "Is the full course self-study?",
    answer:
      "The main course is built for self-study, with optional live support through Volna-style teacher workflows where needed.",
  },
  {
    question: "How do Foundation and Higher work?",
    answer:
      "Some content can be shared, while harder sections can be shown only to Higher students and core sections can be targeted to Foundation students.",
  },
  {
    question: "Can private candidates use it?",
    answer:
      "Yes. The course can support preparation, but exam entry, speaking arrangements, and deadlines still need to be organised with an exam centre.",
  },
];

export const relatedLinks = [
  { href: "/edexcel-gcse-russian", label: "Edexcel guide", icon: "school" },
  { href: "/gcse-russian-exam-guide", label: "Exam guide", icon: "exam" },
  { href: "/gcse-russian-foundation-tier", label: "Foundation tier", icon: "layers" },
  { href: "/gcse-russian-higher-tier", label: "Higher tier", icon: "star" },
  {
    href: "/russian-gcse-private-candidate",
    label: "Private candidates",
    icon: "userCheck",
  },
] satisfies Array<{ href: string; label: string; icon: AppIconKey }>;

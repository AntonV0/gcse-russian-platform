import type { AppIconKey } from "@/lib/shared/icons";

type FeatureItem = {
  title: string;
  description: string;
  icon: AppIconKey;
};

type DetailFeatureItem = {
  title: string;
  detail: string;
  icon: AppIconKey;
};

type ProblemSolutionItem = {
  problem: string;
  solution: string;
  icon: AppIconKey;
};

type FaqItem = {
  question: string;
  answer: string;
};

export const proofItems = [
  "Pearson Edexcel GCSE Russian 1RU0",
  "Foundation and Higher pathways",
  "Trial before checkout",
  "Built around Volna teaching workflows",
];

export const problemSolutions = [
  {
    problem: "Revision becomes a pile of tabs, worksheets, and forgotten vocab lists.",
    solution:
      "The course gives students one route through lessons, practice, and review.",
    icon: "navigation",
  },
  {
    problem:
      "Grammar feels separate from the answers students need to write or translate.",
    solution: "Grammar is taught through examples, sentences, and exam-style tasks.",
    icon: "grammar",
  },
  {
    problem:
      "Parents want to help, but do not know what a sensible Russian plan looks like.",
    solution: "Progress and next steps make support at home calmer and more practical.",
    icon: "completed",
  },
] satisfies ProblemSolutionItem[];

export const trialIncludes = [
  "Course structure preview",
  "Sample learning route",
  "Billing only after signup",
  "Foundation/Higher comparison",
];

export const productHighlights = [
  {
    title: "Short sessions",
    description:
      "Lessons are designed for busy school weeks: clear enough to start after school, structured enough to return to later.",
    icon: "pending",
  },
  {
    title: "Real GCSE shape",
    description:
      "Vocabulary, grammar, speaking, reading, writing, translation, and mock preparation all connect back to Pearson Edexcel 1RU0.",
    icon: "exam",
  },
  {
    title: "Parent visibility",
    description:
      "The next useful step is easier to see, so support at home does not depend on guesswork.",
    icon: "users",
  },
] satisfies FeatureItem[];

export const courseLayers = [
  { title: "Start", detail: "Exam overview and course orientation", icon: "school" },
  {
    title: "Foundations",
    detail: "High-frequency words and sentence building",
    icon: "brain",
  },
  {
    title: "Themes",
    detail: "Identity, school, travel, future plans, global issues",
    icon: "layers",
  },
  {
    title: "Skills",
    detail: "Listening, speaking, reading, writing, translation",
    icon: "exam",
  },
  {
    title: "Revision",
    detail: "Mixed practice, mocks, and weakness targeting",
    icon: "mockExam",
  },
] satisfies DetailFeatureItem[];

export const lessonBlocks = [
  { title: "Teach", detail: "Clear explanation", icon: "note" },
  { title: "Practise", detail: "Vocab, grammar, questions", icon: "exercise" },
  { title: "Apply", detail: "Exam-style task", icon: "examTip" },
] satisfies DetailFeatureItem[];

export const practiceSurfaces = [
  {
    title: "Vocabulary",
    description:
      "Required and extension words can sit inside lessons and topic revision.",
    icon: "vocabulary",
  },
  {
    title: "Grammar",
    description:
      "Patterns are practised in sentences, translations, and written answers.",
    icon: "grammar",
  },
  {
    title: "Questions",
    description: "Question sets support controlled practice before harder exam tasks.",
    icon: "questionSet",
  },
  {
    title: "Mocks",
    description:
      "Platform-created GCSE-style mocks stay separate from official Pearson links.",
    icon: "mockExam",
  },
] satisfies FeatureItem[];

export const audiences = [
  {
    title: "Students",
    description:
      "Know what to do next after school, even when GCSE Russian feels hard to organise.",
    icon: "student",
  },
  {
    title: "Parents",
    description: "Support the routine without needing to teach Russian grammar yourself.",
    icon: "users",
  },
  {
    title: "Private candidates",
    description:
      "Use a structured route while exam entry and speaking logistics are arranged separately.",
    icon: "userCheck",
  },
] satisfies FeatureItem[];

export const faqs: FaqItem[] = [
  {
    question: "Is this an official Pearson Edexcel course?",
    answer:
      "No. It is an independent GCSE Russian course built around Pearson Edexcel 1RU0 preparation.",
  },
  {
    question: "Can students try it first?",
    answer:
      "Yes. Students can create a trial account and explore the learning environment before checkout.",
  },
  {
    question: "Does it replace a tutor?",
    answer:
      "It provides structure and practice. Some students may still benefit from live support for speaking, writing, or accountability.",
  },
  {
    question: "Are the mocks official papers?",
    answer:
      "No. Mock exams in the platform are GCSE-style practice. Official Pearson past paper links are kept separately.",
  },
];

export const primaryLinks = [
  { href: "/gcse-russian-course", label: "Course" },
  { href: "/pricing", label: "Pricing" },
  { href: "/gcse-russian-for-parents", label: "Parents" },
  { href: "/russian-gcse-private-candidate", label: "Private candidates" },
  { href: "/gcse-russian-exam-guide", label: "Exam guide" },
  { href: "/resources", label: "Resources" },
];

export const guideLinks = [
  { href: "/edexcel-gcse-russian", label: "Edexcel guide" },
  { href: "/gcse-russian-revision", label: "Revision" },
  { href: "/gcse-russian-vocabulary", label: "Vocabulary" },
  { href: "/gcse-russian-grammar", label: "Grammar" },
  { href: "/online-gcse-russian-lessons", label: "Online lessons" },
  { href: "/gcse-russian-tutor", label: "Tutor guide" },
  { href: "/faq", label: "FAQ" },
];

import type { AppIconKey } from "@/lib/shared/icons";

type CandidateItem = {
  title: string;
  description: string;
  icon: AppIconKey;
};

type ChecklistItem = {
  title: string;
  question: string;
  whyItMatters: string;
  icon: AppIconKey;
};

type FaqItem = {
  question: string;
  answer: string;
};

export const firstDecisions = [
  {
    title: "Exam centre",
    description:
      "Find a centre that accepts private candidates for Pearson Edexcel GCSE Russian and can explain its process.",
    icon: "school",
  },
  {
    title: "Speaking arrangements",
    description:
      "Ask early how the speaking paper is handled, because it is often the most complex part for private candidates.",
    icon: "speaking",
  },
  {
    title: "Preparation route",
    description:
      "Keep course learning, exam practice, and logistics separate enough that one delay does not stop all progress.",
    icon: "navigation",
  },
] satisfies CandidateItem[];

export const prepRoute = [
  {
    title: "Orient",
    description:
      "Understand the Edexcel 1RU0 papers, Foundation/Higher choice, deadlines, and what the student already knows.",
    icon: "exam",
  },
  {
    title: "Build",
    description:
      "Work through vocabulary, grammar, lessons, and theme content so the student has language to use.",
    icon: "brain",
  },
  {
    title: "Practise",
    description:
      "Move into listening, speaking, reading, writing, translation, and question-set practice in a controlled way.",
    icon: "questionSet",
  },
  {
    title: "Rehearse",
    description:
      "Use mock-style tasks and mistake review without confusing platform-created practice with official papers.",
    icon: "mockExam",
  },
] satisfies CandidateItem[];

export const centreChecklist = [
  {
    title: "Candidate acceptance",
    question: "Do you accept private candidates for Pearson Edexcel GCSE Russian 1RU0?",
    whyItMatters:
      "Not every centre offers every language qualification to private candidates.",
    icon: "userCheck",
  },
  {
    title: "Speaking paper",
    question: "How do you arrange, conduct, record, and submit the speaking assessment?",
    whyItMatters:
      "Speaking can be harder to arrange than written papers and usually needs earlier planning.",
    icon: "speaking",
  },
  {
    title: "Tier and deadlines",
    question:
      "When must Foundation or Higher be confirmed, and what are the entry deadlines?",
    whyItMatters:
      "Tier choice affects all papers, and late entries can create avoidable cost or availability problems.",
    icon: "calendar",
  },
  {
    title: "Fees and requirements",
    question:
      "What fees, ID requirements, access arrangements, and centre policies apply?",
    whyItMatters:
      "Families need the full administrative picture before relying on a revision timeline.",
    icon: "pricing",
  },
] satisfies ChecklistItem[];

export const candidateTypes = [
  {
    title: "Heritage speakers",
    description:
      "Often need formal writing, translation accuracy, grammar control, and exam technique, even when speaking feels strong.",
    icon: "speaking",
  },
  {
    title: "Independent learners",
    description:
      "Usually need a steady course route so vocabulary, grammar, and paper practice do not become scattered.",
    icon: "student",
  },
  {
    title: "Families arranging entry",
    description:
      "Need clear separation between the learning plan and exam-centre administration.",
    icon: "users",
  },
] satisfies CandidateItem[];

export const courseFit = [
  {
    title: "Course structure",
    description:
      "A route through foundations, GCSE themes, paper skills, revision, and mock preparation.",
    icon: "courses",
  },
  {
    title: "Optional live support",
    description:
      "Helpful when the student needs speaking practice, writing feedback, grammar help, or accountability.",
    icon: "teacher",
  },
  {
    title: "Exam-centre boundary",
    description:
      "The platform supports preparation; the family still confirms entry and arrangements with a centre.",
    icon: "info",
  },
] satisfies CandidateItem[];

export const relatedLinks = [
  {
    title: "GCSE Russian for parents",
    description: "Understand how parents can support without taking over.",
    href: "/gcse-russian-for-parents",
    icon: "users" as const,
  },
  {
    title: "GCSE Russian exam guide",
    description: "Review the four papers and tier decisions before planning.",
    href: "/gcse-russian-exam-guide",
    icon: "exam" as const,
  },
  {
    title: "Online GCSE Russian lessons",
    description: "Add teacher guidance for speaking, writing, and accountability.",
    href: "/online-gcse-russian-lessons",
    icon: "teacher" as const,
  },
  {
    title: "GCSE Russian course",
    description: "See the self-study course route for independent preparation.",
    href: "/gcse-russian-course",
    icon: "courses" as const,
  },
] satisfies Array<{
  title: string;
  description: string;
  href: string;
  icon: AppIconKey;
}>;

export const faqs: FaqItem[] = [
  {
    question: "Can this platform enter a student for GCSE Russian?",
    answer:
      "No. The platform supports preparation. Families must arrange exam entry, fees, deadlines, and speaking arrangements directly with an exam centre.",
  },
  {
    question: "When should private candidates look for a centre?",
    answer:
      "As early as possible. Centre availability, fees, and speaking arrangements can vary, and the speaking assessment is planned before the written-paper period.",
  },
  {
    question: "Is GCSE Russian suitable for heritage speakers?",
    answer:
      "Often, yes, but heritage speakers still need formal exam preparation, especially for writing accuracy, translation, grammar, and paper technique.",
  },
  {
    question: "What support is most useful?",
    answer:
      "A structured course helps with coverage and routine. Live support is especially useful for speaking, writing feedback, grammar explanation, and accountability.",
  },
];

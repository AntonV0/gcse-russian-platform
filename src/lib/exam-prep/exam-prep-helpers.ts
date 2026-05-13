import type { AppIconKey } from "@/lib/shared/icons";
import type {
  DbMockExamResponse,
  MockExamAttemptStatus,
  MockExamPaperName,
} from "@/lib/mock-exams/types";
import type { PastPaperResourceType } from "@/lib/past-papers/past-paper-helpers-db";

export type ExamPaperPathway = {
  paperNumber: 1 | 2 | 3 | 4;
  paperName: MockExamPaperName;
  skill: "Listening" | "Speaking" | "Reading" | "Writing";
  icon: AppIconKey;
  guideHref: string;
  mockExamHref: string;
  pastPapersHref: string;
  practiceCue: string;
  nextStep: string;
};

export const examPaperPathways: ExamPaperPathway[] = [
  {
    paperNumber: 1,
    paperName: "Paper 1 Listening",
    skill: "Listening",
    icon: "listening",
    guideHref: "/gcse-russian-listening-exam",
    mockExamHref: "/mock-exams?paperNumber=1",
    pastPapersHref: "/past-papers?paperNumber=1",
    practiceCue: "Practise audio, transcripts, and mark schemes together.",
    nextStep: "Use one listening paper, then review every missed audio clue.",
  },
  {
    paperNumber: 2,
    paperName: "Paper 2 Speaking",
    skill: "Speaking",
    icon: "speaking",
    guideHref: "/gcse-russian-speaking-exam",
    mockExamHref: "/mock-exams?paperNumber=2",
    pastPapersHref: "/past-papers?paperNumber=2",
    practiceCue: "Rehearse prompts aloud before judging the answer.",
    nextStep: "Record one role play or photo-card response and review clarity.",
  },
  {
    paperNumber: 3,
    paperName: "Paper 3 Reading",
    skill: "Reading",
    icon: "text",
    guideHref: "/gcse-russian-reading-exam",
    mockExamHref: "/mock-exams?paperNumber=3",
    pastPapersHref: "/past-papers?paperNumber=3",
    practiceCue: "Match question wording, grammar clues, and vocabulary evidence.",
    nextStep: "Complete a reading section, then translate the hard sentences again.",
  },
  {
    paperNumber: 4,
    paperName: "Paper 4 Writing",
    skill: "Writing",
    icon: "write",
    guideHref: "/gcse-russian-writing-exam",
    mockExamHref: "/mock-exams?paperNumber=4",
    pastPapersHref: "/past-papers?paperNumber=4",
    practiceCue: "Plan task coverage before adding range and polish.",
    nextStep: "Write one timed answer, then check tense, opinion, and endings.",
  },
];

export function getExamPaperPathway(paperNumber: number | null | undefined) {
  return examPaperPathways.find((pathway) => pathway.paperNumber === paperNumber);
}

export function getResourcePracticeHint(resourceType: PastPaperResourceType) {
  switch (resourceType) {
    case "question_paper":
      return "Start here for timed exam practice.";
    case "mark_scheme":
      return "Use after attempting the paper, not before.";
    case "transcript":
      return "Review after listening practice to find missed clues.";
    case "audio":
      return "Use with Paper 1 before checking the transcript.";
    case "examiner_report":
      return "Read after marking to spot common mistakes.";
    case "sample_assessment_material":
      return "Use for format familiarisation before full past papers.";
    case "other":
    default:
      return "Use alongside the matching paper resources.";
  }
}

export function getResourceActionLabel(resourceType: PastPaperResourceType) {
  switch (resourceType) {
    case "question_paper":
      return "Open question paper";
    case "mark_scheme":
      return "Open mark scheme";
    case "transcript":
      return "Open transcript";
    case "audio":
      return "Open audio";
    case "examiner_report":
      return "Open examiner report";
    case "sample_assessment_material":
      return "Open sample material";
    case "other":
    default:
      return "Open Pearson resource";
  }
}

export function getResourceTypeIcon(resourceType: PastPaperResourceType): AppIconKey {
  switch (resourceType) {
    case "audio":
      return "audio";
    case "transcript":
      return "text";
    case "mark_scheme":
      return "marked";
    case "examiner_report":
      return "note";
    case "sample_assessment_material":
      return "exam";
    case "question_paper":
      return "pastPapers";
    case "other":
    default:
      return "file";
  }
}

type MockAttemptStateInput = {
  status?: MockExamAttemptStatus | null;
  awardedMarks?: number | null;
  totalMarks?: number | null;
};

export function getMockExamAttemptState(input?: MockAttemptStateInput | null) {
  if (!input?.status) {
    return {
      label: "Not started",
      tone: "muted" as const,
      icon: "pending" as const,
      actionLabel: "Preview exam",
      description: "Open the paper structure, check timing, then start when ready.",
    };
  }

  switch (input.status) {
    case "draft":
      return {
        label: "Draft in progress",
        tone: "warning" as const,
        icon: "draft" as const,
        actionLabel: "Continue draft",
        description: "Finish unanswered questions, save again, then submit for marking.",
      };

    case "submitted":
      return {
        label: "Submitted",
        tone: "info" as const,
        icon: "submitted" as const,
        actionLabel: "Review submission",
        description: "Your work is in review. Objective marks may appear before teacher feedback.",
      };

    case "marked":
      return {
        label:
          input.awardedMarks !== null &&
          input.awardedMarks !== undefined &&
          input.totalMarks
            ? `Marked: ${input.awardedMarks} / ${input.totalMarks}`
            : "Marked",
        tone: "success" as const,
        icon: "marked" as const,
        actionLabel: "Review marks",
        description: "Read the feedback, then choose one skill to practise next.",
      };

    case "abandoned":
      return {
        label: "Abandoned",
        tone: "danger" as const,
        icon: "warning" as const,
        actionLabel: "Open attempt",
        description: "Use this as a record, then start a fresh attempt when ready.",
      };

    default:
      return {
        label: "Not started",
        tone: "muted" as const,
        icon: "pending" as const,
        actionLabel: "Preview exam",
        description: "Open the paper structure, check timing, then start when ready.",
      };
  }
}

export function getAttemptReviewCue({
  status,
  savedResponseCount,
  questionCount,
  markedResponseCount,
}: {
  status: MockExamAttemptStatus;
  savedResponseCount: number;
  questionCount: number;
  markedResponseCount: number;
}) {
  const unansweredCount = Math.max(questionCount - savedResponseCount, 0);

  if (status === "draft") {
    if (questionCount === 0) return "No questions are available yet.";
    if (unansweredCount === 0) return "All questions have a saved response.";
    return `${unansweredCount} question${unansweredCount === 1 ? "" : "s"} still need${unansweredCount === 1 ? "s" : ""} attention.`;
  }

  if (status === "marked") {
    return "Use the feedback to choose one focused follow-up practice task.";
  }

  if (markedResponseCount > 0) {
    return `${markedResponseCount} of ${questionCount} question${questionCount === 1 ? "" : "s"} marked so far.`;
  }

  return "Submitted for review. Longer answers may need teacher marking before the final result is complete.";
}

function hasPayloadAnswerEvidence(payload: Record<string, unknown>) {
  return Object.entries(payload).some(([key, value]) => {
    if (key === "planningNotes" || key === "prepNotes" || key === "responseMode") {
      return false;
    }

    if (typeof value === "string") return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === "object") return Object.keys(value).length > 0;

    return value !== null && value !== undefined;
  });
}

export function hasMockExamAnswerEvidence(response?: DbMockExamResponse) {
  if (!response) return false;

  if (hasPayloadAnswerEvidence(response.response_payload)) return true;

  const responseText = response.response_text?.trim();
  if (!responseText) return false;

  const planningNotes =
    typeof response.response_payload.planningNotes === "string"
      ? response.response_payload.planningNotes.trim()
      : "";
  const prepNotes =
    typeof response.response_payload.prepNotes === "string"
      ? response.response_payload.prepNotes.trim()
      : "";

  return responseText !== planningNotes && responseText !== prepNotes;
}

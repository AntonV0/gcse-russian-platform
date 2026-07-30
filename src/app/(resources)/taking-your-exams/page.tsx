import type { Metadata } from "next";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import FeedbackBanner from "@/components/ui/feedback-banner";
import LearningSheet, {
  LearningSheetHeader,
  LearningSheetSection,
} from "@/components/ui/learning-sheet";
import SectionCard from "@/components/ui/section-card";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import { buildPublicMetadata } from "@/lib/seo/site";
import type { AppIconKey } from "@/lib/shared/icons";

export const metadata: Metadata = buildPublicMetadata({
  title: "Taking Your GCSE Russian Exams",
  description:
    "A practical guide to registering for GCSE Russian as a private candidate, arranging the speaking exam, and preparing with Volna School support.",
});

const examSetupChecklist: Array<{
  title: string;
  description: string;
  ask: string;
  icon: AppIconKey;
}> = [
  {
    title: "Find an exam centre",
    description:
      "Contact schools, colleges, or private-candidate centres and ask whether they accept Pearson Edexcel GCSE Russian entries.",
    ask: "Do you accept private candidates for Pearson Edexcel GCSE Russian 1RU0?",
    icon: "search",
  },
  {
    title: "Confirm the full entry",
    description:
      "GCSE Russian is not one paper. The centre must be able to enter you for listening, speaking, reading, and writing at the right tier.",
    ask: "Can you enter me for all four GCSE Russian papers at Foundation or Higher?",
    icon: "exam",
  },
  {
    title: "Arrange speaking early",
    description:
      "Speaking is the part most likely to need extra planning because the centre needs someone suitable to conduct the Russian assessment.",
    ask: "How will the speaking exam be arranged, and who conducts it?",
    icon: "speaking",
  },
  {
    title: "Save the timetable",
    description:
      "Use the official exam calendar as a planning baseline, but rely on your centre for exact rooms, start times, and instructions.",
    ask: "When will I receive my personal timetable and candidate instructions?",
    icon: "calendar",
  },
];

const paperOverview = [
  {
    title: "Paper 1",
    value: "Listening",
    description: "Audio comprehension, answers in English or non-verbal formats.",
    icon: "listening" as const,
  },
  {
    title: "Paper 2",
    value: "Speaking",
    description: "Centre-arranged appointment with preparation time and live tasks.",
    icon: "speaking" as const,
  },
  {
    title: "Paper 3",
    value: "Reading",
    description: "Text comprehension and translation into English.",
    icon: "text" as const,
  },
  {
    title: "Paper 4",
    value: "Writing",
    description: "Written responses and translation into Russian.",
    icon: "write" as const,
  },
];

const speakingQuestions = [
  "Can the centre provide the speaking examiner, or do I need to help source one?",
  "Which date window do you expect to use for speaking appointments?",
  "Will the same centre handle recording, paperwork, and secure submission?",
  "What happens if access arrangements or timetable clashes are needed?",
];

const preparationRoutes: Array<{
  title: string;
  description: string;
  href: string;
  label: string;
  icon: AppIconKey;
}> = [
  {
    title: "Check the exam calendar",
    description:
      "Keep written paper dates, contingency day, and results day in one place.",
    href: "/exam-calendar",
    label: "Exam calendar",
    icon: "calendar",
  },
  {
    title: "Practise official papers",
    description:
      "Use Pearson links for paper format, timing, mark schemes, and audio resources.",
    href: "/past-papers",
    label: "Past papers",
    icon: "pastPapers",
  },
  {
    title: "Rehearse speaking",
    description:
      "Role play, picture-based questions, and conversation need spoken practice.",
    href: "/gcse-russian-speaking-exam",
    label: "Speaking guide",
    icon: "speaking",
  },
  {
    title: "Add live support",
    description: "Volna School can help when you need teacher-led exam preparation.",
    href: "/online-classes",
    label: "Volna support",
    icon: "school",
  },
];

export default function TakingYourExamsPage() {
  return (
    <main>
      <LearningSheet>
      <LearningSheetHeader
        eyebrow="Private candidate guide"
        title="Taking your GCSE Russian exams"
        description="Use this as a practical planning page before you rely on any exam route. The centre you enter with is always the final source for availability, fees, rooms, exact start times, speaking arrangements, and candidate instructions."
        badges={
          <>
            <Badge tone="info" icon="exam">
              Pearson Edexcel 1RU0
            </Badge>
            <Badge tone="muted" icon="student">
              Private candidates
            </Badge>
            <Badge tone="warning" icon="warning">
              Centre confirmation needed
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/exam-calendar" variant="primary" icon="calendar">
              Exam calendar
            </Button>
            <Button href="/past-papers" variant="secondary" icon="pastPapers">
              Past papers
            </Button>
            <Button href="/online-classes" variant="secondary" icon="school">
              Volna support
            </Button>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {paperOverview.map((paper) => (
            <SummaryStatCard
              key={paper.title}
              title={paper.title}
              value={paper.value}
              description={paper.description}
              icon={paper.icon}
              compact
            />
          ))}
        </div>
      </LearningSheetHeader>

      <LearningSheetSection muted>
      <FeedbackBanner
        tone="warning"
        title="Do not leave the speaking exam until last"
        description="Most private-candidate problems happen around speaking: examiner availability, appointment timing, recording, and centre paperwork. Ask about it before you commit to a centre."
      />
      </LearningSheetSection>

      <LearningSheetSection>
        <div className="mb-4">
          <h2 className="app-heading-section">Private candidate decision flow</h2>
          <p className="mt-2 max-w-2xl app-text-body-muted">
            Work through these checks in order before building your revision plan around
            a centre.
          </p>
        </div>
        <div className="grid gap-3">
          {examSetupChecklist.map((step, index) => (
            <div
              key={step.title}
              className="rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] p-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--background-muted)] text-[var(--accent-ink)]">
                    <AppIcon icon={step.icon} size={18} />
                  </span>
                  <div>
                    <Badge tone="muted">Step {index + 1}</Badge>
                    <h2 className="mt-2 app-heading-card">{step.title}</h2>
                    <p className="mt-1 app-text-body-muted">{step.description}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted-bg)] p-3 lg:max-w-sm">
                  <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
                    Ask the centre
                  </div>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                    {step.ask}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </LearningSheetSection>

      <LearningSheetSection>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
        <SectionCard
          title="Speaking exam planning"
          description="Speaking is a live assessment, so your centre must be confident about the practical details."
          tone="brand"
        >
          <div className="space-y-4">
            <p className="app-text-body-muted">
              GCSE Russian speaking is not simply another written paper. The centre needs
              a suitable person to conduct the assessment in Russian and must follow the
              exam board process for timing, recording, paperwork, and submission.
            </p>
            <div className="grid gap-2">
              {speakingQuestions.map((question) => (
                <div
                  key={question}
                  className="flex items-start gap-2 rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-2 text-sm"
                >
                  <AppIcon
                    icon="help"
                    size={15}
                    className="mt-0.5 shrink-0 text-[var(--accent-ink)]"
                  />
                  <span>{question}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <DashboardCard title="When Volna support may help">
          <div className="space-y-4">
            <p>
              Volna School is useful when a student needs guided speaking practice,
              teacher correction, exam-style rehearsal, or a clearer preparation routine.
            </p>
            <div className="grid gap-2">
              {[
                "Private candidate planning",
                "Speaking exam preparation",
                "Short intensive speaking support",
                "Private tuition with a Russian teacher",
                "Exam-style role play and conversation rehearsal",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl bg-[var(--background-muted)] px-3 py-2 text-sm text-[var(--text-primary)]"
                >
                  {item}
                </div>
              ))}
            </div>
            <Button href="/online-classes" variant="primary" icon="school">
              Explore Volna support
            </Button>
          </div>
        </DashboardCard>
        </div>
      </LearningSheetSection>

      <LearningSheetSection>
        <div className="mb-4">
          <h2 className="app-heading-section">Build the revision plan around the entry</h2>
          <p className="mt-2 max-w-2xl app-text-body-muted">
            Once the centre route is realistic, use the platform resources to prepare for
            each part of the exam.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {preparationRoutes.map((route) => (
            <DashboardCard key={route.title} className="h-full">
              <div className="space-y-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--background-muted)] text-[var(--accent-ink)]">
                  <AppIcon icon={route.icon} size={19} />
                </span>
                <div>
                  <h3 className="app-heading-card">{route.title}</h3>
                  <p className="mt-2 app-text-body-muted">{route.description}</p>
                </div>
                <Button href={route.href} variant="secondary" size="sm" icon={route.icon}>
                  {route.label}
                </Button>
              </div>
            </DashboardCard>
          ))}
        </div>
      </LearningSheetSection>

      <LearningSheetSection muted>
      <DashboardCard title="Centre confirmation checklist" headingLevel={2}>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            "Candidate number, centre number, and entry confirmation received.",
            "Tier decision confirmed for every relevant paper.",
            "Speaking appointment, preparation time, and arrival instructions confirmed.",
            "Written paper dates, rooms, start times, and equipment rules saved.",
            "Fees, deadlines, access arrangements, and contingency instructions understood.",
            "Contact details saved for urgent centre questions.",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 rounded-xl border p-3">
              <AppIcon
                icon="confirm"
                size={15}
                className="mt-0.5 shrink-0 text-[var(--accent-ink)]"
              />
              <span className="text-sm text-[var(--text-secondary)]">{item}</span>
            </div>
          ))}
        </div>
      </DashboardCard>
      </LearningSheetSection>
      </LearningSheet>
    </main>
  );
}

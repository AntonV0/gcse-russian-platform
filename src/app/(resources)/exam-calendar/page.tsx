import type { Metadata } from "next";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import LearningSheet, {
  LearningSheetHeader,
  LearningSheetSection,
} from "@/components/ui/learning-sheet";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";
import type { AppIconKey } from "@/lib/shared/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Exam Calendar",
  description:
    "Key Pearson Edexcel GCSE Russian 1RU0 exam dates, paper durations, contingency day, results day, and revision links.",
  path: "/exam-calendar",
  ogTitle: "GCSE Russian Exam Calendar",
  ogDescription:
    "Plan around the 2026 Pearson Edexcel GCSE Russian written papers, contingency day, results day, and revision priorities.",
  ogImagePath: getOgImagePath("exam-guide"),
});

type CalendarEventTone = "info" | "success" | "warning" | "muted";

type CalendarEvent = {
  id: string;
  title: string;
  date: string | null;
  displayDate: string;
  session: string;
  description: string;
  icon: AppIconKey;
  tone: CalendarEventTone;
  papers: string[];
  actionHref?: string;
  actionLabel?: string;
  sourceLabel?: string;
  sourceHref?: string;
};

const pearsonTimetableHref =
  "https://qualifications.pearson.com/content/dam/pdf/Support/Examination-timetables-for-UK-Edexcel-GCSE/gcse-summer-2026-final.pdf";
const pearsonTimetableHubHref =
  "https://qualifications.pearson.com/en/support/support-topics/exams/exam-timetables.html";
const pearsonResultsHref =
  "https://qualifications.pearson.com/en/support/support-topics/results-certification/key-dates-for-results.html";
const govExamGuidanceHref =
  "https://www.gov.uk/government/publications/ofqual-student-guide-to-exams-and-assessments-in-2026/what-you-need-to-know-before-your-exams";

const calendarEvents: CalendarEvent[] = [
  {
    id: "exam-window",
    title: "Summer GCSE exam period opens",
    date: "2026-05-07",
    displayDate: "Thursday 7 May 2026",
    session: "Exam period",
    description:
      "The GCSE, AS, and A level summer exam period begins. Your personal timetable from school or centre still controls where and when you attend.",
    icon: "calendar",
    tone: "muted",
    papers: [
      "Keep your full centre timetable close",
      "Check room, seat, and access arrangements",
    ],
    sourceLabel: "GOV.UK exam guidance",
    sourceHref: govExamGuidanceHref,
  },
  {
    id: "listening-reading",
    title: "Russian Listening and Reading",
    date: "2026-06-02",
    displayDate: "Tuesday 2 June 2026",
    session: "Afternoon",
    description:
      "Pearson lists Paper 1 Listening and Paper 3 Reading in the same afternoon session for both Foundation and Higher tiers.",
    icon: "listening",
    tone: "info",
    papers: [
      "1RU0 1F Listening Foundation - 35 min",
      "1RU0 1H Listening Higher - 45 min",
      "1RU0 3F Reading Foundation - 50 min",
      "1RU0 3H Reading Higher - 1 hr 05 min",
    ],
    actionHref: "/past-papers",
    actionLabel: "Practise papers",
    sourceLabel: "Pearson final timetable",
    sourceHref: pearsonTimetableHref,
  },
  {
    id: "writing",
    title: "Russian Writing",
    date: "2026-06-10",
    displayDate: "Wednesday 10 June 2026",
    session: "Afternoon",
    description:
      "Pearson lists Paper 4 Writing in the afternoon session. Higher has a slightly longer duration than Foundation.",
    icon: "write",
    tone: "warning",
    papers: [
      "1RU0 4F Writing Foundation - 1 hr 20 min",
      "1RU0 4H Writing Higher - 1 hr 25 min",
    ],
    actionHref: "/gcse-russian-writing-exam",
    actionLabel: "Writing guide",
    sourceLabel: "Pearson final timetable",
    sourceHref: pearsonTimetableHref,
  },
  {
    id: "speaking",
    title: "Russian Speaking",
    date: null,
    displayDate: "Confirmed by your school or exam centre",
    session: "Centre-arranged",
    description:
      "Paper 2 Speaking is internally conducted and externally assessed. Your school or private-candidate centre confirms the exact appointment.",
    icon: "speaking",
    tone: "success",
    papers: [
      "Foundation speaking - 7 to 9 min plus 12 min preparation",
      "Higher speaking - 10 to 12 min plus 12 min preparation",
      "Tasks: role play, picture-based discussion, conversation",
    ],
    actionHref: "/gcse-russian-speaking-exam",
    actionLabel: "Speaking guide",
  },
  {
    id: "contingency",
    title: "Final contingency day",
    date: "2026-06-24",
    displayDate: "Wednesday 24 June 2026",
    session: "All day",
    description:
      "Students must remain available in case a national disruption forces a paper to move. This is not for individually missed exams.",
    icon: "warning",
    tone: "warning",
    papers: [
      "Keep the whole day free",
      "Follow school or centre instructions if invoked",
    ],
    sourceLabel: "GOV.UK exam guidance",
    sourceHref: govExamGuidanceHref,
  },
  {
    id: "results",
    title: "GCSE results day",
    date: "2026-08-20",
    displayDate: "Thursday 20 August 2026",
    session: "Student release",
    description:
      "Pearson lists GCSE results released to centres on 19 August 2026 and to students on 20 August 2026.",
    icon: "completed",
    tone: "success",
    papers: ["Confirm collection or online-release details with your school or centre"],
    sourceLabel: "Pearson results dates",
    sourceHref: pearsonResultsHref,
  },
];

const revisionFocus = [
  {
    title: "Before Listening and Reading",
    description:
      "Use past papers for timing, then revise vocabulary sets and grammar that repeatedly appear in comprehension tasks.",
    href: "/past-papers",
    label: "Open past papers",
    icon: "pastPapers",
  },
  {
    title: "Before Writing",
    description:
      "Practise reusable opinions, tense control, topic-specific sentences, and short translations into Russian.",
    href: "/gcse-russian-writing-exam",
    label: "Writing guide",
    icon: "write",
  },
  {
    title: "Before Speaking",
    description:
      "Rehearse role-play questions, picture descriptions, and conversation answers aloud, not only on paper.",
    href: "/gcse-russian-speaking-exam",
    label: "Speaking guide",
    icon: "speaking",
  },
] satisfies Array<{
  title: string;
  description: string;
  href: string;
  label: string;
  icon: AppIconKey;
}>;

function getDateAtNoonUtc(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return Date.UTC(year, month - 1, day, 12);
}

function getDaysUntil(value: string | null) {
  if (!value) return null;

  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12);
  const target = getDateAtNoonUtc(value);

  return Math.round((target - today) / 86_400_000);
}

function getRelativeDateLabel(value: string | null) {
  const days = getDaysUntil(value);

  if (days === null) return "Centre date";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days > 1) return `${days} days`;
  if (days === -1) return "Yesterday";
  return "Passed";
}

function getEventBadgeTone(event: CalendarEvent) {
  const days = getDaysUntil(event.date);

  if (days === null) return "muted" as const;
  if (days < 0) return "muted" as const;
  if (days <= 14) return "warning" as const;
  return event.tone === "success" ? "success" : "info";
}

function getNextDatedEvent() {
  return (
    calendarEvents
      .filter((event) => event.date && (getDaysUntil(event.date) ?? -1) >= 0)
      .sort((a, b) => getDateAtNoonUtc(a.date!) - getDateAtNoonUtc(b.date!))[0] ?? null
  );
}

function CalendarEventCard({ event }: { event: CalendarEvent }) {
  return (
    <DashboardCard className="h-full">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge tone={getEventBadgeTone(event)} icon={event.icon}>
            {getRelativeDateLabel(event.date)}
          </Badge>
          <Badge tone="muted" icon="calendar">
            {event.session}
          </Badge>
        </div>

        <div>
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--background-muted)] text-[var(--accent-ink)]">
              <AppIcon icon={event.icon} size={19} />
            </span>
            <div className="min-w-0">
              <h2 className="app-heading-card">{event.title}</h2>
              <p className="mt-1 font-semibold text-[var(--text-primary)]">
                {event.displayDate}
              </p>
            </div>
          </div>

          <p className="mt-3 app-text-body-muted">{event.description}</p>
        </div>

        <ul className="grid gap-2">
          {event.papers.map((paper) => (
            <li key={paper} className="flex items-start gap-2 text-sm">
              <AppIcon
                icon="confirm"
                size={14}
                className="mt-0.5 shrink-0 text-[var(--accent-ink)]"
              />
              <span>{paper}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2 pt-1">
          {event.actionHref && event.actionLabel ? (
            <Button
              href={event.actionHref}
              variant="secondary"
              size="sm"
              icon={event.icon}
            >
              {event.actionLabel}
            </Button>
          ) : null}

          {event.sourceHref && event.sourceLabel ? (
            <Button
              href={event.sourceHref}
              variant="secondary"
              size="sm"
              icon="externalLink"
            >
              {event.sourceLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </DashboardCard>
  );
}

export default function ExamCalendarPage() {
  const nextEvent = getNextDatedEvent();
  const russianWrittenEvents = calendarEvents.filter((event) =>
    ["listening-reading", "writing"].includes(event.id)
  );

  return (
    <main>
      <LearningSheet>
      <LearningSheetHeader
        eyebrow="Exam calendar"
        title="GCSE Russian dates and deadlines"
        description="Keep the official Pearson Edexcel 1RU0 written-paper dates, centre-arranged speaking exam, contingency day, and results day in one place."
        badges={
          <>
            <Badge tone="info" icon="exam">
              Pearson Edexcel 1RU0
            </Badge>
            <Badge tone="muted" icon="calendar">
              Summer 2026
            </Badge>
            <Badge tone="warning" icon="warning">
              Confirm with your centre
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/mock-exams" variant="primary" icon="mockExam">
              Mock exams
            </Button>
            <Button href="/past-papers" variant="secondary" icon="pastPapers">
              Past papers
            </Button>
          </>
        }
      >
        <p className="max-w-3xl app-text-body-muted">
          Exam-board timetables are the planning baseline. Your school or
          private-candidate centre timetable is the final source for rooms, exact start
          time, speaking appointment, and access arrangements.
        </p>
      </LearningSheetHeader>

      <LearningSheetSection>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryStatCard
          title="Next dated event"
          value={nextEvent ? getRelativeDateLabel(nextEvent.date) : "-"}
          description={nextEvent?.title ?? "No upcoming dated events"}
          icon={nextEvent?.icon ?? "calendar"}
          tone="brand"
          compact
        />
        <SummaryStatCard
          title="Listening and Reading"
          value="2 Jun"
          description="Afternoon session"
          icon="listening"
          tone="info"
          compact
        />
        <SummaryStatCard
          title="Writing"
          value="10 Jun"
          description="Afternoon session"
          icon="write"
          tone="warning"
          compact
        />
        <SummaryStatCard
          title="Results"
          value="20 Aug"
          description="released to students"
          icon="completed"
          tone="success"
          compact
        />
        </div>
      </LearningSheetSection>

      <LearningSheetSection>
        <div className="mb-4">
          <h2 className="app-heading-section">Russian written papers</h2>
          <p className="mt-2 max-w-2xl app-text-body-muted">
            These dates come from Pearson&apos;s GCSE Summer 2026 final timetable.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {russianWrittenEvents.map((event) => (
            <CalendarEventCard key={event.id} event={event} />
          ))}
        </div>
      </LearningSheetSection>

      <LearningSheetSection>
        <div className="mb-4">
          <h2 className="app-heading-section">Other important dates</h2>
          <p className="mt-2 max-w-2xl app-text-body-muted">
            Add these to planning conversations with parents, school, or private-candidate
            centres.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {calendarEvents
            .filter((event) => !["listening-reading", "writing"].includes(event.id))
            .map((event) => (
              <CalendarEventCard key={event.id} event={event} />
            ))}
        </div>
      </LearningSheetSection>

      <LearningSheetSection>
        <div className="mb-4">
          <h2 className="app-heading-section">Revision focus</h2>
          <p className="mt-2 max-w-2xl app-text-body-muted">
            Use the calendar as a planning surface: dates are useful only when they shape
            the next practice session.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {revisionFocus.map((item) => (
            <DashboardCard key={item.title} className="h-full">
              <div className="space-y-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--background-muted)] text-[var(--accent-ink)]">
                  <AppIcon icon={item.icon} size={19} />
                </span>
                <div>
                  <h3 className="app-heading-card">{item.title}</h3>
                  <p className="mt-2 app-text-body-muted">{item.description}</p>
                </div>
                <Button href={item.href} variant="secondary" size="sm" icon={item.icon}>
                  {item.label}
                </Button>
              </div>
            </DashboardCard>
          ))}
        </div>
      </LearningSheetSection>

      <LearningSheetSection muted>
      <DashboardCard title="Official sources" headingLevel={2}>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              href: pearsonTimetableHubHref,
              label: "Pearson exam timetables",
              description: "Official timetable hub for Edexcel GCSE files.",
            },
            {
              href: pearsonTimetableHref,
              label: "GCSE Summer 2026 final PDF",
              description: "Direct PDF containing Russian 1RU0 dates and durations.",
            },
            {
              href: pearsonResultsHref,
              label: "Pearson results dates",
              description:
                "Official GCSE results release dates for centres and students.",
            },
          ].map((source) => (
            <a
              key={source.href}
              href={source.href}
              className="app-tactile-row app-card-interaction-subtle rounded-xl border p-3 app-focus-ring"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[var(--background-muted)] text-[var(--accent-ink)]">
                  <AppIcon icon="externalLink" size={16} />
                </span>
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">
                    {source.label}
                  </div>
                  <p className="mt-1 app-text-caption">{source.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </DashboardCard>
      </LearningSheetSection>
      </LearningSheet>
    </main>
  );
}

import type { Metadata } from "next";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import FeedbackBanner from "@/components/ui/feedback-banner";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import VisualPlaceholder from "@/components/ui/visual-placeholder";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "Taking Your GCSE Russian Exams",
  description:
    "A practical guide to registering for GCSE Russian as a private candidate, arranging the speaking exam, and preparing with Volna School support.",
});

const readinessChecks = [
  {
    title: "Centre found",
    value: "1",
    description: "A school, college, or exam centre has said they accept private candidates.",
    icon: "school" as const,
    tone: "brand" as const,
  },
  {
    title: "Full entry confirmed",
    value: "2",
    description: "Listening, speaking, reading, writing, tier, fees, and deadlines are clear.",
    icon: "exam" as const,
    tone: "info" as const,
  },
  {
    title: "Speaking arranged",
    value: "3",
    description: "The centre has confirmed who conducts it, when it happens, and what you do.",
    icon: "speaking" as const,
    tone: "warning" as const,
  },
  {
    title: "Timetable saved",
    value: "4",
    description: "Written paper dates, centre start times, room details, and results day are stored.",
    icon: "calendar" as const,
    tone: "success" as const,
  },
];

const decisionFlow = [
  {
    title: "Find a centre",
    yes: "Ask whether they accept private candidates for Pearson Edexcel GCSE Russian 1RU0.",
    no: "Contact more centres early. Availability, fees, deadlines, and speaking arrangements vary by centre.",
  },
  {
    title: "Confirm the full entry",
    yes: "Check the qualification, tier, all papers, entry deadline, fee, candidate number, and any access arrangements.",
    no: "Do not assume a written-paper entry automatically covers the speaking component.",
  },
  {
    title: "Arrange speaking",
    yes: "Get the speaking window, appointment process, examiner details, recording plan, and preparation rules in writing.",
    no: "Escalate this before paying if the centre cannot explain how GCSE Russian speaking will be handled.",
  },
  {
    title: "Save the timetable",
    yes: "Use both the exam-board dates and the centre timetable, because centre start times and rooms are final.",
    no: "Add calendar reminders for written papers, speaking, contingency day, results, and any centre deadlines.",
  },
];

const speakingPrompts = [
  "Who will conduct the GCSE Russian speaking assessment, and are they approved or arranged by the centre?",
  "When will the speaking exam take place, and how will I receive the exact appointment time?",
  "What do I need to bring, and where should I arrive on the day?",
  "How will the assessment be recorded, stored, and submitted to the exam board?",
  "Are there centre deadlines, forms, ID checks, access arrangements, or extra speaking fees?",
  "What happens if the speaking appointment clashes with another exam or unavoidable commitment?",
];

const confirmationItems = [
  "Exam board and qualification code",
  "Foundation or Higher tier",
  "All four components: listening, speaking, reading, writing",
  "Entry fee, speaking fee, payment deadline, and refund policy",
  "Candidate number, centre number, and contact person",
  "Exact written-paper start times from the centre timetable",
];

const supportLinks = [
  {
    title: "Exam calendar",
    description: "Check written-paper dates, speaking window reminders, contingency day, and results day.",
    href: "/exam-calendar",
    label: "Open calendar",
    icon: "calendar" as const,
  },
  {
    title: "Past papers",
    description: "Use real papers and mark schemes to practise the format before the final exam window.",
    href: "/past-papers",
    label: "Use past papers",
    icon: "pastPapers" as const,
  },
  {
    title: "Speaking guide",
    description: "Prepare role play, picture-based tasks, conversation, pronunciation, and live response.",
    href: "/gcse-russian-speaking-exam",
    label: "Speaking guide",
    icon: "speaking" as const,
  },
  {
    title: "Volna support",
    description: "Add teacher support for speaking, writing, accountability, and private-candidate planning.",
    href: "/online-classes",
    label: "Volna support",
    icon: "school" as const,
  },
];

export default function TakingYourExamsPage() {
  return (
    <main className="space-y-8">
      <PageIntroPanel
        eyebrow="Private candidate guide"
        title="Taking your GCSE Russian exams"
        description="Use this as a practical planning page for exam entry, centre checks, speaking arrangements, written-paper dates, and support before GCSE Russian exam season."
        tone="student"
        badges={
          <>
            <Badge tone="info" icon="exam">
              Pearson Edexcel 1RU0
            </Badge>
            <Badge tone="muted" icon="school">
              Private candidates
            </Badge>
            <Badge tone="warning" icon="warning">
              Centre arrangements vary
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
        visual={
          <VisualPlaceholder
            category="mockExam"
            size="wide"
            ariaLabel="GCSE Russian exam planning"
          />
        }
      >
        <FeedbackBanner
          tone="warning"
          title="Your centre is the final source"
          description="The exam board timetable is the planning baseline, but your chosen centre controls entry deadlines, fees, speaking arrangements, rooms, exact start times, and local instructions."
        />
      </PageIntroPanel>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {readinessChecks.map((check) => (
          <SummaryStatCard
            key={check.title}
            title={check.title}
            value={check.value}
            description={check.description}
            icon={check.icon}
            tone={check.tone}
            compact
          />
        ))}
      </section>

      <section>
        <div className="mb-4">
          <h2 className="app-heading-section">Checklist and decision flow</h2>
          <p className="mt-2 max-w-3xl app-text-body-muted">
            Move through these in order. If any answer is unclear, pause and confirm it
            with the centre before assuming your exam plan is complete.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {decisionFlow.map((step, index) => (
            <DashboardCard key={step.title} title={`${index + 1}. ${step.title}`}>
              <div className="space-y-3">
                <div className="rounded-2xl bg-[var(--success-surface)] px-4 py-3 text-[var(--success-text)]">
                  <div className="font-semibold">If yes</div>
                  <p className="mt-1">{step.yes}</p>
                </div>
                <div className="rounded-2xl bg-[var(--warning-surface)] px-4 py-3 text-[var(--warning-text)]">
                  <div className="font-semibold">If not yet</div>
                  <p className="mt-1">{step.no}</p>
                </div>
              </div>
            </DashboardCard>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <DashboardCard title="Speaking exam: questions to ask your centre">
          <div className="space-y-4">
            <p>
              Speaking is the part private candidates should clarify earliest. It needs a
              suitable person, a centre process, an appointment, recording arrangements,
              and exam-board compliance.
            </p>

            <ul className="grid gap-2">
              {speakingPrompts.map((prompt) => (
                <li
                  key={prompt}
                  className="rounded-2xl bg-[var(--background-muted)] px-4 py-3 text-sm text-[var(--text-primary)]"
                >
                  {prompt}
                </li>
              ))}
            </ul>
          </div>
        </DashboardCard>

        <DashboardCard title="Get these confirmations in writing">
          <div className="space-y-4">
            <p>
              A useful confirmation email should make the whole entry visible, not just
              say that you are registered.
            </p>

            <ul className="grid gap-2">
              {confirmationItems.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-3 text-sm text-[var(--text-primary)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </DashboardCard>
      </section>

      <FeedbackBanner
        tone="danger"
        title="Do not rely on another student&apos;s centre plan"
        description="Two centres can handle GCSE Russian private candidates differently. One may offer speaking support, another may not. One may use different payment deadlines, ID rules, start times, or access-arrangement processes."
      />

      <section>
        <div className="mb-4">
          <h2 className="app-heading-section">Planning resources</h2>
          <p className="mt-2 max-w-2xl app-text-body-muted">
            Use these pages together: logistics first, then practice against the exam
            format, then targeted support where the student needs it.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {supportLinks.map((link) => (
            <DashboardCard key={link.title} title={link.title}>
              <div className="space-y-4">
                <p>{link.description}</p>
                <Button href={link.href} variant="secondary" size="sm" icon={link.icon}>
                  {link.label}
                </Button>
              </div>
            </DashboardCard>
          ))}
        </div>
      </section>
    </main>
  );
}

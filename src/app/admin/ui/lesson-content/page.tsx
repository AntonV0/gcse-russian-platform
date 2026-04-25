import { requireAdminAccess } from "@/lib/auth/admin-auth";
import UiLabFutureSection from "@/components/admin/ui-lab-future-section";
import UiLabPageNav from "@/components/admin/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import AppIcon from "@/components/ui/app-icon";
import AssessmentSurfaceCard from "@/components/ui/assessment-surface-card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";
import LessonSurfaceCard from "@/components/ui/lesson-surface-card";
import LockedContentCard from "@/components/ui/locked-content-card";
import PanelCard from "@/components/ui/panel-card";
import PracticeSurfaceCard from "@/components/ui/practice-surface-card";
import Surface from "@/components/ui/surface";

const pageNavItems = [
  { id: "lesson-surfaces", label: "Lesson surfaces" },
  { id: "content-blocks", label: "Content blocks" },
  { id: "practice-blocks", label: "Practice blocks" },
  { id: "progression", label: "Progression states" },
  { id: "future-components", label: "Future" },
];

function LessonContentBlock({
  label,
  title,
  children,
  tone = "default",
}: {
  label: string;
  title: string;
  children: React.ReactNode;
  tone?: "default" | "muted" | "brand";
}) {
  return (
    <Surface variant={tone} padding="md">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge tone="muted">{label}</Badge>
      </div>
      <div className="font-semibold text-[var(--text-primary)]">{title}</div>
      <div className="mt-3 text-sm leading-6 app-text-muted">{children}</div>
    </Surface>
  );
}

export default async function AdminUiLessonContentPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Lesson Content"
      description="Reference patterns for student-facing lesson surfaces, content blocks, practice wrappers, locked states, and progression guidance."
      currentPath="/admin/ui/lesson-content"
    >
      <UiLabPageNav items={pageNavItems} />

      <UiLabSection
        id="lesson-surfaces"
        title="Lesson surfaces"
        description="These shared components define the main student-facing learning and assessment entry points."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <LessonSurfaceCard
            title="School and daily routine"
            description="Learn school subjects, describe your timetable, and give opinions with because clauses."
            levelLabel="Higher"
            metaLabel="6 sections"
            primaryActionLabel="Continue lesson"
            secondaryActionLabel="Preview content"
          />

          <PracticeSurfaceCard
            title="Opinion phrases practice"
            description="Build accuracy with short exam-style sentence transformations and translation prompts."
            statusLabel="In progress"
            themeLabel="Theme 3"
            primaryActionLabel="Start practice"
            secondaryActionLabel="Review notes"
          />

          <AssessmentSurfaceCard
            title="Theme 3 checkpoint"
            description="A short assessment-style review covering school subjects, opinions, and routines."
            typeLabel="Checkpoint"
            metaLabel="10 questions"
            urgencyLabel="Untimed"
            primaryActionLabel="Start checkpoint"
            secondaryActionLabel="View guidance"
          />

          <LockedContentCard
            title="Higher grammar clinic"
            description="This lesson is available to Higher students and full-access learners."
            accessLabel="Higher tier"
            statusLabel="Locked"
            primaryActionLabel="Unlock full course"
            secondaryActionLabel="Compare access"
          />
        </div>
      </UiLabSection>

      <UiLabSection
        id="content-blocks"
        title="Content block patterns"
        description="Lesson blocks should be readable, recognisable, and calm in both English and Russian."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <LessonContentBlock label="Text" title="Giving opinions about school">
            Use <strong className="text-[var(--text-primary)]">мне нравится</strong> and{" "}
            <strong className="text-[var(--text-primary)]">я люблю</strong> to explain
            what subjects you enjoy. Add <strong>потому что</strong> to give a reason.
          </LessonContentBlock>

          <LessonContentBlock label="Vocabulary" title="Core words">
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                ["школа", "school"],
                ["предмет", "subject"],
                ["расписание", "timetable"],
                ["перемена", "break"],
              ].map(([ru, en]) => (
                <div
                  key={ru}
                  className="rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-2"
                >
                  <div className="font-semibold text-[var(--text-primary)]">{ru}</div>
                  <div className="text-sm app-text-muted">{en}</div>
                </div>
              ))}
            </div>
          </LessonContentBlock>

          <LessonContentBlock label="Callout" title="Common mistake" tone="muted">
            Do not translate “I am boring” when you mean “I am bored”. In Russian, keep
            the sentence tied to the subject or feeling you are describing.
          </LessonContentBlock>

          <LessonContentBlock label="Exam tip" title="Add a reason" tone="brand">
            A simple opinion becomes stronger when you add a reason: “I like history
            because it is interesting and useful.”
          </LessonContentBlock>

          <LessonContentBlock label="Image" title="Classroom prompt">
            <div className="flex items-center gap-4 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-elevated)] p-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl [background:var(--accent-gradient-soft)] text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-selected-border)]">
                <AppIcon icon="image" size={24} />
              </span>
              <p className="text-sm app-text-muted">
                Image blocks need caption, alt text, and clear placement in the lesson
                rhythm.
              </p>
            </div>
          </LessonContentBlock>

          <LessonContentBlock label="Audio" title="Listen and recognise">
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
              <Button variant="secondary" icon="audio">
                Play audio
              </Button>
              <Badge tone="muted">00:42</Badge>
              <Badge tone="info">Listening</Badge>
            </div>
          </LessonContentBlock>
        </div>
      </UiLabSection>

      <UiLabSection
        id="practice-blocks"
        title="Practice and question blocks"
        description="Practice states should clearly separate prompt, answer area, feedback, and next step."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <PanelCard
            title="Short-answer prompt"
            description="Translate the sentence into Russian."
            tone="student"
          >
            <div className="space-y-4">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4 text-sm text-[var(--text-primary)]">
                I like maths because it is useful.
              </div>
              <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-4 py-5 text-sm app-text-soft">
                Student answer area
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" icon="completed">
                  Check answer
                </Button>
                <Button variant="secondary" icon="preview">
                  Show hint
                </Button>
              </div>
            </div>
          </PanelCard>

          <PanelCard
            title="Feedback state"
            description="The answer has been checked and needs a correction."
            tone="muted"
          >
            <div className="space-y-4">
              <Badge tone="warning" icon="pending">
                Not quite
              </Badge>
              <Card>
                <CardBody className="p-4">
                  <div className="font-semibold text-[var(--text-primary)]">
                    Correct answer
                  </div>
                  <p className="mt-2 text-sm app-text-muted">
                    Мне нравится математика, потому что она полезная.
                  </p>
                </CardBody>
              </Card>
              <Button variant="soft" icon="refresh">
                Try another
              </Button>
            </div>
          </PanelCard>
        </div>
      </UiLabSection>

      <UiLabSection
        id="progression"
        title="Progression and locked states"
        description="Lesson pages need clear signals for current, completed, unavailable, and no-progress states."
      >
        <div className="grid gap-4 xl:grid-cols-4">
          <Card>
            <CardBody className="space-y-3 p-4">
              <Badge tone="success" icon="completed">
                Completed
              </Badge>
              <div className="font-semibold text-[var(--text-primary)]">
                Section 1 finished
              </div>
              <p className="text-sm app-text-muted">The learner can return anytime.</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-3 p-4">
              <Badge tone="info" icon="next">
                Current
              </Badge>
              <div className="font-semibold text-[var(--text-primary)]">
                Section 2 open
              </div>
              <p className="text-sm app-text-muted">This is the next recommended step.</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-3 p-4">
              <Badge tone="warning" icon="locked">
                Locked
              </Badge>
              <div className="font-semibold text-[var(--text-primary)]">
                Section 3 unavailable
              </div>
              <p className="text-sm app-text-muted">Visit the current section first.</p>
            </CardBody>
          </Card>

          <EmptyState
            icon="lessons"
            iconTone="brand"
            title="No progress yet"
            description="Open the first section to begin tracking lesson progress."
          />
        </div>
      </UiLabSection>

      <UiLabFutureSection
        items={[
          "LessonCallout for note, warning, exam tip, and success guidance.",
          "VocabularyPreviewCard for reusable bilingual word groups.",
          "AudioLessonBlock with transcript, duration, and playback states.",
          "LessonProgressStepper for section unlock and revisit states.",
          "QuestionBlockShell for prompt, answer area, controls, and feedback.",
          "MediaCaption pattern for images, audio, and future video content.",
        ]}
      />
    </UiLabShell>
  );
}

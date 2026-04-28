import { LessonContentBlock } from "@/components/admin/ui-lab/lesson-content/ui-lab-lesson-content-block";
import UiLabSection from "@/components/admin/ui-lab/shell/ui-lab-section";
import AppIcon from "@/components/ui/app-icon";
import AssessmentSurfaceCard from "@/components/ui/assessment-surface-card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import LessonSurfaceCard from "@/components/ui/lesson-surface-card";
import LockedContentCard from "@/components/ui/locked-content-card";
import PracticeSurfaceCard from "@/components/ui/practice-surface-card";

function DemoLessonSurfaces() {
  return (
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
  );
}

function DemoContentBlocks() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <LessonContentBlock label="Text" title="Giving opinions about school">
        Use <strong className="text-[var(--text-primary)]">Ð¼Ð½Ðµ Ð½Ñ€Ð°Ð²Ð¸Ñ‚ÑÑ</strong>{" "}
        and <strong className="text-[var(--text-primary)]">Ñ Ð»ÑŽÐ±Ð»ÑŽ</strong> to
        explain what subjects you enjoy. Add <strong>Ð¿Ð¾Ñ‚Ð¾Ð¼Ñƒ Ñ‡Ñ‚Ð¾</strong> to give
        a reason.
      </LessonContentBlock>

      <LessonContentBlock label="Vocabulary" title="Core words">
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["ÑˆÐºÐ¾Ð»Ð°", "school"],
            ["Ð¿Ñ€ÐµÐ´Ð¼ÐµÑ‚", "subject"],
            ["Ñ€Ð°ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ", "timetable"],
            ["Ð¿ÐµÑ€ÐµÐ¼ÐµÐ½Ð°", "break"],
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
        Do not translate â€œI am boringâ€ when you mean â€œI am boredâ€. In Russian, keep
        the sentence tied to the subject or feeling you are describing.
      </LessonContentBlock>

      <LessonContentBlock label="Exam tip" title="Add a reason" tone="brand">
        A simple opinion becomes stronger when you add a reason: â€œI like history because
        it is interesting and useful.â€
      </LessonContentBlock>

      <LessonContentBlock label="Image" title="Classroom prompt">
        <div className="flex items-center gap-4 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-elevated)] p-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl [background:var(--accent-gradient-soft)] text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-selected-border)]">
            <AppIcon icon="image" size={24} />
          </span>
          <p className="text-sm app-text-muted">
            Image blocks need caption, alt text, and clear placement in the lesson rhythm.
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
  );
}

export function UiLabLessonContentSurfaceSections() {
  return (
    <>
      <UiLabSection
        id="lesson-surfaces"
        title="Lesson surfaces"
        description="These shared components define the main student-facing learning and assessment entry points."
      >
        <DemoLessonSurfaces />
      </UiLabSection>

      <UiLabSection
        id="content-blocks"
        title="Content block patterns"
        description="Lesson blocks should be readable, recognisable, and calm in both English and Russian."
      >
        <DemoContentBlocks />
      </UiLabSection>
    </>
  );
}

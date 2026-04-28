import { UiLabLayoutDemoBlock } from "@/components/admin/ui-lab-layout-demo-block";
import UiLabSection from "@/components/admin/ui-lab-section";
import Button from "@/components/ui/button";
import PanelCard from "@/components/ui/panel-card";
import SectionHeader from "@/components/ui/section-header";
import Surface from "@/components/ui/surface";

function DemoAdminShell() {
  return (
    <PanelCard
      title="Admin content-management shell"
      description="Dense but still structured: page header, summary row, primary work area, and supporting side context."
      contentClassName="space-y-4"
    >
      <Surface variant="default" padding="md">
        <SectionHeader
          title="Course content"
          description="Manage modules, lessons, status, and publishing."
          actions={
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" icon="filter">
                Filter
              </Button>
              <Button variant="primary" icon="create">
                Add lesson
              </Button>
            </div>
          }
        />
      </Surface>

      <div className="grid gap-4 md:grid-cols-3">
        <UiLabLayoutDemoBlock
          title="Published lessons"
          description="34 lessons across all variants."
        />
        <UiLabLayoutDemoBlock
          title="Draft lessons"
          description="7 items needing review."
        />
        <UiLabLayoutDemoBlock
          title="Last update"
          description="Teacher tools refined yesterday."
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.85fr)]">
        <UiLabLayoutDemoBlock
          title="Primary work area"
          description="Tables, editors, builder workspaces, and detailed review areas belong here."
          className="min-h-[220px]"
        />
        <UiLabLayoutDemoBlock
          title="Secondary rail"
          description="Metadata, filters, settings, help, and inspector controls live here."
          className="min-h-[220px]"
        />
      </div>
    </PanelCard>
  );
}

function DemoStudentShell() {
  return (
    <PanelCard
      title="Student dashboard shell"
      description="Lighter rhythm, calmer spacing, and clearer motivational hierarchy."
      contentClassName="space-y-4"
    >
      <Surface variant="brand" padding="lg">
        <div className="max-w-2xl">
          <div className="app-label">Continue learning</div>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
            You are halfway through Theme 1
          </h3>
          <p className="mt-3 text-sm leading-6 app-text-muted">
            A student-facing page can feel softer and more encouraging while still staying
            inside the same design system.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="inverse" icon="next" iconPosition="right">
              Continue lesson
            </Button>
            <Button variant="secondary" icon="preview">
              View course map
            </Button>
          </div>
        </div>
      </Surface>

      <div className="grid gap-4 md:grid-cols-3">
        <UiLabLayoutDemoBlock
          title="Completed"
          description="12 lessons finished this term."
        />
        <UiLabLayoutDemoBlock
          title="Current goal"
          description="Finish speaking practice by Friday."
        />
        <UiLabLayoutDemoBlock
          title="Teacher note"
          description="Keep revising past tense endings."
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <UiLabLayoutDemoBlock
          title="Main dashboard flow"
          description="Course continuation, assignments, and recommended next actions."
          className="min-h-[180px]"
        />
        <UiLabLayoutDemoBlock
          title="Support rail"
          description="Smaller reminders, streaks, access status, or upcoming online classes."
          className="min-h-[180px]"
        />
      </div>
    </PanelCard>
  );
}

function DemoLessonShell() {
  return (
    <PanelCard
      title="Lesson page direction"
      description="Long-form learning pages need strong reading rhythm rather than dashboard density."
      contentClassName="space-y-4"
    >
      <Surface variant="muted" padding="lg">
        <div className="max-w-3xl">
          <div className="app-label">Lesson intro</div>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
            School and daily routine
          </h3>
          <p className="mt-3 text-sm leading-6 app-text-muted">
            Lesson pages should lead with context, then move into content sections with a
            calmer vertical rhythm than admin pages.
          </p>
        </div>
      </Surface>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(260px,0.72fr)]">
        <div className="space-y-4">
          <UiLabLayoutDemoBlock
            title="Section stack"
            description="Vocabulary, explanation blocks, worked examples, and practice sections stack vertically."
            className="min-h-[140px]"
          />
          <UiLabLayoutDemoBlock
            title="Follow-up section"
            description="Use repeated surfaces and consistent spacing instead of inventing new layout rules per lesson."
            className="min-h-[140px]"
          />
        </div>

        <UiLabLayoutDemoBlock
          title="Lesson rail"
          description="Progress summary, quick navigation, glossary support, or access prompts."
          className="min-h-[300px]"
        />
      </div>
    </PanelCard>
  );
}

export function UiLabLayoutShellSections() {
  return (
    <UiLabSection
      id="shells"
      title="Real page-shell directions"
      description="The layout system should answer how admin, student, and lesson pages are composed — not just how wide a container is."
    >
      <div className="space-y-4">
        <DemoAdminShell />
        <DemoStudentShell />
        <DemoLessonShell />
      </div>
    </UiLabSection>
  );
}

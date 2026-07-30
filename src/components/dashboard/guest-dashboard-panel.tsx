import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import LearningSheet, {
  LearningSheetHeader,
  LearningSheetSection,
} from "@/components/ui/learning-sheet";
import type { AppIconKey } from "@/lib/shared/icons";

const previewCards = [
  {
    title: "My Course",
    description:
      "Explore the Foundation, Higher, and Volna course routes before choosing a trial path.",
    href: "/courses",
    label: "Explore My Course",
    icon: "courses",
  },
  {
    title: "Mock exams",
    description:
      "Preview the exam practice area so you can see how mock attempts fit into revision.",
    href: "/mock-exams",
    label: "Preview mocks",
    icon: "mockExam",
  },
  {
    title: "Past papers",
    description:
      "Use official Pearson paper links without creating an account.",
    href: "/past-papers",
    label: "Open past papers",
    icon: "pastPapers",
  },
] satisfies Array<{
  title: string;
  description: string;
  href: string;
  label: string;
  icon: AppIconKey;
}>;

export function GuestDashboardPanel() {
  return (
    <LearningSheet>
      <LearningSheetHeader
        eyebrow="Dashboard preview"
        title="Preview your student dashboard"
        description="This is where trial and paid students pick up their next lesson, track progress, and return to exam practice. Guests can preview the shape of the workspace before creating an account."
        actions={
          <>
            <Button href="/signup?from=app" variant="primary" icon="create">
              Start free trial
            </Button>
            <Button href="/courses" variant="secondary" icon="courses">
              Explore My Course
            </Button>
          </>
        }
      />

      <LearningSheetSection>
        <div className="grid gap-4 md:grid-cols-3">
        {previewCards.map((card) => (
          <DashboardCard key={card.title} title={card.title}>
            <div className="space-y-3">
              <p>{card.description}</p>
              <Button href={card.href} variant="secondary" size="sm" icon={card.icon}>
                {card.label}
              </Button>
            </div>
          </DashboardCard>
        ))}
        </div>
      </LearningSheetSection>

      <LearningSheetSection muted>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <h2 className="app-card-title">What changes after signup</h2>
            <p className="mt-2 app-text-body-muted">
              Your trial student account turns this preview into a personal dashboard with
              saved lesson progress, quizzes, practice questions, and mock exam attempts.
            </p>
          </div>
          <Button href="/signup?from=app" variant="primary" icon="create">
            Create trial student account
          </Button>
        </div>
      </LearningSheetSection>
    </LearningSheet>
  );
}

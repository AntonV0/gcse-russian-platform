import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import LearningSheet, {
  LearningSheetSection,
} from "@/components/ui/learning-sheet";

export default function PlatformNotFound() {
  return (
    <main>
      <LearningSheet>
        <LearningSheetSection divided={false}>
          <EmptyState
            icon="search"
            iconTone="brand"
            title="Page not found"
            description="This platform page could not be found. Return to your dashboard or browse your course content."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Button href="/dashboard" variant="primary" icon="dashboard">
                  Dashboard
                </Button>
                <Button href="/courses" variant="secondary" icon="courses">
                  Courses
                </Button>
              </div>
            }
          />
        </LearningSheetSection>
      </LearningSheet>
    </main>
  );
}

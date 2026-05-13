import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";

export default function LessonNotFound() {
  return (
    <main>
      <EmptyState
        icon="search"
        iconTone="brand"
        title="Lesson not found"
        description="This lesson may have moved, may not be published yet, or may belong to a different course path."
        headingLevel={1}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/courses" variant="primary" icon="courses">
              Browse courses
            </Button>
            <Button href="/dashboard" variant="secondary" icon="dashboard">
              Dashboard
            </Button>
          </div>
        }
      />
    </main>
  );
}

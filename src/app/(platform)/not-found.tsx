import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";

export default function PlatformNotFound() {
  return (
    <main>
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
    </main>
  );
}

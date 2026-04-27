import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import VisualPlaceholder from "@/components/ui/visual-placeholder";

export function GuestDashboardPanel() {
  return (
    <EmptyState
      title="You are not signed in"
      description="Log in to view your dashboard, learning progress, and course access."
      visual={
        <VisualPlaceholder
          category="learningPath"
          ariaLabel="Dashboard sign-in placeholder"
        />
      }
      action={
        <div className="flex flex-wrap gap-3">
          <Button href="/login" variant="primary" icon="user">
            Log in
          </Button>
          <Button href="/signup" variant="secondary" icon="create">
            Sign up
          </Button>
        </div>
      }
    />
  );
}

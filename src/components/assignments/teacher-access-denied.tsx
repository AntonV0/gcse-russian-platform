import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";

export default function TeacherAccessDenied() {
  return (
    <main>
      <EmptyState
        icon="lock"
        iconTone="warning"
        title="Teacher access required"
        description="You do not have permission to view this teacher page."
        action={
          <Button href="/dashboard" variant="primary" icon="dashboard">
            Back to dashboard
          </Button>
        }
      />
    </main>
  );
}

import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import OperationsWorkspace, {
  OperationsSection,
} from "@/components/ui/operations-workspace";

export default function TeacherAccessDenied() {
  return (
    <main>
      <OperationsWorkspace>
        <OperationsSection divided={false}>
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
        </OperationsSection>
      </OperationsWorkspace>
    </main>
  );
}

import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";

export function SignedOutAccountPanel() {
  return (
    <EmptyState
      title="You are not signed in"
      description="Log in to view your account overview and manage your student settings."
      action={
        <div className="flex flex-wrap gap-3">
          <Button href="/login?from=app" variant="primary" icon="user">
            Log in
          </Button>

          <Button href="/signup?from=app" variant="secondary" icon="create">
            Sign up
          </Button>
        </div>
      }
    />
  );
}

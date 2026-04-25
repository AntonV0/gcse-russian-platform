import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";

export default function AdminNotFound() {
  return (
    <main>
      <EmptyState
        icon="search"
        iconTone="brand"
        title="Admin page not found"
        description="This admin page could not be found. Return to the admin dashboard or open the main content area."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/admin" variant="primary" icon="dashboard">
              Admin dashboard
            </Button>
            <Button href="/admin/content" variant="secondary" icon="courses">
              Content
            </Button>
          </div>
        }
      />
    </main>
  );
}

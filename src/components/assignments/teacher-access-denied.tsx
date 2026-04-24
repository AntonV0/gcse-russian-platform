import Button from "@/components/ui/button";

export default function TeacherAccessDenied() {
  return (
    <main className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Access denied</h1>
      <p className="app-text-muted">
        You do not have permission to view this teacher page.
      </p>
      <Button href="/dashboard" variant="primary" icon="dashboard">
        Back to dashboard
      </Button>
    </main>
  );
}

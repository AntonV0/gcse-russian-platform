import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import { uiLabPages, type UiLabStatus } from "@/lib/ui/ui-lab";

function getStatusTone(status: UiLabStatus): "success" | "warning" | "muted" {
  switch (status) {
    case "complete":
      return "success";
    case "in_progress":
      return "warning";
    case "planned":
    default:
      return "muted";
  }
}

function getStatusLabel(status: UiLabStatus) {
  switch (status) {
    case "complete":
      return "Complete";
    case "in_progress":
      return "In progress";
    case "planned":
    default:
      return "Planned";
  }
}

type UiLabShellProps = {
  title: string;
  description: string;
  currentPath: string;
  children: React.ReactNode;
};

export default function UiLabShell({
  title,
  description,
  currentPath,
  children,
}: UiLabShellProps) {
  return (
    <main className="space-y-8">
      <PageHeader title={title} description={description} />

      <section className="app-card app-section-padding space-y-4">
        <div>
          <h2 className="app-section-title">UI Lab sections</h2>
          <p className="mt-1 text-sm app-text-muted">
            Browse the internal design system by category and track what is finished,
            still being refined, or not yet built.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {uiLabPages.map((item) => {
            const isActive = currentPath === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "app-card app-card-hover block p-4",
                  isActive ? "ring-2 ring-[var(--brand-blue)]/20" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="font-semibold text-[var(--text-primary)]">
                    {item.label}
                  </div>

                  <Badge tone={getStatusTone(item.status)}>
                    {getStatusLabel(item.status)}
                  </Badge>
                </div>

                <p className="text-sm app-text-muted">{item.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {children}
    </main>
  );
}

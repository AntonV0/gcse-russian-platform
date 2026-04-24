import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Card, { CardBody } from "@/components/ui/card";
import { uiLabPages } from "@/lib/ui/ui-lab";
import type { UiLabStatus } from "@/lib/ui/ui-lab";

type UiLabShellProps = {
  title: string;
  description: string;
  currentPath: string;
  children: React.ReactNode;
};

function getStatusTone(status: UiLabStatus) {
  if (status === "complete") return "success" as const;
  if (status === "in_progress") return "warning" as const;
  return "muted" as const;
}

function getStatusLabel(status: UiLabStatus) {
  if (status === "complete") return "Ready";
  if (status === "in_progress") return "Refining";
  return "Planned";
}

export default function UiLabShell({
  title,
  description,
  currentPath,
  children,
}: UiLabShellProps) {
  return (
    <main className="space-y-8">
      <PageHeader title={title} description={description} />

      <Card className="px-5 py-4">
        <CardBody className="space-y-3 p-0">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <AppIcon icon="uiLab" size={17} className="app-brand-text" />
                <h2 className="app-section-title">UI Lab sections</h2>
              </div>
              <p className="mt-1 text-sm app-text-muted">
                Shared references for premium admin tools, student learning, and
                parent-facing confidence.
              </p>
            </div>

            <Badge tone="muted">Internal reference</Badge>
          </div>

          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {uiLabPages.map((item) => {
              const isActive = currentPath === item.href;

              return (
                <Link key={item.href} href={item.href} className="block">
                  <div
                    className={[
                      "rounded-2xl border px-3.5 py-3 transition",
                      isActive
                        ? "border-[rgba(37,99,235,0.24)] bg-[rgba(37,99,235,0.08)] shadow-[0_8px_20px_rgba(37,99,235,0.08)]"
                        : "border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--border-strong)] hover:bg-[var(--background-muted)]",
                    ].join(" ")}
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="font-medium text-[var(--text-primary)]">
                        {item.label}
                      </div>
                      <Badge tone={isActive ? "info" : getStatusTone(item.status)}>
                        {isActive ? "Open" : getStatusLabel(item.status)}
                      </Badge>
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 app-text-muted">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {children}
    </main>
  );
}

import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import Card, { CardBody } from "@/components/ui/card";
import { uiLabPages } from "@/lib/ui/ui-lab";

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

      <Card className="px-5 py-4">
        <CardBody className="space-y-3 p-0">
          <div>
            <h2 className="app-section-title">UI Lab sections</h2>
            <p className="mt-1 text-sm app-text-muted">
              Quick navigation across the design system.
            </p>
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
                    <div className="font-medium text-[var(--text-primary)]">
                      {item.label}
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

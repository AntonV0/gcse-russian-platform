import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";

type ResponsivePreviewFrameProps = {
  title: string;
  viewport: string;
  description: string;
  children: React.ReactNode;
};

type ResponsivePreviewSetProps = {
  children: React.ReactNode;
};

export function ResponsivePreviewSet({ children }: ResponsivePreviewSetProps) {
  return <div className="grid gap-4 xl:grid-cols-3">{children}</div>;
}

export default function ResponsivePreviewFrame({
  title,
  viewport,
  description,
  children,
}: ResponsivePreviewFrameProps) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-[var(--border-subtle)] bg-[var(--background-muted)]/45 px-4 py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[var(--text-primary)]">
              {title}
            </div>
            <p className="mt-1 text-xs leading-5 app-text-muted">{description}</p>
          </div>

          <Badge tone="muted">{viewport}</Badge>
        </div>
      </div>

      <div className="bg-[var(--background-muted)]/35 p-3">
        <div className="mx-auto overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] shadow-[var(--shadow-sm)]">
          <div className="flex items-center gap-1.5 border-b border-[var(--border-subtle)] bg-[var(--surface-muted-bg)] px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[var(--danger)]/60" />
            <span className="h-2 w-2 rounded-full bg-[var(--warning)]/60" />
            <span className="h-2 w-2 rounded-full bg-[var(--success)]/60" />
          </div>

          <div className="p-3">{children}</div>
        </div>
      </div>
    </Card>
  );
}

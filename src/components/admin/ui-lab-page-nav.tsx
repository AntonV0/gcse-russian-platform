import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";

type UiLabPageNavItem = {
  id: string;
  label: string;
};

type UiLabPageNavProps = {
  items: UiLabPageNavItem[];
  title?: string;
};

export default function UiLabPageNav({
  items,
  title = "On this page",
}: UiLabPageNavProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex shrink-0 items-center gap-2">
          <AppIcon icon="list" size={16} className="app-brand-text" />
          <div className="text-sm font-semibold text-[var(--text-primary)]">
            {title}
          </div>
          <Badge tone="muted">{items.length}</Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              className="app-focus-ring rounded-full border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:bg-[var(--background-muted)] hover:text-[var(--text-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </Card>
  );
}

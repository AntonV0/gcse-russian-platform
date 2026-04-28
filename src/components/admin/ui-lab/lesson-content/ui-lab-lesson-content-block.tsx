import type { ReactNode } from "react";

import Badge from "@/components/ui/badge";
import Surface from "@/components/ui/surface";

export function LessonContentBlock({
  label,
  title,
  children,
  tone = "default",
}: {
  label: string;
  title: string;
  children: ReactNode;
  tone?: "default" | "muted" | "brand";
}) {
  return (
    <Surface variant={tone} padding="md">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge tone="muted">{label}</Badge>
      </div>
      <div className="font-semibold text-[var(--text-primary)]">{title}</div>
      <div className="mt-3 text-sm leading-6 app-text-muted">{children}</div>
    </Surface>
  );
}

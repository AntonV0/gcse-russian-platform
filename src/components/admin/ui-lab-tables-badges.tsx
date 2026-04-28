import type { DemoTableRow } from "@/components/admin/ui-lab-tables-data";
import Badge from "@/components/ui/badge";

export function StatusBadge({ status }: { status: DemoTableRow["status"] }) {
  if (status === "published") {
    return (
      <Badge tone="info" icon="preview">
        Published
      </Badge>
    );
  }

  if (status === "in_progress") {
    return (
      <Badge tone="warning" icon="pending">
        In progress
      </Badge>
    );
  }

  return (
    <Badge tone="muted" icon="file">
      Draft
    </Badge>
  );
}

export function VariantBadge({ variant }: { variant?: DemoTableRow["variant"] }) {
  if (!variant) return null;

  if (variant === "foundation") {
    return <Badge tone="muted">Foundation</Badge>;
  }

  if (variant === "volna") {
    return <Badge tone="success">Volna</Badge>;
  }

  return <Badge tone="default">Higher</Badge>;
}

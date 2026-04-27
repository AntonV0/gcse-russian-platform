import Link from "next/link";
import Badge from "@/components/ui/badge";
import PanelCard from "@/components/ui/panel-card";

export type QuestionSetUsageAssignment = {
  id: string;
  title: string;
  status: string;
  due_at?: string | null;
};

export function QuestionSetUsagePanel({
  usage,
}: {
  usage: QuestionSetUsageAssignment[];
}) {
  return (
    <PanelCard
      title="Usage"
      description="Shows whether this set is already attached to teacher assignments."
    >
      {usage.length === 0 ? (
        <p className="text-sm app-text-muted">
          This question set is not used in any assignments.
        </p>
      ) : (
        <div className="space-y-3">
          <p className="text-sm app-text-muted">
            Used in {usage.length} assignment{usage.length > 1 ? "s" : ""}.
          </p>

          <ul className="space-y-2">
            {usage.map((assignment) => (
              <li
                key={assignment.id}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-secondary)]/55 px-3 py-2"
              >
                <Link
                  href={`/teacher/assignments/${assignment.id}`}
                  className="font-medium app-brand-text hover:underline"
                >
                  {assignment.title}
                </Link>
                <Badge tone="muted">{assignment.status}</Badge>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PanelCard>
  );
}

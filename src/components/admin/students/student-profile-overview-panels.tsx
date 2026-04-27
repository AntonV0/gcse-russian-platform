import { setTeacherRoleAction } from "@/app/actions/admin/admin-user-actions";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import DetailList from "@/components/ui/detail-list";
import EmptyState from "@/components/ui/empty-state";
import PanelCard from "@/components/ui/panel-card";
import type {
  AdminProfileRow,
  AdminVariantProgressSummaryRow,
} from "@/lib/users/admin-user-helpers-db";
import {
  formatDateTime,
  formatVariantLabel,
} from "@/components/admin/students/student-profile-utils";

export function StudentProfileOverviewPanels({ student }: { student: AdminProfileRow }) {
  return (
    <section className="mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
      <PanelCard title="Profile Details" tone="admin">
        <DetailList
          items={[
            { label: "Full name", value: student.full_name || "-" },
            { label: "Display name", value: student.display_name || "-" },
            { label: "Email", value: student.email || "-" },
            { label: "Admin", value: student.is_admin ? "Yes" : "No" },
            { label: "Teacher role", value: student.is_teacher ? "Yes" : "No" },
            { label: "Created", value: formatDateTime(student.created_at) },
          ]}
        />
      </PanelCard>

      <PanelCard
        title="Actions"
        description="Manage this learner's staff role when needed."
        tone="admin"
      >
        <form action={setTeacherRoleAction}>
          <input type="hidden" name="userId" value={student.id} />
          <input
            type="hidden"
            name="redirectTo"
            value={`/admin/students/${student.id}`}
          />
          <input
            type="hidden"
            name="mode"
            value={student.is_teacher ? "disable" : "enable"}
          />
          <Button
            type="submit"
            variant={student.is_teacher ? "warning" : "secondary"}
            icon={student.is_teacher ? "warning" : "user"}
          >
            {student.is_teacher ? "Remove teacher role" : "Enable teacher role"}
          </Button>
        </form>
      </PanelCard>
    </section>
  );
}

export function StudentProgressSummaryPanel({
  progressSummary,
}: {
  progressSummary: AdminVariantProgressSummaryRow[];
}) {
  return (
    <PanelCard
      title={`Progress Summary by Variant (${progressSummary.length})`}
      description="Completed lessons grouped by course and GCSE tier variant."
      tone="admin"
      contentClassName="space-y-3"
    >
      {progressSummary.length === 0 ? (
        <EmptyState
          icon="lesson"
          title="No completed lesson progress yet"
          description="This learner has not completed a lesson variant in the tracked flow."
        />
      ) : (
        progressSummary.map((row) => (
          <CardListItem
            key={`${row.course_slug}-${row.variant_slug}`}
            title={`${row.course_slug} - ${formatVariantLabel(row.variant_slug)}`}
            subtitle={`Completed lessons: ${row.completed_lessons}`}
            badges={
              <Badge tone="success" icon="completed">
                {row.completed_lessons} complete
              </Badge>
            }
          />
        ))
      )}
    </PanelCard>
  );
}

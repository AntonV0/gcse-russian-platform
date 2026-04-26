import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";
import Select from "@/components/ui/select";
import {
  setTeacherRoleAction,
  switchStudentAccessGrantAction,
} from "@/app/actions/admin/admin-user-actions";
import type {
  ProductRow,
  StudentCard,
  StudentGroup,
} from "@/lib/admin/student-list";

function getPersonLabel(
  profile: Pick<StudentCard, "full_name" | "display_name" | "email">
) {
  return profile.full_name || profile.display_name || profile.email || "Unnamed";
}

function formatDate(value: string | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getProductLabel(product: ProductRow) {
  const code = (product.code ?? "").toLowerCase();
  const name = (product.name ?? "").toLowerCase();
  const combined = `${code} ${name}`;

  if (combined.includes("foundation") && combined.includes("full")) {
    return "Foundation Full";
  }

  if (combined.includes("higher") && combined.includes("full")) {
    return "Higher Full";
  }

  if (combined.includes("volna")) return "Volna";
  if (combined.includes("trial")) return "Trial";

  return product.name || product.code || product.id;
}

function StudentAccessBadges({ student }: { student: StudentCard }) {
  return (
    <>
      <Badge tone={student.isActive ? "info" : "muted"} icon="user">
        {student.accessLabel}
      </Badge>

      <Badge
        tone={student.isActive ? "success" : "warning"}
        icon={student.isActive ? "completed" : "pending"}
      >
        {student.isActive ? "Active" : "Inactive"}
      </Badge>

      {student.groupNames.map((groupName) => (
        <Badge key={groupName} tone="muted" icon="users">
          {groupName}
        </Badge>
      ))}
    </>
  );
}

function StudentRowActions({
  student,
  accessOptions,
  currentPathWithFilters,
}: {
  student: StudentCard;
  accessOptions: ProductRow[];
  currentPathWithFilters: string;
}) {
  return (
    <InlineActions align="end">
      <form action={switchStudentAccessGrantAction} className="flex flex-wrap gap-2">
        <input type="hidden" name="userId" value={student.id} />
        <input type="hidden" name="redirectTo" value={currentPathWithFilters} />
        <Select
          name="productId"
          defaultValue=""
          className="w-auto min-w-[150px] px-2 py-1 text-xs"
        >
          <option value="">Switch access</option>
          {accessOptions.map((product) => (
            <option key={product.id} value={product.id}>
              {getProductLabel(product)}
            </option>
          ))}
        </Select>
        <Button type="submit" variant="secondary" size="sm">
          Apply
        </Button>
      </form>

      <form action={setTeacherRoleAction}>
        <input type="hidden" name="userId" value={student.id} />
        <input type="hidden" name="redirectTo" value={currentPathWithFilters} />
        <input type="hidden" name="mode" value="enable" />
        <Button type="submit" variant="secondary" size="sm">
          Make teacher
        </Button>
      </form>

      <Button href={`/admin/students/${student.id}`} variant="secondary" size="sm" icon="preview">
        View
      </Button>
    </InlineActions>
  );
}

function StudentCardListItem({
  student,
  accessOptions,
  currentPathWithFilters,
}: {
  student: StudentCard;
  accessOptions: ProductRow[];
  currentPathWithFilters: string;
}) {
  return (
    <CardListItem
      title={getPersonLabel(student)}
      subtitle={`${student.email || "No email"} - Start: ${formatDate(
        student.startsAt
      )} - End: ${formatDate(student.endsAt)}`}
      badges={<StudentAccessBadges student={student} />}
      actions={
        <StudentRowActions
          student={student}
          accessOptions={accessOptions}
          currentPathWithFilters={currentPathWithFilters}
        />
      }
    />
  );
}

export default function StudentListPanels({
  orderedGroups,
  filteredInactiveStudents,
  accessOptions,
  currentPathWithFilters,
}: {
  orderedGroups: StudentGroup[];
  filteredInactiveStudents: StudentCard[];
  accessOptions: ProductRow[];
  currentPathWithFilters: string;
}) {
  return (
    <div className="space-y-6">
      {orderedGroups.length === 0 && filteredInactiveStudents.length === 0 ? (
        <EmptyState
          icon="search"
          title="No student accounts found"
          description="Try adjusting the search, access, or status filters."
        />
      ) : null}

      {orderedGroups.map((group) => (
        <PanelCard
          key={group.label}
          title={`${group.label} (${group.rows.length})`}
          description="Active learners with this access type."
          tone="admin"
          density="compact"
          contentClassName="space-y-3"
        >
          {group.rows.map((student) => (
            <StudentCardListItem
              key={student.id}
              student={student}
              accessOptions={accessOptions}
              currentPathWithFilters={currentPathWithFilters}
            />
          ))}
        </PanelCard>
      ))}

      <PanelCard
        title={`Inactive / No Active Access (${filteredInactiveStudents.length})`}
        description="Learners without a current active grant."
        tone="admin"
        density="compact"
        contentClassName="space-y-3"
      >
        {filteredInactiveStudents.length === 0 ? (
          <EmptyState
            icon="completed"
            iconTone="success"
            title="No inactive students found"
            description="All students matching these filters currently have active access."
          />
        ) : (
          filteredInactiveStudents.map((student) => (
            <StudentCardListItem
              key={student.id}
              student={student}
              accessOptions={accessOptions}
              currentPathWithFilters={currentPathWithFilters}
            />
          ))
        )}
      </PanelCard>
    </div>
  );
}

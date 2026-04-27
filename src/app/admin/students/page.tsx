import PageHeader from "@/components/layout/page-header";
import FeedbackBanner from "@/components/ui/feedback-banner";
import StudentFeedbackBanners from "@/components/admin/students/student-feedback-banners";
import StudentFilterPanel from "@/components/admin/students/student-filter-panel";
import StudentListPanels from "@/components/admin/students/student-list-panels";
import { getAdminStudentList } from "@/lib/admin/student-list";
import { requireAdminAccess } from "@/lib/auth/admin-auth";

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
    status?: string;
    access?: string;
    success?: string;
    error?: string;
  }>;
}) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const params = (await searchParams) ?? {};
  const q = (params.q ?? "").trim();
  const statusFilter = (params.status ?? "all").trim();
  const accessFilter = (params.access ?? "all").trim();
  const currentPathWithFilters = `/admin/students?q=${encodeURIComponent(q)}&status=${encodeURIComponent(
    statusFilter
  )}&access=${encodeURIComponent(accessFilter)}`;

  const { orderedGroups, filteredInactiveStudents, totalStudents, accessOptions } =
    await getAdminStudentList({
      q,
      statusFilter,
      accessFilter,
    });

  return (
    <main>
      <PageHeader
        title="Students"
        description="Student accounts grouped by current access type."
      />

      <StudentFeedbackBanners success={params.success} error={params.error} />

      <StudentFilterPanel q={q} statusFilter={statusFilter} accessFilter={accessFilter} />

      <FeedbackBanner
        className="mb-6"
        tone="info"
        title={`${totalStudents} student account${totalStudents === 1 ? "" : "s"} shown`}
        description="Students are grouped by their current active access grant so support tasks stay easy to scan."
      />

      <StudentListPanels
        orderedGroups={orderedGroups}
        filteredInactiveStudents={filteredInactiveStudents}
        accessOptions={accessOptions}
        currentPathWithFilters={currentPathWithFilters}
      />
    </main>
  );
}

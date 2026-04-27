import PageHeader from "@/components/layout/page-header";
import StudentFeedbackBanners from "@/components/admin/students/student-feedback-banners";
import {
  AccessHistoryPanel,
  CurrentAccessPanel,
  SwitchAccessPanel,
} from "@/components/admin/students/student-profile-access-panels";
import {
  StudentProfileOverviewPanels,
  StudentProgressSummaryPanel,
} from "@/components/admin/students/student-profile-overview-panels";
import {
  AddStudentToTeachingGroupPanel,
  TeachingGroupMembershipsPanel,
} from "@/components/admin/students/student-profile-teaching-group-panels";
import { getPersonLabel } from "@/components/admin/students/student-profile-utils";
import Button from "@/components/ui/button";
import InlineActions from "@/components/ui/inline-actions";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import {
  getAdminAccessGrantsByUserIdDb,
  getAdminProductsDb,
  getAdminProfileByIdDb,
  getAdminTeachingGroupMembershipsByUserIdDb,
  getAdminTeachingGroupsDb,
  getAdminVariantProgressSummaryByUserIdDb,
} from "@/lib/users/admin-user-helpers-db";

export default async function AdminStudentProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams?: Promise<{ success?: string; error?: string }>;
}) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const { userId } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};

  const [
    student,
    accessGrants,
    studentMemberships,
    teachingGroups,
    progressSummary,
    products,
  ] = await Promise.all([
    getAdminProfileByIdDb(userId),
    getAdminAccessGrantsByUserIdDb(userId),
    getAdminTeachingGroupMembershipsByUserIdDb(userId),
    getAdminTeachingGroupsDb(),
    getAdminVariantProgressSummaryByUserIdDb(userId),
    getAdminProductsDb(),
  ]);

  if (!student) {
    return <main>Student not found.</main>;
  }

  const activeGrant = accessGrants.find((grant) => grant.is_active) ?? null;
  const inactiveGrants = accessGrants.filter((grant) => !grant.is_active);

  const selectableProducts = products.filter((product) => {
    const combined = `${product.code ?? ""} ${product.name ?? ""}`.toLowerCase();

    return (
      combined.includes("trial") ||
      combined.includes("foundation") ||
      combined.includes("higher") ||
      combined.includes("volna")
    );
  });

  const groupMap = new Map(teachingGroups.map((group) => [group.id, group]));
  const membershipsWithGroup = studentMemberships.map((membership) => ({
    ...membership,
    group: groupMap.get(membership.group_id) ?? null,
  }));

  const currentStudentGroupIds = new Set(
    membershipsWithGroup
      .filter((membership) => membership.member_role === "student")
      .map((membership) => membership.group_id)
  );

  const availableGroups = teachingGroups.filter(
    (group) => !currentStudentGroupIds.has(group.id)
  );

  return (
    <main>
      <InlineActions className="mb-4">
        <Button href="/admin/students" variant="quiet" size="sm" icon="back">
          Back to students
        </Button>
      </InlineActions>

      <PageHeader
        title={getPersonLabel(student)}
        description="Student profile, access grants, teaching groups, and progress by variant."
      />

      <StudentFeedbackBanners
        success={resolvedSearchParams.success}
        error={resolvedSearchParams.error}
      />

      <StudentProfileOverviewPanels student={student} />

      <div className="space-y-6">
        <CurrentAccessPanel studentId={student.id} activeGrant={activeGrant} />
        <SwitchAccessPanel
          studentId={student.id}
          selectableProducts={selectableProducts}
        />
        <AccessHistoryPanel inactiveGrants={inactiveGrants} />
        <StudentProgressSummaryPanel progressSummary={progressSummary} />
        <AddStudentToTeachingGroupPanel
          studentId={student.id}
          availableGroups={availableGroups}
        />
        <TeachingGroupMembershipsPanel
          studentId={student.id}
          membershipsWithGroup={membershipsWithGroup}
        />
      </div>
    </main>
  );
}

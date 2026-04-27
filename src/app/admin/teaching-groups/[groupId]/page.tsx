import AdminFeedbackBanner from "@/components/admin/admin-feedback-banner";
import {
  AddTeachingGroupMemberPanel,
  TeachingGroupMemberSection,
  type TeachingGroupMemberRow,
  type TeachingGroupProfileRow,
} from "@/components/admin/teaching-groups/teaching-group-member-panels";
import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import DetailList from "@/components/ui/detail-list";
import PanelCard from "@/components/ui/panel-card";
import {
  addStudentToTeachingGroupAction,
  addTeacherToTeachingGroupAction,
  removeStudentFromTeachingGroupAction,
  removeTeacherFromTeachingGroupAction,
} from "@/app/actions/admin/admin-user-actions";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";

type TeachingGroupRow = {
  id: string;
  name: string;
  course_id: string | null;
  course_variant_id: string | null;
  is_active: boolean;
};

type CourseRow = {
  id: string;
  title: string;
  slug: string;
};

type VariantRow = {
  id: string;
  course_id: string;
  title: string;
  slug: string;
};

export default async function AdminTeachingGroupDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ groupId: string }>;
  searchParams?: Promise<{ success?: string; error?: string }>;
}) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const { groupId } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const supabase = await createClient();

  const [
    { data: group },
    { data: currentGroupMemberships },
    { data: allMemberships },
    { data: profiles },
    { data: courses },
    { data: variants },
    { data: grants },
  ] = await Promise.all([
    supabase
      .from("teaching_groups")
      .select("id, name, course_id, course_variant_id, is_active")
      .eq("id", groupId)
      .maybeSingle(),
    supabase
      .from("teaching_group_members")
      .select("user_id, group_id, member_role")
      .eq("group_id", groupId),
    supabase.from("teaching_group_members").select("user_id, group_id, member_role"),
    supabase
      .from("profiles")
      .select("id, email, full_name, display_name, is_admin, is_teacher"),
    supabase.from("courses").select("id, title, slug"),
    supabase.from("course_variants").select("id, course_id, title, slug"),
    supabase
      .from("user_access_grants")
      .select("user_id, is_active")
      .eq("is_active", true),
  ]);

  const teachingGroup = group as TeachingGroupRow | null;
  const membershipRows = (currentGroupMemberships ?? []) as TeachingGroupMemberRow[];
  const allMembershipRows = (allMemberships ?? []) as TeachingGroupMemberRow[];
  const profileRows = (profiles ?? []) as TeachingGroupProfileRow[];
  const courseRows = (courses ?? []) as CourseRow[];
  const variantRows = (variants ?? []) as VariantRow[];
  const activeGrantRows = (grants ?? []) as Array<{
    user_id: string;
    is_active: boolean;
  }>;

  if (!teachingGroup) {
    return <main>Teaching group not found.</main>;
  }

  const profileMap = new Map(profileRows.map((profile) => [profile.id, profile]));
  const courseMap = new Map(courseRows.map((course) => [course.id, course]));
  const variantMap = new Map(variantRows.map((variant) => [variant.id, variant]));

  const linkedCourse = teachingGroup.course_id
    ? (courseMap.get(teachingGroup.course_id) ?? null)
    : null;

  const linkedVariant = teachingGroup.course_variant_id
    ? (variantMap.get(teachingGroup.course_variant_id) ?? null)
    : null;

  const teachers = membershipRows.filter((member) => member.member_role === "teacher");
  const students = membershipRows.filter((member) => member.member_role === "student");

  const teacherIdsInGroup = new Set(teachers.map((member) => member.user_id));
  const studentIdsInGroup = new Set(students.map((member) => member.user_id));
  const activeGrantUserIds = new Set(activeGrantRows.map((grant) => grant.user_id));

  const knownTeacherIds = new Set(
    allMembershipRows
      .filter((member) => member.member_role === "teacher")
      .map((member) => member.user_id)
  );

  const availableTeachers = profileRows.filter((profile) => {
    if (teacherIdsInGroup.has(profile.id)) return false;
    return profile.is_admin || profile.is_teacher || knownTeacherIds.has(profile.id);
  });

  const availableStudents = profileRows.filter((profile) => {
    if (profile.is_admin) return false;
    if (profile.is_teacher) return false;
    if (studentIdsInGroup.has(profile.id)) return false;
    if (teacherIdsInGroup.has(profile.id)) return false;
    return activeGrantUserIds.has(profile.id);
  });

  const groupHref = `/admin/teaching-groups/${teachingGroup.id}`;

  return (
    <main>
      <div className="mb-4">
        <Button href="/admin/teaching-groups" variant="quiet" size="sm" icon="back">
          Back to teaching groups
        </Button>
      </div>

      <PageHeader
        title={teachingGroup.name}
        description="Teaching group overview and membership."
      />

      <AdminFeedbackBanner
        success={resolvedSearchParams.success}
        error={resolvedSearchParams.error}
      />

      <section className="mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <PanelCard
          title="Group details"
          description="Course and membership context for this guided learning group."
          tone="admin"
        >
          <DetailList
            items={[
              { label: "Name", value: teachingGroup.name },
              {
                label: "Status",
                value: teachingGroup.is_active ? "Active" : "Inactive",
              },
              {
                label: "Linked course",
                value: linkedCourse ? linkedCourse.title : "-",
              },
              {
                label: "Linked variant",
                value: linkedVariant ? linkedVariant.title : "-",
              },
            ]}
          />
        </PanelCard>

        <PanelCard title="Actions" description="Manage the group setup." tone="muted">
          <Button
            href={`/admin/teaching-groups/${teachingGroup.id}/edit`}
            variant="secondary"
            icon="edit"
          >
            Edit teaching group
          </Button>
        </PanelCard>
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <AddTeachingGroupMemberPanel
          title="Add teacher"
          description="Attach a teacher or admin user to this group."
          emptyText="No available teachers to add."
          action={addTeacherToTeachingGroupAction}
          groupId={teachingGroup.id}
          redirectTo={groupHref}
          profiles={availableTeachers}
          selectLabel="Teacher"
          buttonLabel="Add teacher"
        />

        <AddTeachingGroupMemberPanel
          title="Add student"
          description="Attach an eligible active student to this group."
          emptyText="No available students to add."
          action={addStudentToTeachingGroupAction}
          groupId={teachingGroup.id}
          redirectTo={groupHref}
          profiles={availableStudents}
          selectLabel="Student"
          buttonLabel="Add student"
        />
      </section>

      <section className="mb-6">
        <TeachingGroupMemberSection
          title="Teachers"
          emptyTitle="No teacher members yet"
          emptyDescription="Add a teacher to make this group useful for guided Volna work."
          members={teachers}
          profileMap={profileMap}
          viewHrefPrefix="/admin/teachers"
          viewLabel="View teacher"
          removeAction={removeTeacherFromTeachingGroupAction}
          confirmMessage="Remove this teacher from the teaching group?"
          groupId={teachingGroup.id}
        />
      </section>

      <TeachingGroupMemberSection
        title="Students"
        emptyTitle="No student members yet"
        emptyDescription="Add students once they have active access and are ready for teacher-led work."
        members={students}
        profileMap={profileMap}
        viewHrefPrefix="/admin/students"
        viewLabel="View student"
        removeAction={removeStudentFromTeachingGroupAction}
        confirmMessage="Remove this student from the teaching group?"
        groupId={teachingGroup.id}
      />
    </main>
  );
}

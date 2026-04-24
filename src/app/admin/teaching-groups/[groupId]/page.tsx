import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import AdminFeedbackBanner from "@/components/admin/admin-feedback-banner";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import DetailList from "@/components/ui/detail-list";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";
import Select from "@/components/ui/select";
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

type TeachingGroupMemberRow = {
  user_id: string;
  group_id: string;
  member_role: string;
};

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  is_admin: boolean;
  is_teacher: boolean;
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

function getPersonLabel(
  profile: Pick<ProfileRow, "full_name" | "display_name" | "email">
) {
  return profile.full_name || profile.display_name || profile.email || "Unnamed";
}

function AddMemberPanel({
  title,
  description,
  emptyText,
  action,
  groupId,
  redirectTo,
  profiles,
  selectLabel,
  buttonLabel,
}: {
  title: string;
  description: string;
  emptyText: string;
  action: (formData: FormData) => void | Promise<void>;
  groupId: string;
  redirectTo: string;
  profiles: ProfileRow[];
  selectLabel: string;
  buttonLabel: string;
}) {
  return (
    <PanelCard title={title} description={description} tone="admin">
      {profiles.length === 0 ? (
        <p className="text-sm app-text-muted">{emptyText}</p>
      ) : (
        <form action={action} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <input type="hidden" name="groupId" value={groupId} />
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <FormField label={selectLabel} className="min-w-0 flex-1">
            <Select name="userId" required>
              <option value="">Select user</option>
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {getPersonLabel(profile)}
                </option>
              ))}
            </Select>
          </FormField>

          <Button type="submit" variant="secondary" icon="create">
            {buttonLabel}
          </Button>
        </form>
      )}
    </PanelCard>
  );
}

function MemberSection({
  title,
  emptyTitle,
  emptyDescription,
  members,
  profileMap,
  viewHrefPrefix,
  viewLabel,
  removeAction,
  confirmMessage,
  groupId,
}: {
  title: string;
  emptyTitle: string;
  emptyDescription: string;
  members: TeachingGroupMemberRow[];
  profileMap: Map<string, ProfileRow>;
  viewHrefPrefix: "/admin/teachers" | "/admin/students";
  viewLabel: string;
  removeAction: (formData: FormData) => void | Promise<void>;
  confirmMessage: string;
  groupId: string;
}) {
  const redirectTo = `/admin/teaching-groups/${groupId}`;

  return (
    <PanelCard title={`${title} (${members.length})`} tone="admin" contentClassName="space-y-3">
      {members.length === 0 ? (
        <EmptyState
          icon="users"
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        members.map((member) => {
          const profile = profileMap.get(member.user_id);

          return (
            <CardListItem
              key={member.user_id}
              title={profile ? getPersonLabel(profile) : member.user_id}
              subtitle={profile?.email || "No email"}
              badges={<Badge tone="muted">{member.member_role}</Badge>}
              actions={
                <InlineActions>
                  {profile ? (
                    <Button
                      href={`${viewHrefPrefix}/${profile.id}`}
                      variant="secondary"
                      size="sm"
                      icon="preview"
                    >
                      {viewLabel}
                    </Button>
                  ) : null}

                  <form action={removeAction}>
                    <input type="hidden" name="userId" value={member.user_id} />
                    <input type="hidden" name="groupId" value={groupId} />
                    <input type="hidden" name="redirectTo" value={redirectTo} />
                    <AdminConfirmButton
                      confirmMessage={confirmMessage}
                      className="app-btn-base app-btn-danger min-h-9 rounded-xl px-3.5 py-2 text-sm"
                    >
                      Remove
                    </AdminConfirmButton>
                  </form>
                </InlineActions>
              }
            />
          );
        })
      )}
    </PanelCard>
  );
}

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
  const profileRows = (profiles ?? []) as ProfileRow[];
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
        <AddMemberPanel
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

        <AddMemberPanel
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
        <MemberSection
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

      <MemberSection
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

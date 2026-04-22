import Link from "next/link";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PanelCard from "@/components/ui/panel-card";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import ContinueWhereLeftOffPanel from "@/components/admin/continue-where-left-off-panel";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";

type ProfileRow = {
  id: string;
  is_admin: boolean;
  is_teacher: boolean;
};

type AccessGrantRow = {
  user_id: string;
  is_active: boolean;
};

type AdminNavCard = {
  title: string;
  description: string;
  href: string;
  badge?: React.ReactNode;
  ctaLabel: string;
};

function AdminLinkCard({ title, description, href, badge, ctaLabel }: AdminNavCard) {
  return (
    <Link href={href} className="block h-full">
      <PanelCard
        title={title}
        description={description}
        density="compact"
        className="h-full min-h-[162px] transition-transform duration-200 hover:-translate-y-0.5"
        headerClassName="min-h-[92px]"
        actions={badge}
        footer={
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm app-text-muted">{ctaLabel}</div>
            <Button variant="quiet" size="sm" icon="next" ariaLabel={ctaLabel} iconOnly />
          </div>
        }
      />
    </Link>
  );
}

export default async function AdminPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const supabase = await createClient();

  const [
    { count: courseCount },
    { count: variantCount },
    { count: moduleCount },
    { count: lessonCount },
    { count: teachingGroupCount },
    { data: profiles },
    { data: accessGrants },
  ] = await Promise.all([
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("course_variants").select("*", { count: "exact", head: true }),
    supabase.from("modules").select("*", { count: "exact", head: true }),
    supabase.from("lessons").select("*", { count: "exact", head: true }),
    supabase.from("teaching_groups").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("id, is_admin, is_teacher"),
    supabase.from("user_access_grants").select("user_id, is_active"),
  ]);

  const profileRows = (profiles ?? []) as ProfileRow[];
  const accessGrantRows = (accessGrants ?? []) as AccessGrantRow[];

  const activeGrantUserIds = new Set(
    accessGrantRows.filter((grant) => grant.is_active).map((grant) => grant.user_id)
  );

  const studentProfiles = profileRows.filter(
    (profile) => !profile.is_admin && !profile.is_teacher
  );

  const teacherProfiles = profileRows.filter(
    (profile) => profile.is_admin || profile.is_teacher
  );

  const activeStudents = studentProfiles.filter((profile) =>
    activeGrantUserIds.has(profile.id)
  ).length;

  const inactiveStudents = studentProfiles.filter(
    (profile) => !activeGrantUserIds.has(profile.id)
  ).length;

  const managementCards: AdminNavCard[] = [
    {
      title: "Content",
      description: "Manage courses, variants, modules, and lessons.",
      href: "/admin/content",
      badge: <Badge tone="info">Primary workflow</Badge>,
      ctaLabel: "Manage content",
    },
    {
      title: "Question Sets",
      description: "Build and organise reusable question sets.",
      href: "/admin/question-sets",
      ctaLabel: "View question sets",
    },
    {
      title: "Templates",
      description: "Manage reusable question set templates.",
      href: "/admin/question-sets/templates",
      ctaLabel: "Open templates",
    },
    {
      title: "Assignments",
      description: "Review and manage teacher assignments.",
      href: "/teacher/assignments",
      badge: <Badge tone="warning">Teaching flow</Badge>,
      ctaLabel: "Review assignments",
    },
  ];

  const peopleCards: AdminNavCard[] = [
    {
      title: "Teaching Groups",
      description: "View teaching groups, membership, and structure.",
      href: "/admin/teaching-groups",
      ctaLabel: "Open teaching groups",
    },
    {
      title: "Students",
      description: "View student accounts and access groupings.",
      href: "/admin/students",
      badge: <Badge tone="success">{studentProfiles.length} total</Badge>,
      ctaLabel: "View students",
    },
    {
      title: "Teachers",
      description: "View admin and teaching accounts.",
      href: "/admin/teachers",
      badge: <Badge tone="muted">{teacherProfiles.length} accounts</Badge>,
      ctaLabel: "View teachers",
    },
  ];

  return (
    <main className="space-y-3">
      <PageIntroPanel
        tone="admin"
        eyebrow="Admin workspace"
        title="Admin Panel"
        description="Internal content, user, teaching, and system management tools for the GCSE Russian Course Platform."
        badges={
          <>
            <Badge tone="info">Admin access</Badge>
            <Badge tone="muted">Platform management</Badge>
          </>
        }
        actions={
          <>
            <Button href="/admin/ui" variant="secondary" icon="uiLab">
              Open UI Lab
            </Button>
            <Button href="/admin/content" variant="primary" icon="courses">
              Manage content
            </Button>
          </>
        }
      >
        <div className="grid gap-3 md:grid-cols-3">
          <SummaryStatCard
            title="Courses"
            value={courseCount ?? 0}
            icon="courses"
            compact
            description="Top-level course entries."
          />
          <SummaryStatCard
            title="Teaching groups"
            value={teachingGroupCount ?? 0}
            icon="users"
            compact
            description="Structured teaching cohorts."
          />
          <SummaryStatCard
            title="Active students"
            value={activeStudents}
            icon="completed"
            tone="success"
            compact
            description="Students with active access."
          />
        </div>
      </PageIntroPanel>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.28fr)_minmax(340px,0.72fr)] xl:items-start">
        <div className="space-y-3">
          <PanelCard
            title="Management areas"
            description="Primary admin tools for content and teaching workflows."
            tone="brand"
            contentClassName="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              {managementCards.map((card) => (
                <AdminLinkCard key={card.href} {...card} />
              ))}
            </div>
          </PanelCard>

          <PanelCard
            title="Platform snapshot"
            description="Grouped overview of content structure and user access."
            tone="admin"
            contentClassName="space-y-4"
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <PanelCard
                title="Content structure"
                description="Core content totals across the platform."
                tone="muted"
                density="compact"
                contentClassName="space-y-3"
              >
                <div className="space-y-3">
                  <SummaryStatCard
                    title="Courses"
                    value={courseCount ?? 0}
                    icon="courses"
                    tone="brand"
                    compact
                    layout="inline"
                    description="Main course shells."
                  />
                  <SummaryStatCard
                    title="Variants"
                    value={variantCount ?? 0}
                    icon="file"
                    compact
                    layout="inline"
                    description="Access variants."
                  />
                  <SummaryStatCard
                    title="Modules"
                    value={moduleCount ?? 0}
                    icon="lessonContent"
                    compact
                    layout="inline"
                    description="Structured module sets."
                  />
                  <SummaryStatCard
                    title="Lessons"
                    value={lessonCount ?? 0}
                    icon="lessons"
                    compact
                    layout="inline"
                    description="Lesson records available."
                  />
                </div>
              </PanelCard>

              <PanelCard
                title="Users and access"
                description="People totals and current access state."
                tone="muted"
                density="compact"
                contentClassName="space-y-3"
              >
                <div className="space-y-3">
                  <SummaryStatCard
                    title="Students"
                    value={studentProfiles.length}
                    icon="user"
                    compact
                    layout="inline"
                    description="All student accounts."
                  />
                  <SummaryStatCard
                    title="Teachers / Admins"
                    value={teacherProfiles.length}
                    icon="users"
                    compact
                    layout="inline"
                    description="Elevated accounts."
                  />
                  <SummaryStatCard
                    title="Active students"
                    value={activeStudents}
                    icon="completed"
                    tone="success"
                    compact
                    layout="inline"
                    description="With active access."
                  />
                  <SummaryStatCard
                    title="Inactive students"
                    value={inactiveStudents}
                    icon="pending"
                    tone="warning"
                    compact
                    layout="inline"
                    description="Without active access."
                  />
                </div>
              </PanelCard>
            </div>
          </PanelCard>

          <PanelCard
            title="People and access"
            description="User visibility and quick links for account-focused admin work."
            tone="student"
            contentClassName="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <SummaryStatCard
                title="Students"
                value={studentProfiles.length}
                icon="user"
                compact
                description="All student accounts."
                badge={<Badge tone="success">{activeStudents} active</Badge>}
              />
              <SummaryStatCard
                title="Teachers / Admins"
                value={teacherProfiles.length}
                icon="users"
                compact
                description="Teaching and admin accounts."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {peopleCards.map((card) => (
                <AdminLinkCard key={card.href} {...card} />
              ))}
            </div>
          </PanelCard>
        </div>

        <div className="space-y-3">
          <ContinueWhereLeftOffPanel />

          <PanelCard
            title="Admin guidance"
            description="A simple recommended flow for common admin work."
            tone="muted"
            density="compact"
            contentClassName="space-y-3"
          >
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Start in content
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Courses, variants, modules, and lessons are the foundation of most admin
                work.
              </div>
              <div className="mt-3">
                <Button href="/admin/content" variant="soft" size="sm" icon="courses">
                  Manage content
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Then review teaching flow
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Keep assignments and teaching groups aligned with the current content
                structure.
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  href="/teacher/assignments"
                  variant="secondary"
                  size="sm"
                  icon="assignments"
                >
                  Assignments
                </Button>
                <Button
                  href="/admin/teaching-groups"
                  variant="secondary"
                  size="sm"
                  icon="users"
                >
                  Teaching groups
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Validate UI patterns before reuse
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Use the UI Lab to test shared styling patterns before introducing new
                one-off UI.
              </div>
              <div className="mt-3">
                <Button href="/admin/ui" variant="quiet" size="sm" icon="uiLab">
                  Open UI Lab
                </Button>
              </div>
            </div>
          </PanelCard>

          <PanelCard
            title="Design system shortcut"
            description="Shared premium patterns should be validated in the UI Lab before broader reuse."
            tone="student"
            density="compact"
            actions={
              <Button href="/admin/ui" variant="inverse" icon="next" iconPosition="right">
                Open UI Lab
              </Button>
            }
            contentClassName="space-y-3"
          >
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Shared premium blocks
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Page intro panels, stat cards, premium section panels, badges, buttons,
                forms, and navigation patterns.
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Best use
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Validate patterns in the UI Lab first, then reuse them in admin, student,
                and teacher pages.
              </div>
            </div>
          </PanelCard>

          <PanelCard
            title="Access state"
            description="Compact signals for account and teaching visibility."
            tone="muted"
            density="compact"
            contentClassName="space-y-3"
          >
            <SummaryStatCard
              title="Teaching groups"
              value={teachingGroupCount ?? 0}
              icon="users"
              compact
              layout="inline"
              description="Current teaching group structures."
            />

            <SummaryStatCard
              title="Inactive students"
              value={inactiveStudents}
              icon="pending"
              tone={inactiveStudents > 0 ? "warning" : "success"}
              compact
              layout="inline"
              description={
                inactiveStudents > 0
                  ? "Students currently without active access."
                  : "All student accounts currently have active access."
              }
            />

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Recommended next step
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Review student and teaching-group pages when account structure or access
                state changes.
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button href="/admin/students" variant="secondary" size="sm" icon="user">
                  View students
                </Button>
                <Button
                  href="/admin/teaching-groups"
                  variant="secondary"
                  size="sm"
                  icon="users"
                >
                  Teaching groups
                </Button>
              </div>
            </div>
          </PanelCard>
        </div>
      </div>
    </main>
  );
}

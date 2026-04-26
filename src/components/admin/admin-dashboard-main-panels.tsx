import Badge from "@/components/ui/badge";
import PanelCard from "@/components/ui/panel-card";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import type { AdminDashboardSummary } from "@/lib/admin/dashboard-summary";

import AdminLinkCard, { type AdminNavCard } from "./admin-link-card";

export default function AdminDashboardMainPanels({
  summary,
}: {
  summary: AdminDashboardSummary;
}) {
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
      badge: <Badge tone="success">{summary.studentCount} total</Badge>,
      ctaLabel: "View students",
    },
    {
      title: "Teachers",
      description: "View admin and teaching accounts.",
      href: "/admin/teachers",
      badge: <Badge tone="muted">{summary.teacherCount} accounts</Badge>,
      ctaLabel: "View teachers",
    },
  ];

  return (
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
            headingLevel={3}
            tone="muted"
            density="compact"
            contentClassName="space-y-3"
          >
            <div className="space-y-3">
              <SummaryStatCard
                title="Courses"
                value={summary.courseCount}
                icon="courses"
                tone="brand"
                compact
                layout="inline"
                description="Main course shells."
              />
              <SummaryStatCard
                title="Variants"
                value={summary.variantCount}
                icon="file"
                compact
                layout="inline"
                description="Access variants."
              />
              <SummaryStatCard
                title="Modules"
                value={summary.moduleCount}
                icon="lessonContent"
                compact
                layout="inline"
                description="Structured module sets."
              />
              <SummaryStatCard
                title="Lessons"
                value={summary.lessonCount}
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
            headingLevel={3}
            tone="muted"
            density="compact"
            contentClassName="space-y-3"
          >
            <div className="space-y-3">
              <SummaryStatCard
                title="Students"
                value={summary.studentCount}
                icon="user"
                compact
                layout="inline"
                description="All student accounts."
              />
              <SummaryStatCard
                title="Teachers / Admins"
                value={summary.teacherCount}
                icon="users"
                compact
                layout="inline"
                description="Elevated accounts."
              />
              <SummaryStatCard
                title="Active students"
                value={summary.activeStudents}
                icon="completed"
                tone="success"
                compact
                layout="inline"
                description="With active access."
              />
              <SummaryStatCard
                title="Inactive students"
                value={summary.inactiveStudents}
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
            value={summary.studentCount}
            icon="user"
            compact
            description="All student accounts."
            badge={<Badge tone="success">{summary.activeStudents} active</Badge>}
          />
          <SummaryStatCard
            title="Teachers / Admins"
            value={summary.teacherCount}
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
  );
}

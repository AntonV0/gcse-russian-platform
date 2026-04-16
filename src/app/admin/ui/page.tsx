import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import StatusBadge from "@/components/ui/status-badge";
import AppIcon from "@/components/ui/app-icon";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { appIcons } from "@/lib/shared/icons";
import AllIconsBrowser from "@/components/admin/all-icons-browser";
import SectionCard from "@/components/ui/section-card";

const iconPreviewGroups = [
  {
    title: "Navigation",
    items: [
      { name: "dashboard", label: "Dashboard" },
      { name: "courses", label: "Courses" },
      { name: "lessons", label: "Lessons" },
      { name: "assignments", label: "Assignments" },
      { name: "settings", label: "Settings" },
      { name: "user", label: "User" },
      { name: "users", label: "Users" },
      { name: "uiLab", label: "UI Lab" },
    ] as const,
  },
  {
    title: "Lesson / Content",
    items: [
      { name: "lessonContent", label: "Lesson content" },
      { name: "translation", label: "Translation" },
      { name: "listening", label: "Listening" },
      { name: "audio", label: "Audio" },
      { name: "vocabulary", label: "Vocabulary" },
      { name: "image", label: "Image" },
      { name: "file", label: "File" },
      { name: "help", label: "Help" },
      { name: "modules", label: "Modules" },
      { name: "blocks", label: "Blocks" },
      { name: "language", label: "Language" },
      { name: "question", label: "Question" },
      { name: "exercise", label: "Exercise" },
      { name: "text", label: "Text" },
      { name: "speaking", label: "Speaking" },
      { name: "learning", label: "Learning" },
      { name: "school", label: "School" },
      { name: "brain", label: "Brain" },
      { name: "idea", label: "Idea" },
    ] as const,
  },
  {
    title: "Status / Actions",
    items: [
      { name: "completed", label: "Completed" },
      { name: "pending", label: "Pending" },
      { name: "locked", label: "Locked" },
      { name: "unlocked", label: "Unlocked" },
      { name: "search", label: "Search" },
      { name: "filter", label: "Filter" },
      { name: "preview", label: "Preview" },
      { name: "hidden", label: "Hidden" },
      { name: "edit", label: "Edit" },
      { name: "write", label: "Write" },
      { name: "create", label: "Create" },
      { name: "save", label: "Save" },
      { name: "delete", label: "Delete" },
      { name: "back", label: "Back" },
      { name: "next", label: "Next" },
      { name: "up", label: "Up" },
      { name: "down", label: "Down" },
      { name: "warning", label: "Warning" },
      { name: "info", label: "Info" },
      { name: "alert", label: "Alert" },
      { name: "refresh", label: "Refresh" },
    ] as const,
  },
];

function ButtonPreview({
  label,
  variant,
  iconName,
}: {
  label: string;
  variant: "primary" | "secondary" | "quiet" | "success" | "warning" | "danger";
  iconName?: keyof typeof appIcons;
}) {
  const Icon = iconName ? appIcons[iconName] : undefined;

  return (
    <div className="space-y-2 rounded-xl border bg-gray-50 p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <Button type="button" variant={variant} icon={Icon}>
        {label}
      </Button>
    </div>
  );
}

function IconPreviewCard({
  iconName,
  label,
}: {
  iconName: keyof typeof appIcons;
  label: string;
}) {
  const Icon = appIcons[iconName];

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-400">{iconName}</div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2">
          <AppIcon icon={Icon} size={16} />
          <span className="text-xs text-gray-500">16</span>
        </div>

        <div className="flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2">
          <AppIcon icon={Icon} size={20} />
          <span className="text-xs text-gray-500">20</span>
        </div>

        <div className="flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2">
          <AppIcon icon={Icon} size={24} />
          <span className="text-xs text-gray-500">24</span>
        </div>

        <div className="flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2">
          <AppIcon icon={Icon} size={20} strokeWidth={1.5} />
          <span className="text-xs text-gray-500">1.5</span>
        </div>

        <div className="flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2">
          <AppIcon icon={Icon} size={20} strokeWidth={1.75} />
          <span className="text-xs text-gray-500">1.75</span>
        </div>

        <div className="flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2">
          <AppIcon icon={Icon} size={20} strokeWidth={2} />
          <span className="text-xs text-gray-500">2</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Badge icon={Icon}>Neutral</Badge>
        <span className="inline-flex items-center gap-2 rounded-lg border bg-black px-3 py-2 text-sm text-white">
          <AppIcon icon={Icon} size={18} />
          <span>Dark surface</span>
        </span>
        <Badge tone="success" icon={Icon}>
          Status usage
        </Badge>
      </div>
    </div>
  );
}

function RecommendedIconBuckets() {
  return (
    <SectionCard
      title="Recommended extra icon areas"
      description="Good candidates for future UI use across course content, GCSE topics, lesson blocks, and admin tools."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-gray-50 p-4">
          <div className="mb-2 font-medium">Course structure</div>
          <div className="space-y-1 text-sm text-gray-600">
            <p>courses</p>
            <p>modules</p>
            <p>lessons</p>
            <p>blocks</p>
            <p>folder / folderOpen</p>
          </div>
        </div>

        <div className="rounded-2xl border bg-gray-50 p-4">
          <div className="mb-2 font-medium">Learning modes</div>
          <div className="space-y-1 text-sm text-gray-600">
            <p>translation</p>
            <p>listening</p>
            <p>speaking</p>
            <p>audio</p>
            <p>question / exercise</p>
          </div>
        </div>

        <div className="rounded-2xl border bg-gray-50 p-4">
          <div className="mb-2 font-medium">GCSE-style content</div>
          <div className="space-y-1 text-sm text-gray-600">
            <p>language</p>
            <p>learning</p>
            <p>school</p>
            <p>brain</p>
            <p>idea</p>
          </div>
        </div>

        <div className="rounded-2xl border bg-gray-50 p-4">
          <div className="mb-2 font-medium">Admin utilities</div>
          <div className="space-y-1 text-sm text-gray-600">
            <p>save</p>
            <p>refresh</p>
            <p>warning / alert</p>
            <p>hidden / preview</p>
            <p>filter / search</p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

export default async function AdminUiPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <main className="space-y-8">
      <PageHeader
        title="UI Lab"
        description="Internal preview page for buttons, badges, cards, and Lucide icons before using them in the platform."
      />

      <SectionCard
        title="Style direction"
        description="A restrained, modern baseline aimed at a clean Apple-like feel: monochrome surfaces, subtle borders, rounded corners, limited color accents, and light icon usage."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border bg-gray-50 p-4">
            <div className="mb-2 text-sm font-semibold">Recommended defaults</div>
            <div className="space-y-1 text-sm text-gray-600">
              <p>20px icons for most UI</p>
              <p>18px for dense admin rows</p>
              <p>Stroke width 1.75 by default</p>
              <p>Monochrome first, color only for status</p>
            </div>
          </div>

          <div className="rounded-2xl border bg-gray-50 p-4">
            <div className="mb-2 text-sm font-semibold">Good fit for</div>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Admin navigation</p>
              <p>Lesson block labels</p>
              <p>Status indicators</p>
              <p>Action buttons</p>
            </div>
          </div>

          <div className="rounded-2xl border bg-gray-50 p-4">
            <div className="mb-2 text-sm font-semibold">Avoid overusing</div>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Icons on every button</p>
              <p>Bright icon colors everywhere</p>
              <p>Heavy emoji use in core UI</p>
              <p>Mixed icon packs</p>
            </div>
          </div>
        </div>
      </SectionCard>

      <RecommendedIconBuckets />

      <SectionCard
        title="Button previews"
        description="Start with a small, consistent button language before rolling anything out more widely."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ButtonPreview label="Primary" variant="primary" iconName="next" />
          <ButtonPreview label="Secondary" variant="secondary" iconName="edit" />
          <ButtonPreview label="Quiet" variant="quiet" iconName="search" />
          <ButtonPreview label="Success" variant="success" iconName="completed" />
          <ButtonPreview label="Warning" variant="warning" iconName="pending" />
          <ButtonPreview label="Danger" variant="danger" iconName="delete" />
        </div>
      </SectionCard>

      <SectionCard
        title="Badges and states"
        description="Quick preview of simple state treatments already close to your current admin style."
      >
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status="not_started" />
          <StatusBadge status="submitted" />
          <StatusBadge status="reviewed" />
          <StatusBadge status="returned" />

          <Badge tone="muted" icon={appIcons.pending}>
            Draft
          </Badge>

          <Badge tone="success" icon={appIcons.completed}>
            Published
          </Badge>

          <Badge tone="info" icon={appIcons.translation}>
            Translation
          </Badge>
        </div>
      </SectionCard>

      <SectionCard
        title="Card previews"
        description="Check how icons sit inside the cards you already use around the admin area."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DashboardCard title="Lessons">
            <div className="flex items-start gap-3">
              <AppIcon icon={appIcons.lessons} className="mt-0.5 text-gray-700" />
              <div>Manage lesson structure, blocks, and publishing status.</div>
            </div>
          </DashboardCard>

          <DashboardCard title="Question Sets">
            <div className="flex items-start gap-3">
              <AppIcon icon={appIcons.help} className="mt-0.5 text-gray-700" />
              <div>Create reusable question sets and review their setup.</div>
            </div>
          </DashboardCard>

          <DashboardCard title="Teaching Groups">
            <div className="flex items-start gap-3">
              <AppIcon icon={appIcons.users} className="mt-0.5 text-gray-700" />
              <div>
                Preview how small icons feel inside existing admin dashboard cards.
              </div>
            </div>
          </DashboardCard>
        </div>
      </SectionCard>

      <div className="space-y-6">
        {iconPreviewGroups.map((group) => (
          <SectionCard
            key={group.title}
            title={group.title}
            description="Compare size, stroke, and usage before picking your final set."
          >
            <div className="grid gap-4 lg:grid-cols-2">
              {group.items.map((item) => (
                <IconPreviewCard
                  key={item.name}
                  iconName={item.name}
                  label={item.label}
                />
              ))}
            </div>
          </SectionCard>
        ))}
      </div>

      <SectionCard
        title="All Lucide Icons"
        description="A full browseable grid of Lucide icons for fast scanning before choosing what to add to the curated app icon set."
      >
        <AllIconsBrowser />
      </SectionCard>

      <SectionCard
        title="Recommended first picks"
        description="A sensible starter set for the rest of the platform."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <AppIcon icon={appIcons.lessons} />
              <span className="font-medium">Lessons</span>
            </div>
            <p className="text-sm text-gray-600">Use for course and lesson navigation.</p>
          </div>

          <div className="rounded-2xl border bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <AppIcon icon={appIcons.assignments} />
              <span className="font-medium">Assignments</span>
            </div>
            <p className="text-sm text-gray-600">
              Clean fit for homework and teacher flows.
            </p>
          </div>

          <div className="rounded-2xl border bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <AppIcon icon={appIcons.translation} />
              <span className="font-medium">Translation</span>
            </div>
            <p className="text-sm text-gray-600">
              Strong match for GCSE Russian exercise types.
            </p>
          </div>

          <div className="rounded-2xl border bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <AppIcon icon={appIcons.completed} />
              <span className="font-medium">Completed</span>
            </div>
            <p className="text-sm text-gray-600">
              Good default for progress and success states.
            </p>
          </div>
        </div>
      </SectionCard>
    </main>
  );
}

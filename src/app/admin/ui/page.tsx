import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import StatusBadge from "@/components/ui/status-badge";
import AppIcon from "@/components/ui/app-icon";
import { requireAdminAccess } from "@/lib/admin-auth";
import { appIcons } from "@/lib/icons";

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
      { name: "edit", label: "Edit" },
      { name: "write", label: "Write" },
      { name: "delete", label: "Delete" },
      { name: "back", label: "Back" },
      { name: "next", label: "Next" },
    ] as const,
  },
];

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-black">{title}</h2>
        {description ? <p className="mt-1 text-sm text-gray-600">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function ButtonPreview({
  label,
  className,
  iconName,
}: {
  label: string;
  className: string;
  iconName?: keyof typeof appIcons;
}) {
  const Icon = iconName ? appIcons[iconName] : null;

  return (
    <div className="space-y-2 rounded-xl border bg-gray-50 p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <button type="button" className={className}>
        {Icon ? <AppIcon icon={Icon} size={18} /> : null}
        <span>{label}</span>
      </button>
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
        <div className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-gray-700">
          <AppIcon icon={Icon} size={18} />
          <span>Neutral</span>
        </div>

        <div className="inline-flex items-center gap-2 rounded-lg border bg-black px-3 py-2 text-sm text-white">
          <AppIcon icon={Icon} size={18} />
          <span>Dark surface</span>
        </div>

        <div className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          <AppIcon icon={Icon} size={18} />
          <span>Status usage</span>
        </div>
      </div>
    </div>
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

      <SectionCard
        title="Button previews"
        description="Start with a small, consistent button language before rolling anything out more widely."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ButtonPreview
            label="Primary"
            iconName="next"
            className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          />

          <ButtonPreview
            label="Secondary"
            iconName="edit"
            className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-gray-50"
          />

          <ButtonPreview
            label="Quiet"
            iconName="search"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          />

          <ButtonPreview
            label="Success"
            iconName="completed"
            className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-800 transition hover:bg-green-100"
          />

          <ButtonPreview
            label="Warning"
            iconName="pending"
            className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-800 transition hover:bg-amber-100"
          />

          <ButtonPreview
            label="Danger"
            iconName="delete"
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
          />
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

          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700">
            <AppIcon icon={appIcons.pending} size={14} />
            Draft
          </span>

          <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs text-green-700">
            <AppIcon icon={appIcons.completed} size={14} />
            Published
          </span>

          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700">
            <AppIcon icon={appIcons.translation} size={14} />
            Translation
          </span>
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

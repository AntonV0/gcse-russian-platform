import { requireAdminAccess } from "@/lib/auth/admin-auth";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import AllIconsBrowser from "@/components/admin/all-icons-browser";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import { appIcons } from "@/lib/shared/icons";

const curatedGroups = [
  {
    title: "Navigation",
    icons: ["dashboard", "courses", "back", "next", "menu", "settings"] as const,
  },
  {
    title: "Learning",
    icons: ["lessons", "audio", "translation", "question", "completed"] as const,
  },
  {
    title: "Status",
    icons: ["completed", "pending", "warning", "info", "locked"] as const,
  },
];

export default async function AdminUiIconsPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Icons"
      description="Use this page to choose icons consistently before applying them across the platform."
      currentPath="/admin/ui/icons"
    >
      <UiLabSection
        title="Curated app icon set"
        description="These are the icons most likely to appear in production UI."
      >
        <div className="space-y-6">
          {curatedGroups.map((group) => (
            <div key={group.title}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-semibold">{group.title}</h3>
                <Badge tone="muted">{group.icons.length} icons</Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
                {group.icons.map((key) => (
                  <div key={key} className="app-card p-4 text-center">
                    <div className="mb-3 flex justify-center">
                      <AppIcon
                        icon={appIcons[key]}
                        size={20}
                        className="app-brand-text"
                      />
                    </div>
                    <div className="text-sm font-medium">{key}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </UiLabSection>

      <UiLabSection
        title="Full Lucide browser"
        description="Browse the full icon set when you need something new, but prefer the curated app icon set first."
      >
        <AllIconsBrowser />
      </UiLabSection>
    </UiLabShell>
  );
}

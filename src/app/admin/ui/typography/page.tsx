import { requireAdminAccess } from "@/lib/auth/admin-auth";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";

export default async function AdminUiTypographyPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Typography"
      description="Reference page for heading hierarchy, body copy, labels, and supporting text."
      currentPath="/admin/ui/typography"
    >
      <UiLabSection
        title="Heading scale"
        description="Use real content examples rather than isolated type specimens where possible."
      >
        <div className="space-y-5">
          <div className="app-card p-5">
            <div className="app-title">GCSE Russian Course Platform</div>
            <p className="mt-2 app-subtitle max-w-2xl">
              Premium online GCSE Russian learning with structured lessons, exam-focused
              practice, and progress tracking.
            </p>
          </div>

          <div className="app-card p-5">
            <h2 className="app-section-title text-lg">Section title example</h2>
            <p className="mt-2 text-sm app-text-muted">
              Good for section headers, cards with internal hierarchy, and reusable page
              subsections.
            </p>
          </div>

          <div className="app-card p-5">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Card heading example
            </h3>
            <p className="mt-2 text-sm app-text-muted">
              Good for cards, settings panels, and grouped content.
            </p>
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Body styles"
        description="These are the text styles most likely to be reused across app pages."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="app-card p-4">
            <div className="mb-2 font-semibold">Body / default</div>
            <p>
              This is the default body style. It should remain highly readable across both
              platform screens and admin views.
            </p>
          </div>

          <div className="app-card p-4">
            <div className="mb-2 font-semibold">Muted / supporting copy</div>
            <p className="app-text-muted">
              Use muted text for descriptive information, helper copy, and interface
              context rather than primary actions.
            </p>
          </div>

          <div className="app-card p-4">
            <div className="mb-2 font-semibold">Soft / secondary metadata</div>
            <p className="app-text-soft">
              Use soft text for low-priority metadata such as timestamps, technical
              labels, and non-essential details.
            </p>
          </div>

          <div className="app-card p-4">
            <div className="mb-2 font-semibold">Label text</div>
            <div className="app-label">Section status</div>
            <p className="mt-2 text-sm app-text-muted">
              Labels should be short, clear, and not compete with section titles.
            </p>
          </div>
        </div>
      </UiLabSection>
    </UiLabShell>
  );
}

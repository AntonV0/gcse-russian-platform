import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import DevComponentMarker from "@/components/ui/dev-component-marker";

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function SiteFooter() {
  return (
    <footer className="dev-marker-host relative border-t border-[var(--border)] bg-[var(--background-elevated)]">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="SiteFooter"
          filePath="src/components/layout/site-footer.tsx"
          tier="layout"
          componentRole="Site footer and secondary navigation"
          bestFor="Public/course site footer links, brand context, build notices, and secondary navigation."
          usageExamples={[
            "Homepage footer",
            "Pricing page footer",
            "Public course information pages",
            "Account/course navigation footer",
          ]}
          notes="Use at the site layout boundary. Keep footer content minimal until the public marketing site is finalised."
        />
      ) : null}

      <div className="app-page px-6 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="app-brand-lockup">
              <span className="app-brand-mark">
                <AppIcon icon="school" size={17} className="app-brand-text" />
              </span>

              <span className="font-semibold text-[var(--text-primary)]">
                GCSE Russian
              </span>
            </div>

            <p className="max-w-xl text-sm app-text-muted">
              Structured GCSE Russian learning for Pearson Edexcel 1RU0.
            </p>

            <p className="text-xs app-text-soft">Private development build</p>
          </div>

          <nav className="app-footer-link-row text-sm" aria-label="Footer navigation">
            <Link href="/courses" className="app-nav-link">
              Courses
            </Link>
            <Link href="/dashboard" className="app-nav-link">
              Dashboard
            </Link>
            <Link href="/account" className="app-nav-link">
              Account
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

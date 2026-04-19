import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import { appIcons } from "@/lib/shared/icons";

export default function SiteFooter() {
  return (
    <footer className="mt-14 border-t border-[var(--border)] bg-[var(--background-elevated)]">
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

          <nav className="app-footer-link-row text-sm">
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

import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import { appIcons } from "@/lib/icons";

export default function SiteFooter() {
  return (
    <footer className="mt-14 border-t border-[var(--border)] bg-[var(--background-elevated)]">
      <div className="app-page flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AppIcon icon={appIcons.school} size={18} className="app-brand-text" />
            <span className="font-semibold text-[var(--text-primary)]">GCSE Russian</span>
          </div>

          <p className="max-w-xl text-sm app-text-muted">
            Structured GCSE Russian learning for Pearson Edexcel 1RU0.
          </p>

          <p className="text-xs app-text-soft">Private development build</p>
        </div>

        <nav className="flex flex-wrap gap-4 text-sm">
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
    </footer>
  );
}

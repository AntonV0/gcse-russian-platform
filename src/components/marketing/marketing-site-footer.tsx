import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";

const footerLinks = [
  { href: "/marketing/gcse-russian-course", label: "Course" },
  { href: "/marketing/edexcel-gcse-russian", label: "Edexcel guide" },
  { href: "/marketing/gcse-russian-exam-guide", label: "Exam guide" },
  { href: "/marketing/russian-gcse-private-candidate", label: "Private candidates" },
  { href: "/marketing/online-gcse-russian-lessons", label: "Online lessons" },
  { href: "/marketing/pricing", label: "Pricing" },
  { href: "/marketing/about", label: "About" },
  { href: "/marketing/faq", label: "FAQ" },
  { href: "/login", label: "Log in" },
];

export default function MarketingSiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background-elevated)]">
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
          </div>

          <nav className="app-footer-link-row text-sm" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="app-nav-link">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

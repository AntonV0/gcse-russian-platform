import Link from "next/link";
import AppLogo from "@/components/ui/app-logo";
import Button from "@/components/ui/button";

const CURRENT_YEAR = 2026;

const footerGroups = [
  {
    title: "Course",
    links: [
      { href: "/gcse-russian-course", label: "Course overview" },
      { href: "/pricing", label: "Pricing" },
      { href: "/gcse-russian-foundation-tier", label: "Foundation" },
      { href: "/gcse-russian-higher-tier", label: "Higher" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/resources", label: "All resources" },
      { href: "/gcse-russian-past-papers", label: "Past papers" },
      { href: "/gcse-russian-revision", label: "Revision" },
      { href: "/gcse-russian-grammar", label: "Grammar" },
      { href: "/gcse-russian-vocabulary", label: "Vocabulary" },
    ],
  },
  {
    title: "Exam Prep",
    links: [
      { href: "/edexcel-gcse-russian", label: "Edexcel guide" },
      { href: "/gcse-russian-exam-guide", label: "Exam guide" },
      { href: "/russian-gcse-private-candidate", label: "Private candidates" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/online-gcse-russian-lessons", label: "Online lessons" },
      { href: "/gcse-russian-tutor", label: "Tutor" },
      { href: "/gcse-russian-for-parents", label: "Parents" },
      { href: "/faq", label: "FAQ" },
      { href: "/support", label: "Contact support" },
    ],
  },
];

export default function MarketingSiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background-elevated)]">
      <div className="app-page px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(260px,0.9fr)_minmax(0,1.7fr)] lg:items-start">
          <div className="max-w-sm space-y-4">
            <AppLogo variant="domain" size="sm" />

            <p className="max-w-xl text-sm app-text-muted">
              Structured GCSE Russian learning for Pearson Edexcel 1RU0.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <Button href="/signup" variant="primary" size="sm" icon="create">
                Start trial
              </Button>
              <Button href="/login" variant="secondary" size="sm" icon="user">
                Log in
              </Button>
            </div>
          </div>

          <nav
            className="grid gap-x-8 gap-y-7 text-sm sm:grid-cols-2 lg:grid-cols-4"
            aria-label="Footer navigation"
          >
            {footerGroups.map((group) => (
              <div key={group.title} className="space-y-3.5">
                <div className="space-y-2">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                    {group.title}
                  </p>
                  <div
                    className="h-px w-full bg-[var(--border-subtle)]"
                    aria-hidden="true"
                  >
                    <div className="h-px w-10 rounded-full bg-[var(--accent-fill)]" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="app-nav-link w-fit"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-9 flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-5 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {CURRENT_YEAR} GCSE Russian</p>

          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/privacy" className="app-nav-link">
              Privacy
            </Link>
            <Link href="/terms" className="app-nav-link">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

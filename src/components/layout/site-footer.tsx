import Link from "next/link";
import AppLogo from "@/components/ui/app-logo";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import {
  getActiveCoursePath,
  getDashboardPath,
  getProgressPath,
  getTakingYourExamsPath,
} from "@/lib/access/routes";

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";
const CURRENT_YEAR = 2026;

type SiteFooterProps = {
  user?: {
    variant?: "foundation" | "higher" | "volna" | null;
  } | null;
};

export default function SiteFooter({ user }: SiteFooterProps) {
  const footerLinks = [
    { href: getDashboardPath(), label: "Dashboard" },
    { href: getActiveCoursePath(user?.variant), label: "My Course" },
    { href: getProgressPath(), label: "Progress" },
    { href: getTakingYourExamsPath(), label: "Taking Your Exams" },
    { href: "/support", label: "Support" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ];

  return (
    <footer
      data-site-footer
      className="dev-marker-host relative border-t border-[var(--border)] bg-[var(--background-elevated)]"
    >
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
            <AppLogo size="sm" />

            <p className="max-w-xl text-sm app-text-muted">
              Structured GCSE Russian learning for Pearson Edexcel 1RU0.
            </p>

            <p className="text-xs app-text-soft">
              © {CURRENT_YEAR} GCSE Russian
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

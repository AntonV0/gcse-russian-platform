import type { Metadata } from "next";
import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import SectionCard from "@/components/ui/section-card";
import MarketingBreadcrumbs from "@/components/marketing/marketing-breadcrumbs";
import { buildPublicMetadata } from "@/lib/seo/site";
import type { AppIconKey } from "@/lib/shared/icons";

export const metadata: Metadata = buildPublicMetadata({
  title: "Contact and Support",
  description:
    "Get help with GCSE Russian course access, accounts, billing, learning content, exam preparation, and Volna School enquiries.",
  path: "/support",
  ogTitle: "Contact and Support | GCSE Russian",
  ogDescription:
    "Support for GCSE Russian course access, accounts, billing, learning content, and exam preparation.",
});

const supportTopics = [
  {
    title: "Account and access",
    description:
      "Help with logging in, course access, trial accounts, billing, and route selection.",
    icon: "user",
  },
  {
    title: "Course content",
    description:
      "Questions about lessons, vocabulary, grammar, progress, mock exams, or past papers.",
    icon: "courses",
  },
  {
    title: "Exam preparation",
    description:
      "Questions about private candidate planning, speaking arrangements, and revision priorities.",
    icon: "exam",
  },
  {
    title: "Volna School",
    description:
      "Enquiries about online group classes, private tuition, and teacher-supported preparation.",
    icon: "school",
  },
] satisfies Array<{
  title: string;
  description: string;
  icon: AppIconKey;
}>;

const usefulLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/account/billing", label: "Billing", icon: "billing" },
  { href: "/taking-your-exams", label: "Taking Your Exams", icon: "exam" },
  { href: "/faq", label: "FAQ", icon: "help" },
] satisfies Array<{ href: string; label: string; icon: AppIconKey }>;

export default function SupportPage() {
  return (
    <>
      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "Support", href: "/support" },
        ]}
      />

      <div className="space-y-10 py-8 md:py-12">
        <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <Badge tone="info" icon="help">
              Contact and support
            </Badge>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-[var(--text-primary)] md:text-5xl">
              Get help with GCSE Russian.
            </h1>
            <p className="mt-4 text-base leading-7 text-[var(--text-secondary)] md:text-lg">
              Use this page for account help, course access, learning questions, exam
              preparation enquiries, and Volna School support.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="mailto:support@gcserussian.com" variant="primary" icon="chat">
                Email support
              </Button>
              <Button href="/faq" variant="secondary" icon="help">
                Read FAQ
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {supportTopics.map((topic) => (
            <div
              key={topic.title}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-5 shadow-[var(--shadow-sm)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
                <AppIcon icon={topic.icon} size={20} />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-[var(--text-primary)]">
                {topic.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                {topic.description}
              </p>
            </div>
          ))}
        </section>

        <SectionCard
          title="Useful links"
          description="These pages usually solve the most common support questions."
          tone="muted"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {usefulLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--border-strong)] hover:text-[var(--accent-ink)]"
              >
                <AppIcon icon={link.icon} size={17} />
                {link.label}
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}

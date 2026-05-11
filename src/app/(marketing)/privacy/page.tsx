import type { Metadata } from "next";
import Link from "next/link";
import Badge from "@/components/ui/badge";
import SectionCard from "@/components/ui/section-card";
import MarketingBreadcrumbs from "@/components/marketing/marketing-breadcrumbs";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "Privacy Notice",
  description:
    "Privacy information for GCSE Russian students, parents, account holders, and visitors.",
  path: "/privacy",
  ogTitle: "Privacy Notice | GCSE Russian",
  ogDescription:
    "How GCSE Russian uses personal information for accounts, course access, support, payments, and learning progress.",
});

const lastUpdated = "8 May 2026";

const dataTypes = [
  "Account details, such as name, email address, login information, and profile settings.",
  "Course access information, such as trial, Foundation, Higher, Volna, or billing status.",
  "Learning activity, such as lesson progress, mock exam attempts, answers, feedback, and assignment activity.",
  "Support messages and enquiries sent to GCSE Russian or Volna School.",
  "Technical information needed to run and protect the website, such as device, browser, and security logs.",
  "Payment and subscription information processed through payment providers. GCSE Russian does not store full card details.",
];

const purposes = [
  "Create and manage accounts.",
  "Provide course access, lessons, practice, progress tracking, mock exams, and account features.",
  "Respond to support enquiries and manage Volna School enquiries.",
  "Administer billing, subscriptions, refunds, and payment-related records.",
  "Protect the platform, prevent misuse, debug issues, and improve the learning experience.",
  "Meet legal, tax, accounting, and regulatory responsibilities.",
];

const rights = [
  "Ask for a copy of personal information held about you.",
  "Ask for inaccurate information to be corrected.",
  "Ask for information to be deleted where the law allows.",
  "Ask for use of information to be restricted or object to certain uses.",
  "Withdraw consent where consent is the lawful basis for a specific use.",
  "Complain to the relevant data protection authority if you are unhappy with how your information is handled.",
];

function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-sm leading-6 text-[var(--text-secondary)]">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-fill)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "Privacy", href: "/privacy" },
        ]}
      />

      <div className="space-y-8 py-8 md:py-12">
        <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8 lg:p-10">
          <Badge tone="info" icon="lock">
            Privacy
          </Badge>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-[var(--text-primary)] md:text-5xl">
            Privacy notice
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--text-secondary)]">
            This notice explains how GCSE Russian handles personal information when
            people use the website, create an account, access course content, contact
            support, or use Volna School related services.
          </p>
          <p className="mt-4 text-sm app-text-muted">Last updated: {lastUpdated}</p>
        </section>

        <SectionCard title="Who this notice is for" tone="muted">
          <div className="space-y-4 text-sm leading-6 text-[var(--text-secondary)]">
            <p>
              This notice is for students, parents or guardians, teachers, Volna School
              learners, account holders, and visitors to GCSE Russian.
            </p>
            <p>
              If a child uses the platform, a parent or guardian should review this
              notice with them and contact support with any questions.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          title="Information we may collect"
          description="The exact information depends on how you use the website and course platform."
        >
          <LegalList items={dataTypes} />
        </SectionCard>

        <SectionCard title="How we use information">
          <LegalList items={purposes} />
        </SectionCard>

        <SectionCard title="Who information may be shared with">
          <div className="space-y-4 text-sm leading-6 text-[var(--text-secondary)]">
            <p>
              Information may be shared with service providers that help run the
              platform, such as hosting, authentication, database, payment, email,
              analytics, and support tools. These providers should only use information
              as needed to provide their services.
            </p>
            <p>
              GCSE Russian does not sell personal information. Information may also be
              shared where required by law, to protect the platform, or to deal with a
              legal or safety issue.
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Retention">
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            Information is kept for as long as needed to provide the platform, support
            accounts, keep learning and billing records, meet legal obligations, resolve
            disputes, and protect the service. Some records may need to be kept after an
            account closes, for example payment, tax, security, or support records.
          </p>
        </SectionCard>

        <SectionCard title="Your rights">
          <LegalList items={rights} />
        </SectionCard>

        <SectionCard title="Contact">
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            For privacy questions or account-data requests, email{" "}
            <Link
              href="mailto:support@gcserussian.com"
              className="font-semibold text-[var(--accent-ink)] underline-offset-4 hover:underline"
            >
              support@gcserussian.com
            </Link>
            .
          </p>
        </SectionCard>
      </div>
    </>
  );
}

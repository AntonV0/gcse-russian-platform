import type { Metadata } from "next";
import Link from "next/link";
import Badge from "@/components/ui/badge";
import SectionCard from "@/components/ui/section-card";
import MarketingBreadcrumbs from "@/components/marketing/marketing-breadcrumbs";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "Terms of Use",
  description:
    "Terms for using GCSE Russian, including course access, account use, learning content, payments, and platform boundaries.",
  path: "/terms",
  ogTitle: "Terms of Use | GCSE Russian",
  ogDescription:
    "Terms for using GCSE Russian course access, learning content, accounts, payments, and platform features.",
});

const lastUpdated = "8 May 2026";

const accountTerms = [
  "Use accurate account information and keep login details secure.",
  "Do not share a paid account with other students unless GCSE Russian has agreed this in writing.",
  "Tell support if you think someone else has access to your account.",
  "Students should use the platform with parent or guardian awareness where appropriate, and parent or guardian contact details may be requested or stored for account support.",
];

const acceptableUse = [
  "Do not copy, scrape, resell, publish, or redistribute course materials.",
  "Do not try to access admin, teacher, or student areas you are not allowed to use.",
  "Do not try to use the platform to contact other students.",
  "Do not upload harmful, unlawful, misleading, or abusive content.",
  "Do not interfere with the security, availability, or normal use of the platform.",
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

export default function TermsPage() {
  return (
    <>
      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "Terms", href: "/terms" },
        ]}
      />

      <div className="space-y-8 py-8 md:py-12">
        <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8 lg:p-10">
          <Badge tone="info" icon="info">
            Terms
          </Badge>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-[var(--text-primary)] md:text-5xl">
            Terms of use
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--text-secondary)]">
            These terms explain the basic rules for using GCSE Russian, including course
            access, accounts, learning content, payments, and support features.
          </p>
          <p className="mt-4 text-sm app-text-muted">Last updated: {lastUpdated}</p>
        </section>

        <SectionCard title="Using GCSE Russian" tone="muted">
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            GCSE Russian provides structured learning and exam-preparation content for
            Pearson Edexcel GCSE Russian. It is an independent learning platform and is
            not Pearson, Edexcel, or an exam centre.
          </p>
        </SectionCard>

        <SectionCard title="Accounts">
          <LegalList items={accountTerms} />
        </SectionCard>

        <SectionCard title="Course access and payments">
          <div className="space-y-4 text-sm leading-6 text-[var(--text-secondary)]">
            <p>
              Some content may be free, trial-only, paid, or restricted to Volna School
              learners, teachers, or admins. Access may depend on your course variant,
              subscription, grant, or school arrangement.
            </p>
            <p>
              Payments, subscriptions, refunds, and billing features may be handled by
              third-party payment providers. Any specific refund or cancellation terms
              shown during checkout or billing apply alongside these terms.
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Learning content and exam information">
          <div className="space-y-4 text-sm leading-6 text-[var(--text-secondary)]">
            <p>
              Course content is designed to support GCSE Russian preparation, but it does
              not guarantee a particular grade, exam result, centre acceptance, speaking
              examiner availability, or private-candidate arrangement.
            </p>
            <p>
              Students and families should check official Pearson Edexcel information and
              their school, college, or exam centre for formal exam-entry rules,
              deadlines, fees, and speaking-test arrangements.
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Acceptable use">
          <LegalList items={acceptableUse} />
        </SectionCard>

        <SectionCard title="Communication boundaries">
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            GCSE Russian may support teacher-controlled assignment, feedback, and
            support workflows. It does not provide student-to-student communication
            features.
          </p>
        </SectionCard>

        <SectionCard title="Intellectual property">
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            The platform design, course structure, lessons, explanations, practice
            materials, and original resources belong to GCSE Russian or its licensors.
            Access lets you use the materials for personal study or agreed teaching use,
            not for copying, resale, or redistribution.
          </p>
        </SectionCard>

        <SectionCard title="Changes and availability">
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            GCSE Russian may update content, features, pricing, access rules, and these
            terms over time. The platform may occasionally be unavailable for maintenance,
            security, provider issues, or technical problems.
          </p>
        </SectionCard>

        <SectionCard title="Contact">
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            For questions about these terms, email{" "}
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

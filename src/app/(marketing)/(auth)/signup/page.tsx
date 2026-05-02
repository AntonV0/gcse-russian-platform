import type { Metadata } from "next";
import SignUpForm from "@/components/auth/signup-form";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import { buildPublicMetadata, noIndexRobots } from "@/lib/seo/site";
import type { AppIconKey } from "@/lib/shared/icons";

export const metadata: Metadata = {
  ...buildPublicMetadata({
    title: "Create a GCSE Russian Trial Account",
    description:
      "Create a trial account for the GCSE Russian course platform before choosing paid Foundation or Higher access.",
    path: "/signup",
  }),
  robots: noIndexRobots,
};

const trialSteps = [
  {
    title: "Create the student account",
    description:
      "Set up access first, then explore the course environment before making a payment decision.",
    icon: "create",
  },
  {
    title: "Look around the route",
    description:
      "Inspect how lessons, vocabulary, grammar, exam-style practice, and revision connect.",
    icon: "navigation",
  },
  {
    title: "Upgrade only when ready",
    description:
      "Foundation and Higher access can be chosen later from inside the signed-in app.",
    icon: "pricing",
  },
] satisfies Array<{ title: string; description: string; icon: AppIconKey }>;

const fitSignals = [
  "Pearson Edexcel GCSE Russian 1RU0 focus",
  "Foundation and Higher pathways",
  "No checkout before trial access",
];

const familyTrustNotes = [
  {
    title: "Use a family-controlled email where appropriate",
    description:
      "Many GCSE students are under 18, so families should choose an email address they are comfortable using for course access and billing decisions.",
    icon: "users",
  },
  {
    title: "Payment is a separate step",
    description:
      "The trial account only opens the learning environment. Paid access is chosen later from inside the signed-in app.",
    icon: "pricing",
  },
  {
    title: "Support can be added later",
    description:
      "Students can start with self-study and add online lesson support if speaking, writing, or accountability needs more human guidance.",
    icon: "teacher",
  },
] satisfies Array<{ title: string; description: string; icon: AppIconKey }>;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">{children}</p>
  );
}

function TrialPreview() {
  return (
    <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.07] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase opacity-60">Trial route</p>
          <p className="mt-1 text-lg font-extrabold">Explore before checkout</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--accent-fill)] text-[var(--accent-on-fill)]">
          <AppIcon icon="unlocked" size={23} />
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {trialSteps.map((step, index) => (
          <div key={step.title} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-sm font-extrabold">
              {index + 1}
            </div>
            <div>
              <p className="text-sm font-bold">{step.title}</p>
              <p className="mt-1 text-xs leading-5 opacity-70">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="py-8 md:py-12">
      <section className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[var(--shadow-lg)]">
        <div className="grid lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.72fr)]">
          <div className="marketing-dark-panel p-6 sm:p-8 lg:p-10">
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone="success" icon="unlocked">
                Trial before checkout
              </Badge>
              <Badge tone="info" icon="school">
                Pearson Edexcel 1RU0
              </Badge>
            </div>

            <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">
              Start calmly
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-none md:text-6xl">
              Create a trial account before choosing paid access.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 opacity-80 md:text-lg">
              Students can look around the GCSE Russian course platform first, see how
              the learning route works, and upgrade only if the structure feels right.
            </p>

            <TrialPreview />
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
            <div className="mx-auto max-w-md">
              <Eyebrow>Trial account</Eyebrow>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)]">
                Create student access
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                Use the student name and the email address the family wants connected to
                course access.
              </p>
              <div className="mt-4 rounded-lg bg-[var(--background-muted)] p-4">
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  For students under 18
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                  A parent or guardian should be involved in account setup, email access,
                  and any later paid upgrade decision.
                </p>
              </div>

              <SignUpForm initialError={error} />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {fitSignals.map((signal) => (
          <div key={signal} className="flex items-start gap-3 rounded-lg bg-[var(--background-muted)] p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--surface-elevated)] text-[var(--accent-ink)]">
              <AppIcon icon="completed" size={18} />
            </div>
            <p className="text-sm font-bold leading-6 text-[var(--text-primary)]">
              {signal}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-lg bg-[var(--background-muted)] p-5 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.42fr_1fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">
              Family setup
            </p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)]">
              Keep the account decision calm and supervised.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">
              The platform is built for GCSE learners, so the signup step should be clear
              for students and sensible for parents.
            </p>
          </div>
          <div className="grid gap-3">
            {familyTrustNotes.map((note) => (
              <div
                key={note.title}
                className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 rounded-lg bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-sm)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
                  <AppIcon icon={note.icon} size={19} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    {note.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                    {note.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

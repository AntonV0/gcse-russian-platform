import type { Metadata } from "next";
import LoginForm from "@/components/auth/login-form";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import { buildPublicMetadata, noIndexRobots } from "@/lib/seo/site";
import type { AppIconKey } from "@/lib/shared/icons";

export const metadata: Metadata = {
  ...buildPublicMetadata({
    title: "Log in",
    description:
      "Log in to the GCSE Russian course platform to continue lessons, vocabulary, grammar, exam practice, and revision.",
    path: "/login",
  }),
  robots: noIndexRobots,
};

const loginBenefits = [
  {
    title: "Resume the route",
    description:
      "Return to the next useful lesson, practice area, or revision task without hunting through materials.",
    icon: "navigation",
  },
  {
    title: "Keep practice together",
    description:
      "Vocabulary, grammar, question sets, mocks, and course progress stay in one signed-in workspace.",
    icon: "layers",
  },
  {
    title: "Clearer family visibility",
    description:
      "Parents can understand whether study is following a sensible GCSE Russian route.",
    icon: "users",
  },
] satisfies Array<{ title: string; description: string; icon: AppIconKey }>;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">{children}</p>
  );
}

function LoginPreview() {
  return (
    <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.07] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase opacity-60">Next step</p>
          <p className="mt-1 text-lg font-extrabold">Continue GCSE Russian revision</p>
        </div>
        <span className="rounded-md bg-[var(--accent-fill)] px-3 py-1 text-xs font-bold text-[var(--accent-on-fill)]">
          Ready
        </span>
      </div>

      <div className="mt-4 h-2 rounded-full bg-white/15">
        <div className="h-2 w-[68%] rounded-full bg-[var(--accent-fill)]" />
      </div>

      <div className="mt-4 grid gap-2">
        {["Vocabulary warm-up", "Grammar in use", "Exam-style question"].map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm opacity-80">
            <AppIcon icon="completed" size={15} className="text-[var(--accent-ink)]" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  const safeNext =
    next && next.startsWith("/") && !next.startsWith("//") && !next.includes("\\")
      ? next
      : "";

  return (
    <div className="py-8 md:py-12">
      <section className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[var(--shadow-lg)]">
        <div className="grid lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.72fr)]">
          <div className="marketing-dark-panel p-6 sm:p-8 lg:p-10">
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone="info" icon="courses">
                Course dashboard
              </Badge>
              <Badge tone="success" icon="calendar">
                Progress route
              </Badge>
            </div>

            <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">
              Welcome back
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-none md:text-6xl">
              Pick up the GCSE Russian route where you left off.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 opacity-80 md:text-lg">
              Log in to continue lessons, vocabulary, grammar, exam-style questions,
              mock practice, and revision inside the same structured workspace.
            </p>

            <LoginPreview />
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
            <div className="mx-auto max-w-md">
              <Eyebrow>Student access</Eyebrow>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)]">
                Log in to your account
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                Use the email and password connected to the student account.
              </p>

              <LoginForm initialError={error} nextPath={safeNext} />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {loginBenefits.map((benefit) => (
          <div key={benefit.title} className="border-t-2 border-[var(--accent-fill)] pt-5">
            <AppIcon icon={benefit.icon} size={22} className="text-[var(--accent-ink)]" />
            <h2 className="mt-4 text-lg font-extrabold text-[var(--text-primary)]">
              {benefit.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {benefit.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

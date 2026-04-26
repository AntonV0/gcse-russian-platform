import { signIn } from "@/app/actions/auth/auth";
import FeedbackBanner from "@/components/ui/feedback-banner";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-var(--site-header-height)-8rem)] max-w-md items-center px-4 py-10">
      <section className="app-surface-brand app-section-padding-lg w-full">
        <div className="mb-6 space-y-2">
          <h1 className="app-title">Log in</h1>
          <p className="app-subtitle">Access your GCSE Russian course dashboard.</p>
        </div>

        {error ? (
          <FeedbackBanner
            tone="danger"
            title="Login failed"
            description={error}
            className="mb-4"
          />
        ) : null}

        <form action={signIn} className="space-y-4">
          <div className="app-form-field">
            <label htmlFor="email" className="app-form-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="app-form-control app-form-input"
            />
          </div>

          <div className="app-form-field">
            <label htmlFor="password" className="app-form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="app-form-control app-form-input"
            />
          </div>

          <button
            type="submit"
            className="app-btn-base app-btn-primary min-h-11 w-full px-4 py-3 text-sm"
          >
            Log in
          </button>
        </form>
      </section>
    </main>
  );
}

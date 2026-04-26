import { signUp } from "@/app/actions/auth/auth";
import FeedbackBanner from "@/components/ui/feedback-banner";

type SignUpPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-var(--site-header-height)-8rem)] max-w-md items-center px-4 py-10">
      <section className="app-surface-brand app-section-padding-lg w-full">
        <div className="mb-6 space-y-2">
          <h1 className="app-title">Create account</h1>
          <p className="app-subtitle">
            Start with a trial account for the GCSE Russian course platform.
          </p>
        </div>

        {error ? (
          <FeedbackBanner
            tone="danger"
            title="Signup failed"
            description={error}
            className="mb-4"
          />
        ) : null}

        <form action={signUp} className="space-y-4">
          <div className="app-form-field">
            <label htmlFor="fullName" className="app-form-label">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              className="app-form-control app-form-input"
            />
          </div>

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
              autoComplete="new-password"
              required
              className="app-form-control app-form-input"
            />
          </div>

          <button
            type="submit"
            className="app-btn-base app-btn-primary min-h-11 w-full px-4 py-3 text-sm"
          >
            Create account
          </button>
        </form>
      </section>
    </main>
  );
}

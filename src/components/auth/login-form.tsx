"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, type AuthActionState } from "@/app/actions/auth/auth";
import AuthSubmitButton from "@/components/auth/auth-submit-button";
import AppIcon from "@/components/ui/app-icon";
import FeedbackBanner from "@/components/ui/feedback-banner";

type LoginFormProps = {
  initialError?: string;
  nextPath?: string;
};

const initialState: AuthActionState = {
  message: null,
};

export default function LoginForm({ initialError, nextPath }: LoginFormProps) {
  const [state, formAction] = useActionState(signIn, {
    message: initialError ?? initialState.message,
  });
  const error = state.message;

  return (
    <>
      {error ? (
        <div aria-live="polite">
          <FeedbackBanner
            tone="danger"
            title="Login failed"
            description={error}
            className="mt-5"
          />
        </div>
      ) : null}

      <form action={formAction} className="mt-6 space-y-4">
        {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}

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
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="password" className="app-form-label">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="app-accent-link rounded-sm text-xs font-bold"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="app-form-control app-form-input"
          />
        </div>

        <AuthSubmitButton
          idleIcon="unlocked"
          idleLabel="Log in"
          pendingLabel="Checking account..."
        />
      </form>

      <div className="mt-6 rounded-lg bg-[var(--background-muted)] p-4">
        <p className="text-sm font-bold text-[var(--text-primary)]">
          New to GCSERussian.com?
        </p>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          Create a trial account first. Checkout only happens later from inside the
          signed-in app.
        </p>
        <Link
          href="/signup"
          className="app-accent-link mt-3 inline-flex items-center gap-2 rounded-sm text-sm font-bold"
        >
          Create trial account
          <AppIcon icon="arrowRight" size={15} />
        </Link>
      </div>
    </>
  );
}

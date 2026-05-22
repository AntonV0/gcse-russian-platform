"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp, type AuthActionState } from "@/app/actions/auth/auth";
import AuthSubmitButton from "@/components/auth/auth-submit-button";
import AppIcon from "@/components/ui/app-icon";
import FeedbackBanner from "@/components/ui/feedback-banner";

type SignUpFormProps = {
  initialError?: string;
};

const initialState: AuthActionState = {
  message: null,
};

export default function SignUpForm({ initialError }: SignUpFormProps) {
  const [state, formAction] = useActionState(signUp, {
    message: initialError ?? initialState.message,
  });
  const error = state.message;

  return (
    <>
      {error ? (
        <div aria-live="polite">
          <FeedbackBanner
            tone="danger"
            title="Signup failed"
            description={error}
            className="mt-5"
          />
        </div>
      ) : null}

      <form action={formAction} className="mt-6 space-y-4">
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
            minLength={8}
            aria-describedby="password-help"
            className="app-form-control app-form-input"
          />
          <p id="password-help" className="mt-2 text-xs text-[var(--text-muted)]">
            Use at least 8 characters.
          </p>
        </div>

        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-muted)] p-4">
          <p className="text-sm font-bold text-[var(--text-primary)]">
            Parent or guardian contact
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
            Optional for trial access, useful where a parent or guardian helps manage
            the account or later payment decision.
          </p>

          <div className="mt-4 space-y-4">
            <div className="app-form-field">
              <label htmlFor="parentGuardianName" className="app-form-label">
                Parent/guardian name
              </label>
              <input
                id="parentGuardianName"
                name="parentGuardianName"
                type="text"
                autoComplete="name"
                className="app-form-control app-form-input"
              />
            </div>

            <div className="app-form-field">
              <label htmlFor="parentGuardianEmail" className="app-form-label">
                Parent/guardian email
              </label>
              <input
                id="parentGuardianEmail"
                name="parentGuardianEmail"
                type="email"
                autoComplete="email"
                className="app-form-control app-form-input"
              />
            </div>

            <label className="flex items-start gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-3 text-sm leading-6 text-[var(--text-secondary)]">
              <input
                name="parentGuardianConsentConfirmed"
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent-fill)]"
              />
              <span>
                A parent or guardian is aware of this account setup where that is
                appropriate for the student.
              </span>
            </label>
          </div>
        </div>

        <AuthSubmitButton
          idleIcon="create"
          idleLabel="Create trial account"
          pendingLabel="Creating account..."
        />
      </form>

      <div className="mt-6 rounded-lg bg-[var(--background-muted)] p-4">
        <p className="text-sm font-bold text-[var(--text-primary)]">
          Already have an account?
        </p>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          Log in to continue the student route, review progress, or upgrade from inside
          the app.
        </p>
        <Link
          href="/login"
          className="app-accent-link mt-3 inline-flex items-center gap-2 rounded-sm text-sm font-bold"
        >
          Log in
          <AppIcon icon="arrowRight" size={15} />
        </Link>
      </div>
    </>
  );
}

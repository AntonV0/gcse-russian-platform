"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signUp, type AuthActionState } from "@/app/actions/auth/auth";
import AuthSubmitButton from "@/components/auth/auth-submit-button";
import AppIcon from "@/components/ui/app-icon";
import FeedbackBanner from "@/components/ui/feedback-banner";

type SignUpFormProps = {
  initialError?: string;
  source?: string;
  entryPath?: string;
  destinationPath?: string;
};

const initialState: AuthActionState = {
  message: null,
};

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className="mt-2 text-xs font-semibold text-[var(--danger-text)]">
      {message}
    </p>
  ) : null;
}

function describedBy(...ids: Array<string | false | undefined>) {
  const value = ids.filter(Boolean).join(" ");
  return value || undefined;
}

export default function SignUpForm({
  initialError,
  source,
  entryPath,
  destinationPath = "/dashboard",
}: SignUpFormProps) {
  const [state, formAction] = useActionState(signUp, {
    message: initialError ?? initialState.message,
  });
  const [values, setValues] = useState({
    fullName: state.values?.fullName ?? "",
    email: state.values?.email ?? "",
    parentGuardianName: state.values?.parentGuardianName ?? "",
    parentGuardianEmail: state.values?.parentGuardianEmail ?? "",
    parentGuardianPhone: state.values?.parentGuardianPhone ?? "",
    parentGuardianConsentConfirmed: state.values?.parentGuardianConsentConfirmed ?? false,
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [guardianOpen, setGuardianOpen] = useState(
    Boolean(
      values.parentGuardianName ||
      values.parentGuardianEmail ||
      values.parentGuardianPhone ||
      values.parentGuardianConsentConfirmed
    )
  );
  const error = state.message;
  const fieldErrors = state.fieldErrors ?? {};
  const sourceSuffix = source === "app" ? "?from=app" : "";
  const loginParams = new URLSearchParams(sourceSuffix.slice(1));

  if (destinationPath !== "/dashboard") {
    loginParams.set("next", destinationPath);
  }

  const loginHref = `/login${loginParams.size ? `?${loginParams.toString()}` : ""}`;
  const passwordsMatch = confirmPassword.length === 0 || password === confirmPassword;
  const passwordReady = password.length >= 8;
  const updateValue = (key: keyof typeof values, value: string | boolean) => {
    setValues((current) => ({ ...current, [key]: value }));
  };
  const updateCapsLock = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockOn(event.getModifierState("CapsLock"));
  };

  return (
    <>
      {error ? (
        <div aria-live="polite" tabIndex={-1}>
          <FeedbackBanner
            tone="danger"
            title="We could not create the account"
            description={error}
            className="mt-5"
          />
        </div>
      ) : null}

      <form action={formAction} className="mt-5 space-y-5">
        <input type="hidden" name="signupSource" value={source ?? "marketing"} />
        <input type="hidden" name="signupEntryPath" value={entryPath ?? "/signup"} />
        <input type="hidden" name="signupDestination" value={destinationPath} />

        <div className="app-form-field">
          <label htmlFor="fullName" className="app-form-label">
            Student name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Student name"
            required
            maxLength={100}
            value={values.fullName}
            onChange={(event) => updateValue("fullName", event.target.value)}
            aria-invalid={Boolean(fieldErrors.fullName)}
            aria-describedby={describedBy(fieldErrors.fullName && "fullName-error")}
            className="app-form-control app-form-input"
          />
          <FieldError id="fullName-error" message={fieldErrors.fullName} />
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
            placeholder="name@example.com"
            required
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={describedBy(
              "email-help",
              fieldErrors.email && "email-error"
            )}
            className="app-form-control app-form-input"
          />
          <p id="email-help" className="mt-2 text-xs text-[var(--text-muted)]">
            Use an email the student or parent can check.
          </p>
          <FieldError id="email-error" message={fieldErrors.email} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="app-form-field">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="password" className="app-form-label">
                Password
              </label>
              <button
                type="button"
                className="app-accent-link rounded-sm text-xs font-bold"
                aria-pressed={showPasswords}
                onClick={() => setShowPasswords((visible) => !visible)}
              >
                {showPasswords ? "Hide passwords" : "Show passwords"}
              </button>
            </div>
            <input
              id="password"
              name="password"
              type={showPasswords ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={updateCapsLock}
              onKeyUp={updateCapsLock}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={describedBy(
                "password-help",
                fieldErrors.password && "password-error",
                capsLockOn && "caps-lock-help"
              )}
              className="app-form-control app-form-input"
            />
            <p
              id="password-help"
              className={`mt-2 text-xs ${
                passwordReady
                  ? "font-semibold text-[var(--success-text)]"
                  : "text-[var(--text-muted)]"
              }`}
            >
              {passwordReady ? "Password length is ready." : "Use at least 8 characters."}
            </p>
            {capsLockOn ? (
              <p id="caps-lock-help" className="mt-1 text-xs text-[var(--warning-text)]">
                Caps Lock is on.
              </p>
            ) : null}
            <FieldError id="password-error" message={fieldErrors.password} />
          </div>

          <div className="app-form-field">
            <label htmlFor="confirmPassword" className="app-form-label">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPasswords ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Type it again"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              onKeyDown={updateCapsLock}
              onKeyUp={updateCapsLock}
              aria-invalid={Boolean(fieldErrors.confirmPassword) || !passwordsMatch}
              aria-describedby={describedBy(
                !passwordsMatch && "confirmPassword-match-error",
                fieldErrors.confirmPassword && "confirmPassword-error"
              )}
              className="app-form-control app-form-input"
            />
            {!passwordsMatch && !fieldErrors.confirmPassword ? (
              <FieldError
                id="confirmPassword-match-error"
                message="Passwords do not match yet."
              />
            ) : confirmPassword ? (
              <p className="mt-2 text-xs font-semibold text-[var(--success-text)]">
                Passwords match.
              </p>
            ) : null}
            <FieldError
              id="confirmPassword-error"
              message={fieldErrors.confirmPassword}
            />
          </div>
        </div>

        <details
          open={guardianOpen}
          onToggle={(event) => setGuardianOpen(event.currentTarget.open)}
          className="group rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)] p-4"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 app-focus-ring">
            <span>
              <span className="block text-sm font-bold text-[var(--text-primary)]">
                Add parent or guardian details
              </span>
              <span className="mt-1 block text-sm leading-6 text-[var(--text-secondary)]">
                Optional for the trial. If added, name, email, and phone are all required.
              </span>
            </span>
            <AppIcon
              icon="chevronDown"
              size={16}
              className="shrink-0 text-[var(--text-muted)] transition group-open:rotate-180"
            />
          </summary>

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
                maxLength={100}
                value={values.parentGuardianName}
                onChange={(event) =>
                  updateValue("parentGuardianName", event.target.value)
                }
                aria-invalid={Boolean(fieldErrors.parentGuardianName)}
                aria-describedby={describedBy(
                  fieldErrors.parentGuardianName && "parentGuardianName-error"
                )}
                className="app-form-control app-form-input"
              />
              <FieldError
                id="parentGuardianName-error"
                message={fieldErrors.parentGuardianName}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="app-form-field">
                <label htmlFor="parentGuardianEmail" className="app-form-label">
                  Parent/guardian email
                </label>
                <input
                  id="parentGuardianEmail"
                  name="parentGuardianEmail"
                  type="email"
                  autoComplete="email"
                  value={values.parentGuardianEmail}
                  onChange={(event) =>
                    updateValue("parentGuardianEmail", event.target.value)
                  }
                  aria-invalid={Boolean(fieldErrors.parentGuardianEmail)}
                  aria-describedby={describedBy(
                    fieldErrors.parentGuardianEmail && "parentGuardianEmail-error"
                  )}
                  className="app-form-control app-form-input"
                />
                <FieldError
                  id="parentGuardianEmail-error"
                  message={fieldErrors.parentGuardianEmail}
                />
              </div>

              <div className="app-form-field">
                <label htmlFor="parentGuardianPhone" className="app-form-label">
                  Parent/guardian phone
                </label>
                <input
                  id="parentGuardianPhone"
                  name="parentGuardianPhone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={32}
                  placeholder="+44 7700 900123"
                  value={values.parentGuardianPhone}
                  onChange={(event) =>
                    updateValue("parentGuardianPhone", event.target.value)
                  }
                  aria-invalid={Boolean(fieldErrors.parentGuardianPhone)}
                  aria-describedby={describedBy(
                    fieldErrors.parentGuardianPhone && "parentGuardianPhone-error"
                  )}
                  className="app-form-control app-form-input"
                />
                <FieldError
                  id="parentGuardianPhone-error"
                  message={fieldErrors.parentGuardianPhone}
                />
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-3 text-sm leading-6 text-[var(--text-secondary)]">
              <input
                name="parentGuardianConsentConfirmed"
                type="checkbox"
                checked={values.parentGuardianConsentConfirmed}
                onChange={(event) =>
                  updateValue("parentGuardianConsentConfirmed", event.target.checked)
                }
                aria-invalid={Boolean(fieldErrors.parentGuardianConsentConfirmed)}
                aria-describedby={describedBy(
                  fieldErrors.parentGuardianConsentConfirmed &&
                    "parentGuardianConsentConfirmed-error"
                )}
                className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent-fill)]"
              />
              <span>
                The parent or guardian knows about this account and agrees that these
                contact details can be used for account support.
              </span>
            </label>
            <FieldError
              id="parentGuardianConsentConfirmed-error"
              message={fieldErrors.parentGuardianConsentConfirmed}
            />
          </div>
        </details>

        <AuthSubmitButton
          idleIcon="create"
          idleLabel="Create my trial account"
          pendingLabel="Creating your account..."
        />

        <p className="text-center text-xs leading-5 text-[var(--text-muted)]">
          By creating an account, you agree to the{" "}
          <Link
            href="/terms"
            target="_blank"
            rel="noreferrer"
            className="app-accent-link rounded-sm font-semibold"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            target="_blank"
            rel="noreferrer"
            className="app-accent-link rounded-sm font-semibold"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>

      <div className="mt-6 rounded-lg bg-[var(--background-muted)] p-4">
        <p className="text-sm font-bold text-[var(--text-primary)]">
          Already have an account?
        </p>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          Log in to continue lessons, review progress, or return to your dashboard.
        </p>
        <Link
          href={loginHref}
          className="app-accent-link mt-3 inline-flex items-center gap-2 rounded-sm text-sm font-bold"
        >
          Log in
          <AppIcon icon="arrowRight" size={15} />
        </Link>
      </div>
    </>
  );
}

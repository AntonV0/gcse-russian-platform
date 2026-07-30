"use client";

import { useState } from "react";
import { updatePassword } from "@/app/actions/auth/auth";
import Button from "@/components/ui/button";
import FeedbackBanner from "@/components/ui/feedback-banner";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import { validatePasswordUpdate } from "@/lib/account/settings-validation";

export default function PasswordSecurityForm({
  nextPath,
  returnPath,
}: {
  nextPath?: string;
  returnPath?: string;
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });
  const validation = validatePasswordUpdate({ password, confirmPassword });
  const hasStarted = password.length > 0 || confirmPassword.length > 0;
  const canSubmit = validation.isValid;
  const passwordHelper = password.length
    ? `${Math.min(password.trim().length, 8)} of 8 minimum characters`
    : "Use at least 8 characters.";

  return (
    <form action={updatePassword} className="space-y-4">
      {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
      {returnPath ? <input type="hidden" name="returnTo" value={returnPath} /> : null}

      <FeedbackBanner
        tone="info"
        title="Password changes are immediate"
        description="After saving, keep using the same email address with your new password."
        className="text-left"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="New password"
          hint={
            !touched.password || validation.passwordError ? passwordHelper : undefined
          }
          success={
            touched.password && !validation.passwordError
              ? "Password length looks good."
              : undefined
          }
          error={touched.password ? validation.passwordError : undefined}
          required
        >
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter new password"
            minLength={8}
            required
            value={password}
            onBlur={() => setTouched((current) => ({ ...current, password: true }))}
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormField>

        <FormField
          label="Confirm new password"
          hint={!touched.confirmPassword ? "Repeat the new password." : undefined}
          success={
            touched.confirmPassword && !validation.confirmPasswordError
              ? "Passwords match."
              : undefined
          }
          error={touched.confirmPassword ? validation.confirmPasswordError : undefined}
          required
        >
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat new password"
            minLength={8}
            required
            value={confirmPassword}
            onBlur={() =>
              setTouched((current) => ({ ...current, confirmPassword: true }))
            }
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </FormField>
      </div>

      <div
        className={[
          "flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between",
          hasStarted && canSubmit
            ? "border-[var(--success-border)] bg-[var(--success-surface)]"
            : "border-[var(--border-subtle)] bg-[var(--background-muted)]",
        ].join(" ")}
        aria-live="polite"
      >
        <div>
          <div className="text-sm font-semibold text-[var(--text-primary)]">
            {canSubmit ? "Ready to update" : "Complete both password fields"}
          </div>
          <p className="mt-1 text-sm app-text-muted">
            {canSubmit
              ? "The new password meets the current account requirements."
              : "The form checks length and matching before it is sent."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <LoadingButton
            idleLabel="Update password"
            pendingLabel="Updating password..."
            idleIcon="save"
            variant="primary"
            disabled={!canSubmit}
          />

          <Button href="/forgot-password" variant="secondary" icon="lock">
            Send reset email
          </Button>
        </div>
      </div>
    </form>
  );
}

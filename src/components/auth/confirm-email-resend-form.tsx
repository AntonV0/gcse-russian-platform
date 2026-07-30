"use client";

import { useActionState } from "react";
import {
  resendSignupConfirmation,
  type ConfirmationActionState,
} from "@/app/actions/auth/auth";
import AuthSubmitButton from "@/components/auth/auth-submit-button";
import FeedbackBanner from "@/components/ui/feedback-banner";

const initialState: ConfirmationActionState = {
  message: null,
  success: null,
};

export default function ConfirmEmailResendForm({
  destinationPath,
}: {
  destinationPath: string;
}) {
  const [state, formAction] = useActionState(resendSignupConfirmation, initialState);

  return (
    <form action={formAction} className="mt-5 space-y-4">
      <input type="hidden" name="next" value={destinationPath} />

      {state.message ? (
        <FeedbackBanner
          tone="danger"
          title="Confirmation email not sent"
          description={state.message}
        />
      ) : null}

      {state.success ? (
        <FeedbackBanner
          tone="success"
          title="Check your inbox again"
          description={state.success}
        />
      ) : null}

      <div className="app-form-field">
        <label htmlFor="confirmationEmail" className="app-form-label">
          Account email address
        </label>
        <input
          id="confirmationEmail"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="name@example.com"
          className="app-form-control app-form-input"
        />
      </div>

      <AuthSubmitButton
        idleLabel="Resend confirmation email"
        pendingLabel="Sending email..."
        idleIcon="next"
      />
    </form>
  );
}

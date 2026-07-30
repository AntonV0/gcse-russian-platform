"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getPasswordUpdateErrorMessage,
  validateParentGuardianContact,
  validatePasswordUpdate,
} from "@/lib/account/settings-validation";
import {
  getAuthRedirectPath,
  getPostOnboardingRedirectPath,
  getSafeAuthRedirectPath,
} from "@/lib/auth/redirect-paths";
import {
  getSignupConfirmationPath,
  getSignupEmailRedirectUrl,
  getSignupOnboardingPath,
} from "@/lib/auth/signup-redirects";
import { getPublicSiteUrl } from "@/lib/seo/site";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  getOrCreateOnboardingJourneyId,
  trackOnboardingFunnelEvent,
} from "@/lib/onboarding/funnel-events";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export type SignupFormValues = {
  fullName: string;
  email: string;
  parentGuardianName: string;
  parentGuardianEmail: string;
  parentGuardianPhone: string;
  parentGuardianConsentConfirmed: boolean;
};

export type SignupFieldErrors = Partial<
  Record<
    | "fullName"
    | "email"
    | "password"
    | "confirmPassword"
    | "parentGuardianName"
    | "parentGuardianEmail"
    | "parentGuardianPhone"
    | "parentGuardianConsentConfirmed",
    string
  >
>;

export type AuthActionState = {
  message: string | null;
  fieldErrors?: SignupFieldErrors;
  values?: SignupFormValues;
};

export type ConfirmationActionState = {
  message: string | null;
  success: string | null;
};

function authError(
  message: string,
  options?: Pick<AuthActionState, "fieldErrors" | "values">
): AuthActionState {
  return { message, ...options };
}

function getSignupSource(value: string) {
  return value === "app" || value === "marketing" ? value : "unknown";
}

function getSignupEntryPath(value: string) {
  const safePath = getSafeAuthRedirectPath(value);
  return safePath ? safePath.slice(0, 500) : null;
}

function getFriendlySignupErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("already registered") ||
    normalized.includes("already exists") ||
    normalized.includes("user already")
  ) {
    return "An account already uses this email. Log in instead, or reset the password.";
  }

  if (normalized.includes("rate") || normalized.includes("too many")) {
    return "Too many signup attempts were made. Wait a few minutes, then try again.";
  }

  if (normalized.includes("email")) {
    return "Check the email address and try again.";
  }

  if (normalized.includes("password")) {
    return "Choose a stronger password and try again.";
  }

  return "We could not reach the account service. Your details have not been lost—please try again.";
}

export async function signUp(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const confirmPassword = getString(formData, "confirmPassword");
  const fullName = getString(formData, "fullName");
  const parentGuardianName = getString(formData, "parentGuardianName");
  const parentGuardianEmail = getString(formData, "parentGuardianEmail");
  const parentGuardianPhone = getString(formData, "parentGuardianPhone");
  const signupSource = getSignupSource(getString(formData, "signupSource"));
  const signupEntryPath = getSignupEntryPath(getString(formData, "signupEntryPath"));
  const destinationPath = getPostOnboardingRedirectPath(
    getString(formData, "signupDestination")
  );
  const parentGuardianConsentConfirmed =
    formData.get("parentGuardianConsentConfirmed") === "on";
  const values: SignupFormValues = {
    fullName,
    email,
    parentGuardianName,
    parentGuardianEmail,
    parentGuardianPhone,
    parentGuardianConsentConfirmed,
  };

  if (!fullName) {
    return authError("Check the highlighted account detail.", {
      fieldErrors: { fullName: "Enter the student's full name." },
      values,
    });
  }

  if (fullName.length > 100) {
    return authError("Check the highlighted account detail.", {
      fieldErrors: { fullName: "Use 100 characters or fewer." },
      values,
    });
  }

  if (!email) {
    return authError("Check the highlighted account detail.", {
      fieldErrors: { email: "Enter the account email address." },
      values,
    });
  }

  const passwordValidation = validatePasswordUpdate({
    password,
    confirmPassword,
  });

  if (!passwordValidation.isValid) {
    return authError("Check the highlighted password detail.", {
      fieldErrors: {
        password: passwordValidation.passwordError,
        confirmPassword: passwordValidation.confirmPasswordError,
      },
      values,
    });
  }

  const parentGuardianValidation = validateParentGuardianContact({
    parentGuardianName,
    parentGuardianEmail,
    parentGuardianPhone,
    parentGuardianConsentConfirmed,
  });

  if (!parentGuardianValidation.isValid) {
    return authError("Complete the highlighted parent or guardian detail.", {
      fieldErrors: {
        parentGuardianName: parentGuardianValidation.parentGuardianNameError,
        parentGuardianEmail: parentGuardianValidation.parentGuardianEmailError,
        parentGuardianPhone: parentGuardianValidation.parentGuardianPhoneError,
        parentGuardianConsentConfirmed:
          parentGuardianValidation.parentGuardianConsentError,
      },
      values,
    });
  }

  const supabase = await createClient();
  let serviceRole: ReturnType<typeof createServiceRoleClient>;

  try {
    serviceRole = createServiceRoleClient();
  } catch (error) {
    console.error("Signup profile provisioning is unavailable.", error);
    return authError(
      "Account setup is temporarily unavailable. Please try again in a moment.",
      { values }
    );
  }

  const journeyId = await getOrCreateOnboardingJourneyId();
  await trackOnboardingFunnelEvent({
    journeyId,
    eventName: "signup_submitted",
    source: signupSource,
    entryPath: signupEntryPath,
    destinationPath,
  });

  let data: Awaited<ReturnType<typeof supabase.auth.signUp>>["data"];

  try {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getSignupEmailRedirectUrl(destinationPath),
        data: {
          full_name: fullName,
          signup_source: signupSource,
          signup_entry_path: signupEntryPath,
        },
      },
    });

    if (result.error) {
      return authError(getFriendlySignupErrorMessage(result.error.message), { values });
    }

    data = result.data;
  } catch {
    return authError(getFriendlySignupErrorMessage("network"), { values });
  }

  const userId = data.user?.id;

  if (!userId || data.user?.identities?.length === 0) {
    return authError(
      "An account may already use this email. Check your inbox, log in, or reset the password.",
      { values }
    );
  }

  const safeFullName = fullName.length > 100 ? fullName.slice(0, 100) : fullName;
  const safeDisplayName =
    safeFullName.length > 50 ? safeFullName.slice(0, 50) : safeFullName;

  const { error: profileError } = await serviceRole.from("profiles").upsert(
    {
      id: userId,
      email,
      full_name: safeFullName || null,
      display_name: safeDisplayName || null,
      parent_guardian_name: parentGuardianValidation.parentGuardianName,
      parent_guardian_email: parentGuardianValidation.parentGuardianEmail,
      parent_guardian_phone: parentGuardianValidation.parentGuardianPhone,
      parent_guardian_consent_confirmed:
        parentGuardianValidation.parentGuardianConsentConfirmed,
      parent_guardian_consent_confirmed_at:
        parentGuardianValidation.parentGuardianConsentConfirmed
          ? new Date().toISOString()
          : null,
      signup_source: signupSource,
      signup_entry_path: signupEntryPath,
    },
    {
      onConflict: "id",
    }
  );

  if (profileError) {
    const { error: rollbackError } = await serviceRole.auth.admin.deleteUser(userId);

    console.error("Signup profile provisioning failed.", {
      userId,
      profileError,
      rollbackError,
    });

    return authError(
      rollbackError
        ? "Your account needs support to finish setup. Please contact us before trying again."
        : "We could not finish creating the account. Nothing was saved—please try again.",
      { values }
    );
  }

  await trackOnboardingFunnelEvent({
    journeyId,
    eventName: "account_created",
    userId,
    source: signupSource,
    entryPath: signupEntryPath,
    destinationPath,
  });

  if (!data.session) {
    redirect(
      getSignupConfirmationPath({
        destinationPath,
        source: signupSource,
      })
    );
  }

  redirect(getSignupOnboardingPath(destinationPath));
}

export async function signIn(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const next = getAuthRedirectPath(getString(formData, "next"));

  if (!email) {
    return authError("Enter the account email address.");
  }

  if (!password) {
    return authError("Enter the account password.");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return authError(error.message);
  }

  redirect(next);
}

export async function resendSignupConfirmation(
  _previousState: ConfirmationActionState,
  formData: FormData
): Promise<ConfirmationActionState> {
  const email = getString(formData, "email");
  const destinationPath = getPostOnboardingRedirectPath(getString(formData, "next"));

  if (!email) {
    return {
      message: "Enter the account email address.",
      success: null,
    };
  }

  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: getSignupEmailRedirectUrl(destinationPath),
      },
    });

    if (error) {
      const normalized = error.message.toLowerCase();

      if (normalized.includes("rate") || normalized.includes("too many")) {
        return {
          message: "Too many emails were requested. Wait a few minutes, then try again.",
          success: null,
        };
      }
    }
  } catch {
    return {
      message: "We could not reach the account service. Please try again.",
      success: null,
    };
  }

  return {
    message: null,
    success:
      "If an unconfirmed account uses that address, a new confirmation email is on its way.",
  };
}

export async function requestPasswordReset(formData: FormData) {
  const email = getString(formData, "email");

  if (!email) {
    redirect("/forgot-password?error=Enter%20the%20account%20email%20address");
  }

  const supabase = await createClient();
  const redirectTo = getPublicSiteUrl("/auth/callback?next=/settings").toString();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/forgot-password?success=reset-email-sent");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const password = getString(formData, "password");
  const confirmPassword = getString(formData, "confirmPassword");
  const validation = validatePasswordUpdate({ password, confirmPassword });

  if (!validation.isValid) {
    redirect(
      `/settings?error=${encodeURIComponent(getPasswordUpdateErrorMessage(validation))}`
    );
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    redirect(`/settings?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/settings");
  redirect("/settings?success=password-updated");
}

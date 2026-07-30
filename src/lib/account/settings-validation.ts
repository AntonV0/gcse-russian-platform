export type PasswordUpdateValidation = {
  isValid: boolean;
  passwordError?: string;
  confirmPasswordError?: string;
};

export type ParentGuardianContactValidation = {
  isValid: boolean;
  parentGuardianName: string | null;
  parentGuardianEmail: string | null;
  parentGuardianPhone: string | null;
  parentGuardianConsentConfirmed: boolean;
  parentGuardianNameError?: string;
  parentGuardianEmailError?: string;
  parentGuardianPhoneError?: string;
  parentGuardianConsentError?: string;
};

const MIN_PASSWORD_LENGTH = 8;
const MAX_PARENT_GUARDIAN_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 32;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d().\s-]+$/;

export function validatePasswordUpdate({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}): PasswordUpdateValidation {
  const normalizedPassword = password.trim();
  const normalizedConfirmPassword = confirmPassword.trim();

  if (!normalizedPassword) {
    return {
      isValid: false,
      passwordError: "Enter a new password.",
    };
  }

  if (normalizedPassword.length < MIN_PASSWORD_LENGTH) {
    return {
      isValid: false,
      passwordError: `Use at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }

  if (!normalizedConfirmPassword) {
    return {
      isValid: false,
      confirmPasswordError: "Confirm the new password.",
    };
  }

  if (normalizedPassword !== normalizedConfirmPassword) {
    return {
      isValid: false,
      confirmPasswordError: "Passwords do not match.",
    };
  }

  return { isValid: true };
}

export function getPasswordUpdateErrorMessage(validation: PasswordUpdateValidation) {
  return (
    validation.passwordError ??
    validation.confirmPasswordError ??
    "Password update failed."
  );
}

export function validateParentGuardianContact({
  parentGuardianName,
  parentGuardianEmail,
  parentGuardianPhone,
  parentGuardianConsentConfirmed = false,
}: {
  parentGuardianName?: string | null;
  parentGuardianEmail?: string | null;
  parentGuardianPhone?: string | null;
  parentGuardianConsentConfirmed?: boolean;
}): ParentGuardianContactValidation {
  const normalizedName = (parentGuardianName ?? "").trim();
  const normalizedEmail = (parentGuardianEmail ?? "").trim().toLowerCase();
  const normalizedPhone = (parentGuardianPhone ?? "").trim();
  const hasAnyDetails = Boolean(
    normalizedName || normalizedEmail || normalizedPhone || parentGuardianConsentConfirmed
  );

  if (!hasAnyDetails) {
    return {
      isValid: true,
      parentGuardianName: null,
      parentGuardianEmail: null,
      parentGuardianPhone: null,
      parentGuardianConsentConfirmed: false,
    };
  }

  const phoneDigits = normalizedPhone.replace(/\D/g, "");
  const parentGuardianNameError = !normalizedName
    ? "Enter the parent or guardian's name."
    : normalizedName.length > MAX_PARENT_GUARDIAN_NAME_LENGTH
      ? `Use ${MAX_PARENT_GUARDIAN_NAME_LENGTH} characters or fewer.`
      : undefined;
  const parentGuardianEmailError = !normalizedEmail
    ? "Enter the parent or guardian's email address."
    : normalizedEmail.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(normalizedEmail)
      ? "Enter a valid parent or guardian email address."
      : undefined;
  const parentGuardianPhoneError = !normalizedPhone
    ? "Enter the parent or guardian's phone number."
    : normalizedPhone.length > MAX_PHONE_LENGTH ||
        !PHONE_PATTERN.test(normalizedPhone) ||
        phoneDigits.length < 7 ||
        phoneDigits.length > 15
      ? "Enter a valid parent or guardian phone number."
      : undefined;
  const parentGuardianConsentError = !parentGuardianConsentConfirmed
    ? "Confirm that the parent or guardian knows about this account."
    : undefined;
  const isValid = !(
    parentGuardianNameError ||
    parentGuardianEmailError ||
    parentGuardianPhoneError ||
    parentGuardianConsentError
  );

  return {
    isValid,
    parentGuardianName: parentGuardianNameError ? null : normalizedName,
    parentGuardianEmail: parentGuardianEmailError ? null : normalizedEmail,
    parentGuardianPhone: parentGuardianPhoneError ? null : normalizedPhone,
    parentGuardianConsentConfirmed,
    ...(parentGuardianNameError ? { parentGuardianNameError } : {}),
    ...(parentGuardianEmailError ? { parentGuardianEmailError } : {}),
    ...(parentGuardianPhoneError ? { parentGuardianPhoneError } : {}),
    ...(parentGuardianConsentError ? { parentGuardianConsentError } : {}),
  };
}

export function getParentGuardianContactErrorMessage(
  validation: ParentGuardianContactValidation
) {
  return (
    validation.parentGuardianNameError ??
    validation.parentGuardianEmailError ??
    validation.parentGuardianPhoneError ??
    validation.parentGuardianConsentError ??
    "Parent or guardian details could not be saved."
  );
}

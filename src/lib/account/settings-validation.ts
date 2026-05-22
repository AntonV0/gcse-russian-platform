export type PasswordUpdateValidation = {
  isValid: boolean;
  passwordError?: string;
  confirmPasswordError?: string;
};

export type ParentGuardianContactValidation = {
  isValid: boolean;
  parentGuardianName: string | null;
  parentGuardianEmail: string | null;
  parentGuardianConsentConfirmed: boolean;
  parentGuardianNameError?: string;
  parentGuardianEmailError?: string;
};

const MIN_PASSWORD_LENGTH = 8;
const MAX_PARENT_GUARDIAN_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  parentGuardianConsentConfirmed = false,
}: {
  parentGuardianName?: string | null;
  parentGuardianEmail?: string | null;
  parentGuardianConsentConfirmed?: boolean;
}): ParentGuardianContactValidation {
  const normalizedName = (parentGuardianName ?? "").trim();
  const normalizedEmail = (parentGuardianEmail ?? "").trim().toLowerCase();

  if (normalizedName.length > MAX_PARENT_GUARDIAN_NAME_LENGTH) {
    return {
      isValid: false,
      parentGuardianName: null,
      parentGuardianEmail: normalizedEmail || null,
      parentGuardianConsentConfirmed,
      parentGuardianNameError: `Use ${MAX_PARENT_GUARDIAN_NAME_LENGTH} characters or fewer.`,
    };
  }

  if (
    normalizedEmail &&
    (normalizedEmail.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(normalizedEmail))
  ) {
    return {
      isValid: false,
      parentGuardianName: normalizedName || null,
      parentGuardianEmail: null,
      parentGuardianConsentConfirmed,
      parentGuardianEmailError: "Enter a valid parent or guardian email address.",
    };
  }

  return {
    isValid: true,
    parentGuardianName: normalizedName || null,
    parentGuardianEmail: normalizedEmail || null,
    parentGuardianConsentConfirmed,
  };
}

export function getParentGuardianContactErrorMessage(
  validation: ParentGuardianContactValidation
) {
  return (
    validation.parentGuardianNameError ??
    validation.parentGuardianEmailError ??
    "Parent or guardian details could not be saved."
  );
}

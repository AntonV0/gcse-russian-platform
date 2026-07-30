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

  if (!normalizedName) {
    return {
      isValid: false,
      parentGuardianName: null,
      parentGuardianEmail: normalizedEmail || null,
      parentGuardianPhone: normalizedPhone || null,
      parentGuardianConsentConfirmed,
      parentGuardianNameError: "Enter the parent or guardian's name.",
    };
  }

  if (normalizedName.length > MAX_PARENT_GUARDIAN_NAME_LENGTH) {
    return {
      isValid: false,
      parentGuardianName: null,
      parentGuardianEmail: normalizedEmail || null,
      parentGuardianPhone: normalizedPhone || null,
      parentGuardianConsentConfirmed,
      parentGuardianNameError: `Use ${MAX_PARENT_GUARDIAN_NAME_LENGTH} characters or fewer.`,
    };
  }

  if (!normalizedEmail) {
    return {
      isValid: false,
      parentGuardianName: normalizedName,
      parentGuardianEmail: null,
      parentGuardianPhone: normalizedPhone || null,
      parentGuardianConsentConfirmed,
      parentGuardianEmailError: "Enter the parent or guardian's email address.",
    };
  }

  if (normalizedEmail.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(normalizedEmail)) {
    return {
      isValid: false,
      parentGuardianName: normalizedName,
      parentGuardianEmail: null,
      parentGuardianPhone: normalizedPhone || null,
      parentGuardianConsentConfirmed,
      parentGuardianEmailError: "Enter a valid parent or guardian email address.",
    };
  }

  const phoneDigits = normalizedPhone.replace(/\D/g, "");

  if (!normalizedPhone) {
    return {
      isValid: false,
      parentGuardianName: normalizedName,
      parentGuardianEmail: normalizedEmail,
      parentGuardianPhone: null,
      parentGuardianConsentConfirmed,
      parentGuardianPhoneError: "Enter the parent or guardian's phone number.",
    };
  }

  if (
    normalizedPhone.length > MAX_PHONE_LENGTH ||
    !PHONE_PATTERN.test(normalizedPhone) ||
    phoneDigits.length < 7 ||
    phoneDigits.length > 15
  ) {
    return {
      isValid: false,
      parentGuardianName: normalizedName,
      parentGuardianEmail: normalizedEmail,
      parentGuardianPhone: null,
      parentGuardianConsentConfirmed,
      parentGuardianPhoneError: "Enter a valid parent or guardian phone number.",
    };
  }

  if (!parentGuardianConsentConfirmed) {
    return {
      isValid: false,
      parentGuardianName: normalizedName,
      parentGuardianEmail: normalizedEmail,
      parentGuardianPhone: normalizedPhone,
      parentGuardianConsentConfirmed: false,
      parentGuardianConsentError:
        "Confirm that the parent or guardian knows about this account.",
    };
  }

  return {
    isValid: true,
    parentGuardianName: normalizedName,
    parentGuardianEmail: normalizedEmail,
    parentGuardianPhone: normalizedPhone,
    parentGuardianConsentConfirmed: true,
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

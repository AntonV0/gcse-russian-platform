export type PasswordUpdateValidation = {
  isValid: boolean;
  passwordError?: string;
  confirmPasswordError?: string;
};

const MIN_PASSWORD_LENGTH = 8;

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

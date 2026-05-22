import { describe, expect, it } from "vitest";
import {
  getParentGuardianContactErrorMessage,
  getPasswordUpdateErrorMessage,
  validateParentGuardianContact,
  validatePasswordUpdate,
} from "@/lib/account/settings-validation";

describe("validatePasswordUpdate", () => {
  it("requires a new password", () => {
    const result = validatePasswordUpdate({
      password: "",
      confirmPassword: "",
    });

    expect(result).toEqual({
      isValid: false,
      passwordError: "Enter a new password.",
    });
    expect(getPasswordUpdateErrorMessage(result)).toBe("Enter a new password.");
  });

  it("requires at least eight characters", () => {
    expect(
      validatePasswordUpdate({
        password: "short",
        confirmPassword: "short",
      })
    ).toEqual({
      isValid: false,
      passwordError: "Use at least 8 characters.",
    });
  });

  it("requires confirmation", () => {
    expect(
      validatePasswordUpdate({
        password: "long-enough",
        confirmPassword: "",
      })
    ).toEqual({
      isValid: false,
      confirmPasswordError: "Confirm the new password.",
    });
  });

  it("rejects mismatched passwords", () => {
    expect(
      validatePasswordUpdate({
        password: "long-enough",
        confirmPassword: "different",
      })
    ).toEqual({
      isValid: false,
      confirmPasswordError: "Passwords do not match.",
    });
  });

  it("accepts matching passwords", () => {
    expect(
      validatePasswordUpdate({
        password: "long-enough",
        confirmPassword: "long-enough",
      })
    ).toEqual({ isValid: true });
  });
});

describe("validateParentGuardianContact", () => {
  it("accepts empty optional parent or guardian details", () => {
    expect(
      validateParentGuardianContact({
        parentGuardianName: "",
        parentGuardianEmail: "",
      })
    ).toEqual({
      isValid: true,
      parentGuardianName: null,
      parentGuardianEmail: null,
      parentGuardianConsentConfirmed: false,
    });
  });

  it("normalizes a provided parent or guardian email", () => {
    expect(
      validateParentGuardianContact({
        parentGuardianName: "  Parent Name  ",
        parentGuardianEmail: "  PARENT@EXAMPLE.COM  ",
        parentGuardianConsentConfirmed: true,
      })
    ).toEqual({
      isValid: true,
      parentGuardianName: "Parent Name",
      parentGuardianEmail: "parent@example.com",
      parentGuardianConsentConfirmed: true,
    });
  });

  it("rejects an invalid parent or guardian email", () => {
    const result = validateParentGuardianContact({
      parentGuardianEmail: "not-an-email",
    });

    expect(result).toEqual({
      isValid: false,
      parentGuardianName: null,
      parentGuardianEmail: null,
      parentGuardianConsentConfirmed: false,
      parentGuardianEmailError: "Enter a valid parent or guardian email address.",
    });
    expect(getParentGuardianContactErrorMessage(result)).toBe(
      "Enter a valid parent or guardian email address."
    );
  });
});

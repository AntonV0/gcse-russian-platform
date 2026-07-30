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
        parentGuardianPhone: "",
      })
    ).toEqual({
      isValid: true,
      parentGuardianName: null,
      parentGuardianEmail: null,
      parentGuardianPhone: null,
      parentGuardianConsentConfirmed: false,
    });
  });

  it("normalizes a complete parent or guardian contact", () => {
    expect(
      validateParentGuardianContact({
        parentGuardianName: "  Parent Name  ",
        parentGuardianEmail: "  PARENT@EXAMPLE.COM  ",
        parentGuardianPhone: "  +44 7700 900123  ",
        parentGuardianConsentConfirmed: true,
      })
    ).toEqual({
      isValid: true,
      parentGuardianName: "Parent Name",
      parentGuardianEmail: "parent@example.com",
      parentGuardianPhone: "+44 7700 900123",
      parentGuardianConsentConfirmed: true,
    });
  });

  it("rejects an invalid parent or guardian email", () => {
    const result = validateParentGuardianContact({
      parentGuardianName: "Parent Name",
      parentGuardianEmail: "not-an-email",
      parentGuardianPhone: "+44 7700 900123",
      parentGuardianConsentConfirmed: true,
    });

    expect(result).toEqual({
      isValid: false,
      parentGuardianName: "Parent Name",
      parentGuardianEmail: null,
      parentGuardianPhone: "+44 7700 900123",
      parentGuardianConsentConfirmed: true,
      parentGuardianEmailError: "Enter a valid parent or guardian email address.",
    });
    expect(getParentGuardianContactErrorMessage(result)).toBe(
      "Enter a valid parent or guardian email address."
    );
  });

  it("requires email, phone, and adult confirmation when details are started", () => {
    const result = validateParentGuardianContact({
      parentGuardianName: "Parent Name",
    });

    expect(result).toMatchObject({
      isValid: false,
      parentGuardianEmailError: "Enter the parent or guardian's email address.",
      parentGuardianPhoneError: "Enter the parent or guardian's phone number.",
      parentGuardianConsentError:
        "Confirm that the parent or guardian knows about this account.",
    });
  });

  it("rejects a malformed phone number", () => {
    expect(
      validateParentGuardianContact({
        parentGuardianName: "Parent Name",
        parentGuardianEmail: "parent@example.com",
        parentGuardianPhone: "call me maybe",
        parentGuardianConsentConfirmed: true,
      }).parentGuardianPhoneError
    ).toBe("Enter a valid parent or guardian phone number.");
  });
});

import { describe, expect, it } from "vitest";
import {
  getPasswordUpdateErrorMessage,
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

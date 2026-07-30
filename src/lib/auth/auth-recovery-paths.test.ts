import { describe, expect, it } from "vitest";
import {
  getForgotPasswordPath,
  getFriendlyLoginErrorMessage,
  getPasswordSettingsPath,
} from "@/lib/auth/auth-recovery-paths";

describe("auth recovery paths", () => {
  it("turns Supabase login errors into useful, non-technical messages", () => {
    expect(getFriendlyLoginErrorMessage("Invalid login credentials")).toBe(
      "The email address or password was not recognised."
    );
    expect(getFriendlyLoginErrorMessage("Email not confirmed")).toBe(
      "Confirm the account email before logging in."
    );
    expect(getFriendlyLoginErrorMessage("fetch failed")).toBe(
      "We could not reach the account service. Please try again in a moment."
    );
  });

  it("preserves a safe recovery destination and originating resource", () => {
    expect(
      getForgotPasswordPath({
        source: "app",
        next: "/onboarding?next=%2Fgrammar",
        returnTo: "/grammar",
      })
    ).toBe(
      "/forgot-password?from=app&next=%2Fonboarding%3Fnext%3D%252Fgrammar&returnTo=%2Fgrammar"
    );
  });

  it("drops external recovery destinations", () => {
    expect(
      getForgotPasswordPath({
        next: "https://example.com",
        returnTo: "//example.com",
      })
    ).toBe("/forgot-password");
  });

  it("preserves the post-reset destination through password settings", () => {
    expect(
      getPasswordSettingsPath({
        next: "/onboarding?next=%2Fgrammar",
        returnTo: "/grammar",
      })
    ).toBe(
      "/settings?passwordReset=1&next=%2Fonboarding%3Fnext%3D%252Fgrammar&returnTo=%2Fgrammar"
    );
  });
});

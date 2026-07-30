import { describe, expect, it } from "vitest";
import {
  getSignupConfirmationPath,
  getSignupEmailRedirectUrl,
  getSignupOnboardingPath,
} from "@/lib/auth/signup-redirects";

describe("signup redirect paths", () => {
  it("carries the original destination into onboarding", () => {
    expect(getSignupOnboardingPath("/vocabulary?theme=school")).toBe(
      "/onboarding?next=%2Fvocabulary%3Ftheme%3Dschool"
    );
  });

  it("builds an auth callback that returns to onboarding", () => {
    const redirectUrl = new URL(getSignupEmailRedirectUrl("/grammar"));

    expect(redirectUrl.pathname).toBe("/auth/callback");
    expect(redirectUrl.searchParams.get("next")).toBe("/onboarding?next=%2Fgrammar");
  });

  it("builds a confirmation page without exposing the email address", () => {
    expect(
      getSignupConfirmationPath({
        destinationPath: "/vocabulary",
        source: "app",
      })
    ).toBe("/signup/confirm-email?next=%2Fvocabulary&from=app");
  });
});

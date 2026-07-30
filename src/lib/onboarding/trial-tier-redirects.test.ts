import { describe, expect, it } from "vitest";
import {
  getExistingTrialTierRedirectPath,
  getTrialTierErrorRedirectPath,
  getTrialTierSuccessRedirectPath,
} from "@/lib/onboarding/trial-tier-redirects";

describe("trial tier redirect paths", () => {
  it("continues onboarding tier choice to the optional profile step", () => {
    expect(getExistingTrialTierRedirectPath(true, "/vocabulary")).toBe(
      "/onboarding?step=profile&next=%2Fvocabulary"
    );
    expect(getTrialTierSuccessRedirectPath(true, "/vocabulary")).toBe(
      "/onboarding?step=profile&next=%2Fvocabulary"
    );
  });

  it("keeps onboarding errors in context", () => {
    expect(getTrialTierErrorRedirectPath(true, "trial-grant-failed", "/grammar")).toBe(
      "/onboarding?error=trial-grant-failed&next=%2Fgrammar"
    );
  });

  it("keeps dashboard tier choice on the dashboard flow", () => {
    expect(getExistingTrialTierRedirectPath(false)).toBe("/dashboard");
    expect(getTrialTierSuccessRedirectPath(false)).toBe(
      "/dashboard?success=trial-started"
    );
  });
});

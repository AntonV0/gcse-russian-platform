import { describe, expect, it } from "vitest";
import {
  getExistingTrialTierRedirectPath,
  getTrialTierSuccessRedirectPath,
} from "@/lib/onboarding/trial-tier-redirects";

describe("trial tier redirect paths", () => {
  it("continues onboarding tier choice to the optional profile step", () => {
    expect(getExistingTrialTierRedirectPath(true)).toBe("/onboarding?step=profile");
    expect(getTrialTierSuccessRedirectPath(true)).toBe("/onboarding?step=profile");
  });

  it("keeps dashboard tier choice on the dashboard flow", () => {
    expect(getExistingTrialTierRedirectPath(false)).toBe("/dashboard");
    expect(getTrialTierSuccessRedirectPath(false)).toBe(
      "/dashboard?success=trial-started"
    );
  });
});

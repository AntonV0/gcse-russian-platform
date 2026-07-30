import { describe, expect, it } from "vitest";
import {
  appendAuthDestination,
  appendSignupDestination,
  getAuthRedirectPath,
  getPostOnboardingRedirectPath,
  getSafeAuthRedirectPath,
} from "@/lib/auth/redirect-paths";

describe("auth redirect paths", () => {
  it("accepts internal app paths", () => {
    expect(getSafeAuthRedirectPath("/dashboard")).toBe("/dashboard");
    expect(getSafeAuthRedirectPath("/mock-exams?tab=drafts#latest")).toBe(
      "/mock-exams?tab=drafts#latest"
    );
  });

  it("rejects external or ambiguous paths", () => {
    expect(getSafeAuthRedirectPath("https://example.com")).toBeNull();
    expect(getSafeAuthRedirectPath("//example.com/dashboard")).toBeNull();
    expect(getSafeAuthRedirectPath("dashboard")).toBeNull();
    expect(getSafeAuthRedirectPath("/dashboard\\evil")).toBeNull();
    expect(getSafeAuthRedirectPath("/dashboard\n/profile")).toBeNull();
  });

  it("falls back for unsafe login next values", () => {
    expect(getAuthRedirectPath("//example.com", "/dashboard")).toBe("/dashboard");
    expect(getAuthRedirectPath("/progress", "/dashboard")).toBe("/progress");
  });
});

describe("post-onboarding redirect paths", () => {
  it("returns a safe guest destination", () => {
    expect(getPostOnboardingRedirectPath("/vocabulary?set=basics")).toBe(
      "/vocabulary?set=basics"
    );
  });

  it("prevents auth and onboarding loops", () => {
    expect(getPostOnboardingRedirectPath("/signup?from=app")).toBe("/dashboard");
    expect(getPostOnboardingRedirectPath("/signup/confirm-email")).toBe("/dashboard");
    expect(getPostOnboardingRedirectPath("/onboarding?step=profile")).toBe("/dashboard");
    expect(getPostOnboardingRedirectPath("/auth/callback?code=secret")).toBe(
      "/dashboard"
    );
  });

  it("adds the current route to app signup links", () => {
    expect(appendSignupDestination("/signup?from=app", "/grammar")).toBe(
      "/signup?from=app&next=%2Fgrammar"
    );
    expect(appendSignupDestination("/signup", "/grammar")).toBe("/signup");
  });

  it("adds the current route to app login links", () => {
    expect(appendAuthDestination("/login?from=app", "/vocabulary")).toBe(
      "/login?from=app&next=%2Fvocabulary"
    );
    expect(appendAuthDestination("/login?from=app&next=%2Fprogress", "/vocabulary")).toBe(
      "/login?from=app&next=%2Fprogress"
    );
    expect(appendAuthDestination("/login", "/vocabulary")).toBe("/login");
  });
});

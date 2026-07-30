import { describe, expect, it } from "vitest";
import {
  getAuthRedirectPath,
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

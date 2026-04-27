import { describe, expect, it } from "vitest";
import {
  buildCheckoutRedirectUrl,
  normalizeAppBaseUrl,
  normalizeInternalRedirectPath,
  resolveOptionalInternalRedirectPath,
} from "@/lib/billing/redirect-paths";

describe("normalizeInternalRedirectPath", () => {
  it("accepts internal relative paths", () => {
    expect(normalizeInternalRedirectPath("/account")).toBe("/account");
    expect(normalizeInternalRedirectPath("/account/billing?tab=plan#current")).toBe(
      "/account/billing?tab=plan#current"
    );
  });

  it("rejects external or ambiguous paths", () => {
    expect(normalizeInternalRedirectPath("https://evil.example")).toBeNull();
    expect(normalizeInternalRedirectPath("//evil.example/path")).toBeNull();
    expect(normalizeInternalRedirectPath("account")).toBeNull();
    expect(normalizeInternalRedirectPath("/account\\evil")).toBeNull();
    expect(normalizeInternalRedirectPath(" /account")).toBeNull();
    expect(normalizeInternalRedirectPath("/account\nbilling")).toBeNull();
  });
});

describe("resolveOptionalInternalRedirectPath", () => {
  it("uses the fallback only when the value is omitted", () => {
    expect(resolveOptionalInternalRedirectPath(undefined, "/account")).toBe("/account");
    expect(resolveOptionalInternalRedirectPath(null, "/account")).toBe("/account");
    expect(resolveOptionalInternalRedirectPath("//evil.example", "/account")).toBeNull();
  });
});

describe("buildCheckoutRedirectUrl", () => {
  it("preserves existing query strings when appending checkout state", () => {
    expect(
      buildCheckoutRedirectUrl(
        "https://app.example.com",
        "/account/billing?tab=plan",
        "success"
      )
    ).toBe("https://app.example.com/account/billing?tab=plan&checkout=success");
  });

  it("normalizes host-only app URLs", () => {
    expect(normalizeAppBaseUrl("app.example.com/")).toBe("https://app.example.com");
  });
});

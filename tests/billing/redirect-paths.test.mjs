import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildCheckoutRedirectUrl,
  normalizeAppBaseUrl,
  normalizeInternalRedirectPath,
  resolveOptionalInternalRedirectPath,
} from "../../src/lib/billing/redirect-paths.js";

describe("normalizeInternalRedirectPath", () => {
  it("accepts internal relative paths", () => {
    assert.equal(normalizeInternalRedirectPath("/account"), "/account");
    assert.equal(
      normalizeInternalRedirectPath("/account/billing?tab=plan#current"),
      "/account/billing?tab=plan#current"
    );
  });

  it("rejects external or ambiguous paths", () => {
    assert.equal(normalizeInternalRedirectPath("https://evil.example"), null);
    assert.equal(normalizeInternalRedirectPath("//evil.example/path"), null);
    assert.equal(normalizeInternalRedirectPath("account"), null);
    assert.equal(normalizeInternalRedirectPath("/account\\evil"), null);
    assert.equal(normalizeInternalRedirectPath(" /account"), null);
    assert.equal(normalizeInternalRedirectPath("/account\nbilling"), null);
  });
});

describe("resolveOptionalInternalRedirectPath", () => {
  it("uses the fallback only when the value is omitted", () => {
    assert.equal(resolveOptionalInternalRedirectPath(undefined, "/account"), "/account");
    assert.equal(resolveOptionalInternalRedirectPath(null, "/account"), "/account");
    assert.equal(resolveOptionalInternalRedirectPath("//evil.example", "/account"), null);
  });
});

describe("buildCheckoutRedirectUrl", () => {
  it("preserves existing query strings when appending checkout state", () => {
    assert.equal(
      buildCheckoutRedirectUrl(
        "https://app.example.com",
        "/account/billing?tab=plan",
        "success"
      ),
      "https://app.example.com/account/billing?tab=plan&checkout=success"
    );
  });

  it("normalizes host-only app URLs", () => {
    assert.equal(
      normalizeAppBaseUrl("app.example.com/"),
      "https://app.example.com"
    );
  });
});

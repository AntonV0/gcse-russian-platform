import { describe, expect, it } from "vitest";
import {
  isSubscriptionActiveStatus,
  shouldDeactivateStripeSubscriptionAccess,
} from "@/lib/billing/subscription-status";

describe("subscription status access decisions", () => {
  it("keeps access grant paths active for active and trialing subscriptions", () => {
    expect(isSubscriptionActiveStatus("active")).toBe(true);
    expect(isSubscriptionActiveStatus("trialing")).toBe(true);
    expect(shouldDeactivateStripeSubscriptionAccess("active")).toBe(false);
    expect(shouldDeactivateStripeSubscriptionAccess("trialing")).toBe(false);
  });

  it("deactivates Stripe-sourced grants for inactive lifecycle statuses", () => {
    for (const status of [
      "canceled",
      "incomplete",
      "incomplete_expired",
      "past_due",
      "paused",
      "unpaid",
    ]) {
      expect(shouldDeactivateStripeSubscriptionAccess(status)).toBe(true);
    }
  });
});

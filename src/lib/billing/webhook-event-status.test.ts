import { describe, expect, it } from "vitest";
import { getStripeWebhookEventProcessingAction } from "@/lib/billing/webhook-event-status";

const NOW = new Date("2026-04-27T12:00:00.000Z");

describe("getStripeWebhookEventProcessingAction", () => {
  it("claims unseen events", () => {
    expect(getStripeWebhookEventProcessingAction(null, NOW)).toBe("insert");
  });

  it("skips events already processed", () => {
    expect(
      getStripeWebhookEventProcessingAction(
        { status: "processed", processing_started_at: NOW.toISOString() },
        NOW
      )
    ).toBe("skip_processed");
  });

  it("skips events that another request is actively processing", () => {
    expect(
      getStripeWebhookEventProcessingAction(
        {
          status: "processing",
          processing_started_at: "2026-04-27T11:55:00.000Z",
        },
        NOW
      )
    ).toBe("skip_processing");
  });

  it("retries failed or stale processing events", () => {
    expect(
      getStripeWebhookEventProcessingAction(
        { status: "failed", processing_started_at: NOW.toISOString() },
        NOW
      )
    ).toBe("retry_failed");
    expect(
      getStripeWebhookEventProcessingAction(
        {
          status: "processing",
          processing_started_at: "2026-04-27T11:40:00.000Z",
        },
        NOW
      )
    ).toBe("retry_stale_processing");
  });
});

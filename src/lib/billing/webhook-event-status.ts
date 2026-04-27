export const STRIPE_WEBHOOK_EVENT_PROCESSING_STALE_MS = 15 * 60 * 1000;

export type StripeWebhookEventStatus = "processing" | "processed" | "failed";

export type StripeWebhookEventStatusRecord = {
  status: StripeWebhookEventStatus;
  processing_started_at: string | null;
};

export type StripeWebhookEventProcessingAction =
  | "insert"
  | "retry_failed"
  | "retry_stale_processing"
  | "skip_processed"
  | "skip_processing";

export function getStripeWebhookEventProcessingAction(
  record: StripeWebhookEventStatusRecord | null,
  now = new Date(),
  staleAfterMs = STRIPE_WEBHOOK_EVENT_PROCESSING_STALE_MS
): StripeWebhookEventProcessingAction {
  if (!record) {
    return "insert";
  }

  if (record.status === "processed") {
    return "skip_processed";
  }

  if (record.status === "failed") {
    return "retry_failed";
  }

  if (!record.processing_started_at) {
    return "retry_stale_processing";
  }

  const processingStartedAt = new Date(record.processing_started_at);

  if (Number.isNaN(processingStartedAt.getTime())) {
    return "retry_stale_processing";
  }

  if (now.getTime() - processingStartedAt.getTime() >= staleAfterMs) {
    return "retry_stale_processing";
  }

  return "skip_processing";
}

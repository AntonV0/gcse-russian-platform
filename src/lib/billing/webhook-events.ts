import { createServiceRoleClient } from "@/lib/supabase/admin";
import {
  STRIPE_WEBHOOK_EVENT_PROCESSING_STALE_MS,
  getStripeWebhookEventProcessingAction,
  type StripeWebhookEventStatus,
} from "@/lib/billing/webhook-event-status";

type DbStripeWebhookEvent = {
  id: string;
  event_type: string;
  livemode: boolean;
  status: StripeWebhookEventStatus;
  processing_started_at: string | null;
  processed_at: string | null;
  failed_at: string | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
};

export type StripeWebhookEventProcessingClaim =
  | { shouldProcess: true }
  | { shouldProcess: false; reason: "already_processed" | "already_processing" };

const STRIPE_WEBHOOK_EVENT_SELECT =
  "id, event_type, livemode, status, processing_started_at, processed_at, failed_at, last_error, created_at, updated_at";

function getSafeFailureSummary(error: unknown): string {
  if (error instanceof Error) {
    return error.name || "Error";
  }

  return "UnknownError";
}

async function getStripeWebhookEventDb(
  eventId: string
): Promise<DbStripeWebhookEvent | null> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("stripe_webhook_events")
    .select(STRIPE_WEBHOOK_EVENT_SELECT)
    .eq("id", eventId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching Stripe webhook event state:", {
      eventId,
      error,
    });
    throw new Error("Failed to fetch Stripe webhook event state");
  }

  return (data ?? null) as DbStripeWebhookEvent | null;
}

export async function claimStripeWebhookEventProcessingDb(params: {
  eventId: string;
  eventType: string;
  livemode: boolean;
}): Promise<StripeWebhookEventProcessingClaim> {
  const supabase = createServiceRoleClient();
  const now = new Date();
  const nowIso = now.toISOString();

  const { error: insertError } = await supabase.from("stripe_webhook_events").insert({
    id: params.eventId,
    event_type: params.eventType,
    livemode: params.livemode,
    status: "processing",
    processing_started_at: nowIso,
    updated_at: nowIso,
  });

  if (!insertError) {
    return { shouldProcess: true };
  }

  if (insertError.code !== "23505") {
    console.error("Error claiming Stripe webhook event:", {
      eventId: params.eventId,
      eventType: params.eventType,
      error: insertError,
    });
    throw new Error("Failed to claim Stripe webhook event");
  }

  const existingEvent = await getStripeWebhookEventDb(params.eventId);
  const action = getStripeWebhookEventProcessingAction(existingEvent, now);

  if (action === "skip_processed") {
    return { shouldProcess: false, reason: "already_processed" };
  }

  if (action === "skip_processing") {
    return { shouldProcess: false, reason: "already_processing" };
  }

  const updatePayload = {
    event_type: params.eventType,
    livemode: params.livemode,
    status: "processing" as const,
    processing_started_at: nowIso,
    updated_at: nowIso,
  };

  const updateQuery = supabase
    .from("stripe_webhook_events")
    .update(updatePayload)
    .eq("id", params.eventId)
    .neq("status", "processed");

  const conditionalUpdateQuery =
    action === "retry_stale_processing"
      ? updateQuery
          .eq("status", "processing")
          .lt(
            "processing_started_at",
            new Date(
              now.getTime() - STRIPE_WEBHOOK_EVENT_PROCESSING_STALE_MS
            ).toISOString()
          )
      : updateQuery.eq("status", "failed");

  const { data: claimedEvent, error: updateError } = await conditionalUpdateQuery
    .select(STRIPE_WEBHOOK_EVENT_SELECT)
    .maybeSingle();

  if (updateError) {
    console.error("Error reclaiming Stripe webhook event:", {
      eventId: params.eventId,
      eventType: params.eventType,
      error: updateError,
    });
    throw new Error("Failed to reclaim Stripe webhook event");
  }

  if (!claimedEvent) {
    return { shouldProcess: false, reason: "already_processing" };
  }

  return { shouldProcess: true };
}

export async function recordStripeWebhookEventProcessedDb(
  eventId: string
): Promise<void> {
  const supabase = createServiceRoleClient();
  const nowIso = new Date().toISOString();

  const { error } = await supabase
    .from("stripe_webhook_events")
    .update({
      status: "processed",
      processed_at: nowIso,
      failed_at: null,
      last_error: null,
      updated_at: nowIso,
    })
    .eq("id", eventId);

  if (error) {
    console.error("Error recording processed Stripe webhook event:", {
      eventId,
      error,
    });
    throw new Error("Failed to record processed Stripe webhook event");
  }
}

export async function recordStripeWebhookEventFailedDb(
  eventId: string,
  error: unknown
): Promise<void> {
  const supabase = createServiceRoleClient();
  const nowIso = new Date().toISOString();

  const { error: updateError } = await supabase
    .from("stripe_webhook_events")
    .update({
      status: "failed",
      failed_at: nowIso,
      last_error: getSafeFailureSummary(error),
      updated_at: nowIso,
    })
    .eq("id", eventId);

  if (updateError) {
    console.error("Error recording failed Stripe webhook event:", {
      eventId,
      error: updateError,
    });
  }
}

import type Stripe from "stripe";
import { isSubscriptionActiveStatus } from "@/lib/billing/subscriptions";

export function fromUnixTimestamp(value?: number | null): string | null {
  if (!value) return null;
  return new Date(value * 1000).toISOString();
}

export function getMetadataValue(
  metadata: Stripe.Metadata | null | undefined,
  snakeKey: string,
  camelKey: string
): string | null {
  if (!metadata) return null;
  return metadata[snakeKey] ?? metadata[camelKey] ?? null;
}

export function getSubscriptionCustomerId(
  subscription: Stripe.Subscription
): string | null {
  return typeof subscription.customer === "string" ? subscription.customer : null;
}

export function getSubscriptionPeriod(subscription: Stripe.Subscription): {
  startsAt: string | null;
  endsAt: string | null;
} {
  const subscriptionItem = subscription.items.data[0] ?? null;
  const subscriptionPeriod = subscription as Stripe.Subscription & {
    current_period_start?: number | null;
    current_period_end?: number | null;
  };

  return {
    startsAt: fromUnixTimestamp(
      subscriptionItem?.current_period_start ?? subscriptionPeriod.current_period_start
    ),
    endsAt: fromUnixTimestamp(
      subscriptionItem?.current_period_end ?? subscriptionPeriod.current_period_end
    ),
  };
}

export function assertActiveSubscriptionHasEndDate(
  subscription: Stripe.Subscription,
  endsAt: string | null
): void {
  if (!isSubscriptionActiveStatus(subscription.status)) {
    return;
  }

  if (endsAt) {
    return;
  }

  console.error("Active Stripe subscription is missing a period end:", {
    subscriptionId: subscription.id,
    status: subscription.status,
  });

  throw new Error("Active subscription missing period end");
}

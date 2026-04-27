import type Stripe from "stripe";
import { getActivePriceByStripePriceIdDb } from "@/lib/billing/catalog";
import {
  deactivateActiveUserProductGrantsBySourceDb,
  grantProductAccessDb,
} from "@/lib/billing/grants";
import {
  getSubscriptionByProviderSubscriptionIdDb,
  upsertSubscriptionDb,
} from "@/lib/billing/subscriptions";
import { shouldDeactivateStripeSubscriptionAccess } from "@/lib/billing/subscription-status";
import {
  assertActiveSubscriptionHasEndDate,
  fromUnixTimestamp,
  getMetadataValue,
  getSubscriptionCustomerId,
  getSubscriptionPeriod,
} from "@/lib/billing/webhook-stripe-utils";

export async function syncSubscriptionRecordAndGrant(params: {
  userId: string;
  productId: string;
  priceId: string;
  subscription: Stripe.Subscription;
  startsAt: string | null;
  endsAt: string | null;
  customerId: string | null;
}): Promise<void> {
  assertActiveSubscriptionHasEndDate(params.subscription, params.endsAt);

  await upsertSubscriptionDb({
    userId: params.userId,
    productId: params.productId,
    priceId: params.priceId,
    provider: "stripe",
    providerCustomerId: params.customerId,
    providerSubscriptionId: params.subscription.id,
    status: params.subscription.status,
    currentPeriodStart: params.startsAt,
    currentPeriodEnd: params.endsAt,
    cancelAtPeriodEnd: params.subscription.cancel_at_period_end,
    canceledAt: fromUnixTimestamp(params.subscription.canceled_at),
  });

  await grantProductAccessDb({
    userId: params.userId,
    productId: params.productId,
    priceId: params.priceId,
    accessMode: "full",
    source: "stripe",
    startsAt: params.startsAt,
    endsAt: params.endsAt,
  });
}

async function resolveStripeSubscriptionContext(
  subscription: Stripe.Subscription
): Promise<{
  userId: string;
  productId: string;
  priceId: string;
  customerId: string | null;
}> {
  const existingSubscription = await getSubscriptionByProviderSubscriptionIdDb(
    subscription.id
  );
  const subscriptionItem = subscription.items.data[0] ?? null;
  const stripePriceId = subscriptionItem?.price?.id ?? null;
  const activePrice = stripePriceId
    ? await getActivePriceByStripePriceIdDb(stripePriceId)
    : null;

  const userId =
    getMetadataValue(subscription.metadata, "user_id", "userId") ??
    existingSubscription?.user_id ??
    null;
  const productId =
    activePrice?.product_id ??
    getMetadataValue(subscription.metadata, "product_id", "productId") ??
    existingSubscription?.product_id ??
    null;
  const priceId =
    activePrice?.id ??
    getMetadataValue(subscription.metadata, "price_id", "priceId") ??
    existingSubscription?.price_id ??
    null;
  const customerId =
    getSubscriptionCustomerId(subscription) ??
    existingSubscription?.provider_customer_id ??
    null;

  if (!userId || !productId || !priceId) {
    console.error("Stripe subscription webhook could not resolve access context:", {
      subscriptionId: subscription.id,
      stripePriceId,
      metadata: subscription.metadata,
      existingSubscriptionId: existingSubscription?.id ?? null,
    });

    throw new Error("Missing subscription access context");
  }

  return {
    userId,
    productId,
    priceId,
    customerId,
  };
}

export async function handleStripeSubscriptionLifecycle(
  subscription: Stripe.Subscription
): Promise<void> {
  const context = await resolveStripeSubscriptionContext(subscription);
  const { startsAt, endsAt } = getSubscriptionPeriod(subscription);
  assertActiveSubscriptionHasEndDate(subscription, endsAt);

  await upsertSubscriptionDb({
    userId: context.userId,
    productId: context.productId,
    priceId: context.priceId,
    provider: "stripe",
    providerCustomerId: context.customerId,
    providerSubscriptionId: subscription.id,
    status: subscription.status,
    currentPeriodStart: startsAt,
    currentPeriodEnd: endsAt,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    canceledAt: fromUnixTimestamp(subscription.canceled_at),
  });

  if (shouldDeactivateStripeSubscriptionAccess(subscription.status)) {
    const deactivateResult = await deactivateActiveUserProductGrantsBySourceDb(
      context.userId,
      context.productId,
      "stripe"
    );

    if (!deactivateResult.success) {
      throw new Error("Failed to deactivate inactive Stripe subscription grants");
    }

    return;
  }

  await grantProductAccessDb({
    userId: context.userId,
    productId: context.productId,
    priceId: context.priceId,
    accessMode: "full",
    source: "stripe",
    startsAt,
    endsAt,
  });
}

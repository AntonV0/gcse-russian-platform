import type Stripe from "stripe";
import {
  BILLING_TYPES,
  PRODUCT_CODES,
  getActivePriceByIdDb,
  getActivePricesForProductDb,
  getActiveProductByCodeDb,
  matchPriceByBillingShape,
} from "@/lib/billing/catalog";
import {
  deactivateActiveUserProductGrantsDb,
  grantProductAccessDb,
} from "@/lib/billing/grants";
import {
  getActiveUserSubscriptionsDb,
  upsertSubscriptionDb,
} from "@/lib/billing/subscriptions";
import { getStripeClient, switchStripeSubscriptionToPrice } from "@/lib/billing/stripe";

function fromUnixTimestamp(value?: number | null): string | null {
  if (!value) return null;
  return new Date(value * 1000).toISOString();
}

function getMetadataValue(
  metadata: Stripe.Metadata | null | undefined,
  snakeKey: string,
  camelKey: string
): string | null {
  if (!metadata) return null;
  return metadata[snakeKey] ?? metadata[camelKey] ?? null;
}

async function handleSubscriptionUpgradeCheckoutCompleted(params: {
  userId: string;
  targetProductId: string;
  checkoutPriceId: string;
}): Promise<void> {
  const higherProduct = await getActiveProductByCodeDb(PRODUCT_CODES.GCSE_RUSSIAN_HIGHER);
  const foundationProduct = await getActiveProductByCodeDb(
    PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION
  );

  if (!higherProduct || !foundationProduct) {
    throw new Error("Missing Foundation/Higher products for subscription upgrade");
  }

  if (params.targetProductId !== higherProduct.id) {
    throw new Error("Subscription upgrade target product is not supported");
  }

  const checkoutPrice = await getActivePriceByIdDb(params.checkoutPriceId);

  if (!checkoutPrice) {
    throw new Error("Upgrade checkout price not found");
  }

  if (checkoutPrice.billing_type !== BILLING_TYPES.SUBSCRIPTION) {
    throw new Error("Upgrade checkout price is not a subscription-shaped upgrade");
  }

  const activeSubscriptions = await getActiveUserSubscriptionsDb(params.userId);

  const sourceSubscription = activeSubscriptions.find(
    (subscription) =>
      subscription.product_id === foundationProduct.id &&
      !!subscription.provider_subscription_id
  );

  if (!sourceSubscription?.provider_subscription_id) {
    throw new Error("No active Foundation subscription found to upgrade");
  }

  const targetRecurringPrices = await getActivePricesForProductDb(higherProduct.id);
  const targetRecurringPrice = matchPriceByBillingShape(
    targetRecurringPrices,
    BILLING_TYPES.SUBSCRIPTION,
    checkoutPrice.interval_unit,
    checkoutPrice.interval_count
  );

  if (!targetRecurringPrice?.stripe_price_id) {
    throw new Error("No matching Higher recurring price found for subscription upgrade");
  }

  const updatedStripeSubscription = await switchStripeSubscriptionToPrice({
    providerSubscriptionId: sourceSubscription.provider_subscription_id,
    newStripePriceId: targetRecurringPrice.stripe_price_id,
  });

  const subscriptionItem = updatedStripeSubscription.items.data[0] ?? null;

  await upsertSubscriptionDb({
    userId: params.userId,
    productId: higherProduct.id,
    priceId: targetRecurringPrice.id,
    provider: "stripe",
    providerCustomerId:
      typeof updatedStripeSubscription.customer === "string"
        ? updatedStripeSubscription.customer
        : null,
    providerSubscriptionId: updatedStripeSubscription.id,
    status: updatedStripeSubscription.status,
    currentPeriodStart: fromUnixTimestamp(subscriptionItem?.current_period_start),
    currentPeriodEnd: fromUnixTimestamp(subscriptionItem?.current_period_end),
    cancelAtPeriodEnd: updatedStripeSubscription.cancel_at_period_end,
    canceledAt: fromUnixTimestamp(updatedStripeSubscription.canceled_at),
  });

  await grantProductAccessDb({
    userId: params.userId,
    productId: higherProduct.id,
    priceId: targetRecurringPrice.id,
    accessMode: "full",
    source: "stripe",
    startsAt: fromUnixTimestamp(subscriptionItem?.current_period_start),
    endsAt: fromUnixTimestamp(subscriptionItem?.current_period_end),
  });

  const deactivateResult = await deactivateActiveUserProductGrantsDb(
    params.userId,
    foundationProduct.id
  );

  if (!deactivateResult.success) {
    console.error(
      "Failed to deactivate Foundation grant after successful subscription upgrade",
      {
        userId: params.userId,
        foundationProductId: foundationProduct.id,
      }
    );
  }
}

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const userId = getMetadataValue(session.metadata, "user_id", "userId");
  const productId = getMetadataValue(session.metadata, "product_id", "productId");
  const priceId = getMetadataValue(session.metadata, "price_id", "priceId");
  const purchaseType = getMetadataValue(
    session.metadata,
    "purchase_type",
    "purchaseType"
  );

  if (!userId || !productId || !priceId) {
    console.error("Stripe webhook missing required checkout metadata:", {
      sessionId: session.id,
      metadata: session.metadata,
    });

    throw new Error("Missing checkout metadata");
  }

  const checkoutPrice = await getActivePriceByIdDb(priceId);

  if (!checkoutPrice) {
    throw new Error("Checkout price could not be loaded from metadata");
  }

  if (
    session.mode === "payment" &&
    purchaseType === "upgrade" &&
    checkoutPrice.billing_type === BILLING_TYPES.SUBSCRIPTION
  ) {
    await handleSubscriptionUpgradeCheckoutCompleted({
      userId,
      targetProductId: productId,
      checkoutPriceId: priceId,
    });

    return;
  }

  if (session.mode === "subscription") {
    const stripe = getStripeClient();

    if (!session.subscription) {
      console.error("Subscription checkout completed without subscription id:", {
        sessionId: session.id,
      });

      throw new Error("Missing subscription id");
    }

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    const subscriptionItem = subscription.items.data[0] ?? null;

    await upsertSubscriptionDb({
      userId,
      productId,
      priceId,
      provider: "stripe",
      providerCustomerId: typeof session.customer === "string" ? session.customer : null,
      providerSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodStart: fromUnixTimestamp(subscriptionItem?.current_period_start),
      currentPeriodEnd: fromUnixTimestamp(subscriptionItem?.current_period_end),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: fromUnixTimestamp(subscription.canceled_at),
    });

    await grantProductAccessDb({
      userId,
      productId,
      priceId,
      accessMode: "full",
      source: "stripe",
      startsAt: fromUnixTimestamp(subscriptionItem?.current_period_start),
      endsAt: fromUnixTimestamp(subscriptionItem?.current_period_end),
    });

    return;
  }

  if (session.mode === "payment") {
    await grantProductAccessDb({
      userId,
      productId,
      priceId,
      accessMode: "full",
      source: "stripe",
      startsAt: new Date().toISOString(),
      endsAt: null,
    });
  }
}

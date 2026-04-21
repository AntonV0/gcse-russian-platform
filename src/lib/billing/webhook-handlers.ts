import type Stripe from "stripe";
import {
  BILLING_TYPES,
  INTERVAL_UNITS,
  PRODUCT_CODES,
  getActivePriceByIdDb,
  getProductByIdDb,
  getUpgradeFlowForPath,
  matchPriceByBillingShape,
  getActivePricesForProductDb,
  getActiveProductByCodeDb,
  type DbPrice,
  type DbProduct,
  type UpgradeFlow,
} from "@/lib/billing/catalog";
import {
  deactivateActiveUserProductGrantsDb,
  grantProductAccessDb,
} from "@/lib/billing/grants";
import {
  getActiveUserSubscriptionsDb,
  upsertSubscriptionDb,
  type DbSubscription,
} from "@/lib/billing/subscriptions";
import {
  getStripeClient,
  switchStripeSubscriptionToPrice,
  switchStripeSubscriptionToThreeMonthAnchoredFromCurrentStart,
} from "@/lib/billing/stripe";

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

async function findSourceSubscriptionForUpgrade(params: {
  userId: string;
  targetProduct: DbProduct;
  targetPrice: DbPrice;
  upgradeFlow: UpgradeFlow;
}): Promise<{
  subscription: DbSubscription;
  sourceProduct: DbProduct;
  sourcePrice: DbPrice;
} | null> {
  const activeSubscriptions = await getActiveUserSubscriptionsDb(params.userId);

  const candidates: Array<{
    subscription: DbSubscription;
    sourceProduct: DbProduct;
    sourcePrice: DbPrice;
  }> = [];

  for (const subscription of activeSubscriptions) {
    if (!subscription.provider_subscription_id || !subscription.price_id) {
      continue;
    }

    const [sourceProduct, sourcePrice] = await Promise.all([
      getProductByIdDb(subscription.product_id),
      getActivePriceByIdDb(subscription.price_id),
    ]);

    if (!sourceProduct || !sourcePrice) {
      continue;
    }

    const flow = getUpgradeFlowForPath(
      sourceProduct.code,
      sourcePrice,
      params.targetProduct.code,
      params.targetPrice
    );

    if (flow !== params.upgradeFlow) {
      continue;
    }

    candidates.push({
      subscription,
      sourceProduct,
      sourcePrice,
    });
  }

  if (candidates.length === 0) {
    return null;
  }

  candidates.sort((a, b) => {
    const aSameProduct = a.sourceProduct.code === params.targetProduct.code ? 1 : 0;
    const bSameProduct = b.sourceProduct.code === params.targetProduct.code ? 1 : 0;
    return bSameProduct - aSameProduct;
  });

  return candidates[0];
}

async function handleSameCadenceSubscriptionUpgrade(params: {
  userId: string;
  targetProduct: DbProduct;
  targetPrice: DbPrice;
}): Promise<void> {
  if (!params.targetPrice.stripe_price_id) {
    throw new Error(
      "Target recurring Stripe price id is missing for same-cadence upgrade"
    );
  }

  const selectedSource = await findSourceSubscriptionForUpgrade({
    userId: params.userId,
    targetProduct: params.targetProduct,
    targetPrice: params.targetPrice,
    upgradeFlow: "same_cadence",
  });

  if (!selectedSource?.subscription.provider_subscription_id) {
    throw new Error("No active source subscription found for same-cadence upgrade");
  }

  const updatedStripeSubscription = await switchStripeSubscriptionToPrice({
    providerSubscriptionId: selectedSource.subscription.provider_subscription_id,
    newStripePriceId: params.targetPrice.stripe_price_id,
  });

  const subscriptionItem = updatedStripeSubscription.items.data[0] ?? null;

  await upsertSubscriptionDb({
    userId: params.userId,
    productId: params.targetProduct.id,
    priceId: params.targetPrice.id,
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
    productId: params.targetProduct.id,
    priceId: params.targetPrice.id,
    accessMode: "full",
    source: "stripe",
    startsAt: fromUnixTimestamp(subscriptionItem?.current_period_start),
    endsAt: fromUnixTimestamp(subscriptionItem?.current_period_end),
  });

  if (selectedSource.sourceProduct.id !== params.targetProduct.id) {
    const deactivateResult = await deactivateActiveUserProductGrantsDb(
      params.userId,
      selectedSource.sourceProduct.id
    );

    if (!deactivateResult.success) {
      console.error("Failed to deactivate source grant after same-cadence upgrade", {
        userId: params.userId,
        sourceProductId: selectedSource.sourceProduct.id,
      });
    }
  }
}

async function handleMonthlyToThreeMonthUpgrade(params: {
  userId: string;
  targetProduct: DbProduct;
  targetPrice: DbPrice;
}): Promise<void> {
  if (!params.targetPrice.stripe_price_id) {
    throw new Error(
      "Target recurring Stripe price id is missing for monthly-to-3-month upgrade"
    );
  }

  const selectedSource = await findSourceSubscriptionForUpgrade({
    userId: params.userId,
    targetProduct: params.targetProduct,
    targetPrice: params.targetPrice,
    upgradeFlow: "monthly_to_three_month",
  });

  if (!selectedSource?.subscription.provider_subscription_id) {
    throw new Error("No active source subscription found for monthly-to-3-month upgrade");
  }

  if (!selectedSource.subscription.current_period_start) {
    throw new Error("Source subscription current period start is missing");
  }

  const updatedStripeSubscription =
    await switchStripeSubscriptionToThreeMonthAnchoredFromCurrentStart({
      providerSubscriptionId: selectedSource.subscription.provider_subscription_id,
      newStripePriceId: params.targetPrice.stripe_price_id,
      currentPeriodStartIso: selectedSource.subscription.current_period_start,
    });

  const currentPeriodStart =
    selectedSource.subscription.current_period_start ??
    fromUnixTimestamp(updatedStripeSubscription.items.data[0]?.current_period_start);

  const currentPeriodEnd =
    updatedStripeSubscription.trial_end != null
      ? fromUnixTimestamp(updatedStripeSubscription.trial_end)
      : fromUnixTimestamp(updatedStripeSubscription.items.data[0]?.current_period_end);

  await upsertSubscriptionDb({
    userId: params.userId,
    productId: params.targetProduct.id,
    priceId: params.targetPrice.id,
    provider: "stripe",
    providerCustomerId:
      typeof updatedStripeSubscription.customer === "string"
        ? updatedStripeSubscription.customer
        : null,
    providerSubscriptionId: updatedStripeSubscription.id,
    status: updatedStripeSubscription.status,
    currentPeriodStart,
    currentPeriodEnd,
    cancelAtPeriodEnd: updatedStripeSubscription.cancel_at_period_end,
    canceledAt: fromUnixTimestamp(updatedStripeSubscription.canceled_at),
  });

  await grantProductAccessDb({
    userId: params.userId,
    productId: params.targetProduct.id,
    priceId: params.targetPrice.id,
    accessMode: "full",
    source: "stripe",
    startsAt: currentPeriodStart,
    endsAt: currentPeriodEnd,
  });

  if (selectedSource.sourceProduct.id !== params.targetProduct.id) {
    const deactivateResult = await deactivateActiveUserProductGrantsDb(
      params.userId,
      selectedSource.sourceProduct.id
    );

    if (!deactivateResult.success) {
      console.error(
        "Failed to deactivate source grant after monthly-to-3-month upgrade",
        {
          userId: params.userId,
          sourceProductId: selectedSource.sourceProduct.id,
        }
      );
    }
  }
}

async function handleLifetimeUpgrade(params: {
  userId: string;
  targetProduct: DbProduct;
  targetPrice: DbPrice;
}): Promise<void> {
  const foundationProduct = await getProductByIdDb(params.targetProduct.id);
  void foundationProduct;

  await grantProductAccessDb({
    userId: params.userId,
    productId: params.targetProduct.id,
    priceId: params.targetPrice.id,
    accessMode: "full",
    source: "stripe",
    startsAt: new Date().toISOString(),
    endsAt: null,
  });

  const foundation = await getActivePricesForProductDb(params.targetProduct.id);
  void foundation;
}

async function deactivateFoundationIfTargetIsHigher(params: {
  userId: string;
  targetProduct: DbProduct;
}): Promise<void> {
  const foundationProduct = await getActivePricesForProductDb(params.targetProduct.id);
  void foundationProduct;
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
  const upgradeFlowValue = getMetadataValue(
    session.metadata,
    "upgrade_flow",
    "upgradeFlow"
  );

  if (!userId || !productId || !priceId) {
    console.error("Stripe webhook missing required checkout metadata:", {
      sessionId: session.id,
      metadata: session.metadata,
    });

    throw new Error("Missing checkout metadata");
  }

  const [targetProduct, targetPrice] = await Promise.all([
    getProductByIdDb(productId),
    getActivePriceByIdDb(priceId),
  ]);

  if (!targetProduct || !targetPrice) {
    throw new Error(
      "Target product or target price could not be loaded from webhook metadata"
    );
  }

  if (purchaseType === "upgrade") {
    const upgradeFlow = (upgradeFlowValue || null) as UpgradeFlow | null;

    if (!upgradeFlow) {
      throw new Error("Upgrade checkout missing upgrade flow metadata");
    }

    if (upgradeFlow === "same_cadence") {
      await handleSameCadenceSubscriptionUpgrade({
        userId,
        targetProduct,
        targetPrice,
      });
      return;
    }

    if (upgradeFlow === "monthly_to_three_month") {
      await handleMonthlyToThreeMonthUpgrade({
        userId,
        targetProduct,
        targetPrice,
      });
      return;
    }

    if (upgradeFlow === "lifetime") {
      await grantProductAccessDb({
        userId,
        productId: targetProduct.id,
        priceId: targetPrice.id,
        accessMode: "full",
        source: "stripe",
        startsAt: new Date().toISOString(),
        endsAt: null,
      });

      const foundationProduct = await getActiveProductByCodeDb(
        PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION
      );

      if (foundationProduct && foundationProduct.id !== targetProduct.id) {
        const deactivateResult = await deactivateActiveUserProductGrantsDb(
          userId,
          foundationProduct.id
        );

        if (!deactivateResult.success) {
          console.error("Failed to deactivate Foundation grant after lifetime upgrade", {
            userId,
            foundationProductId: foundationProduct.id,
          });
        }
      }

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
        providerCustomerId:
          typeof session.customer === "string" ? session.customer : null,
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
}

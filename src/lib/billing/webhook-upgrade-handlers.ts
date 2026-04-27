import {
  PRODUCT_CODES,
  getActivePriceByIdDb,
  getActiveProductByCodeDb,
  getProductByIdDb,
  getUpgradeFlowForPath,
  type DbPrice,
  type DbProduct,
  type UpgradeFlow,
} from "@/lib/billing/catalog";
import {
  deactivateActiveUserProductGrantsDb,
  getActiveUserProductGrantDb,
  grantProductAccessDb,
} from "@/lib/billing/grants";
import {
  getActiveUserSubscriptionsDb,
  type DbSubscription,
} from "@/lib/billing/subscriptions";
import {
  switchStripeSubscriptionToPrice,
  switchStripeSubscriptionToThreeMonthAnchoredFromCurrentStart,
} from "@/lib/billing/stripe";
import { fromUnixTimestamp } from "@/lib/billing/webhook-stripe-utils";
import { syncSubscriptionRecordAndGrant } from "@/lib/billing/webhook-subscription-handlers";

async function deactivateSourceGrantIfDifferent(params: {
  userId: string;
  sourceProductId: string;
  targetProductId: string;
  context: string;
}): Promise<void> {
  if (params.sourceProductId === params.targetProductId) {
    return;
  }

  const deactivateResult = await deactivateActiveUserProductGrantsDb(
    params.userId,
    params.sourceProductId
  );

  if (!deactivateResult.success) {
    console.error(`Failed to deactivate source grant after ${params.context}`, {
      userId: params.userId,
      sourceProductId: params.sourceProductId,
      targetProductId: params.targetProductId,
    });
  }
}

export async function hasActiveStripeGrantForPrice(params: {
  userId: string;
  productId: string;
  priceId: string;
}): Promise<boolean> {
  const activeGrant = await getActiveUserProductGrantDb(params.userId, params.productId);

  return (
    activeGrant?.source === "stripe" &&
    activeGrant.access_mode === "full" &&
    activeGrant.price_id === params.priceId
  );
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

export async function handleSameCadenceSubscriptionUpgrade(params: {
  userId: string;
  targetProduct: DbProduct;
  targetPrice: DbPrice;
}): Promise<void> {
  if (
    await hasActiveStripeGrantForPrice({
      userId: params.userId,
      productId: params.targetProduct.id,
      priceId: params.targetPrice.id,
    })
  ) {
    return;
  }

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
  const startsAt = fromUnixTimestamp(subscriptionItem?.current_period_start);
  const endsAt = fromUnixTimestamp(subscriptionItem?.current_period_end);

  await syncSubscriptionRecordAndGrant({
    userId: params.userId,
    productId: params.targetProduct.id,
    priceId: params.targetPrice.id,
    subscription: updatedStripeSubscription,
    startsAt,
    endsAt,
    customerId:
      typeof updatedStripeSubscription.customer === "string"
        ? updatedStripeSubscription.customer
        : null,
  });

  await deactivateSourceGrantIfDifferent({
    userId: params.userId,
    sourceProductId: selectedSource.sourceProduct.id,
    targetProductId: params.targetProduct.id,
    context: "same-cadence upgrade",
  });
}

export async function handleMonthlyToThreeMonthUpgrade(params: {
  userId: string;
  targetProduct: DbProduct;
  targetPrice: DbPrice;
}): Promise<void> {
  if (
    await hasActiveStripeGrantForPrice({
      userId: params.userId,
      productId: params.targetProduct.id,
      priceId: params.targetPrice.id,
    })
  ) {
    return;
  }

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

  const startsAt = selectedSource.subscription.current_period_start;
  const endsAt =
    updatedStripeSubscription.trial_end != null
      ? fromUnixTimestamp(updatedStripeSubscription.trial_end)
      : fromUnixTimestamp(updatedStripeSubscription.items.data[0]?.current_period_end);

  await syncSubscriptionRecordAndGrant({
    userId: params.userId,
    productId: params.targetProduct.id,
    priceId: params.targetPrice.id,
    subscription: updatedStripeSubscription,
    startsAt,
    endsAt,
    customerId:
      typeof updatedStripeSubscription.customer === "string"
        ? updatedStripeSubscription.customer
        : null,
  });

  await deactivateSourceGrantIfDifferent({
    userId: params.userId,
    sourceProductId: selectedSource.sourceProduct.id,
    targetProductId: params.targetProduct.id,
    context: "monthly-to-three-month upgrade",
  });
}

export async function handleLifetimeUpgrade(params: {
  userId: string;
  targetProduct: DbProduct;
  targetPrice: DbPrice;
  startsAt: string;
}): Promise<void> {
  if (
    await hasActiveStripeGrantForPrice({
      userId: params.userId,
      productId: params.targetProduct.id,
      priceId: params.targetPrice.id,
    })
  ) {
    return;
  }

  await grantProductAccessDb({
    userId: params.userId,
    productId: params.targetProduct.id,
    priceId: params.targetPrice.id,
    accessMode: "full",
    source: "stripe",
    startsAt: params.startsAt,
    endsAt: null,
  });

  const foundationProduct = await getActiveProductByCodeDb(
    PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION
  );

  if (foundationProduct && foundationProduct.id !== params.targetProduct.id) {
    const deactivateResult = await deactivateActiveUserProductGrantsDb(
      params.userId,
      foundationProduct.id
    );

    if (!deactivateResult.success) {
      console.error("Failed to deactivate Foundation grant after lifetime upgrade", {
        userId: params.userId,
        foundationProductId: foundationProduct.id,
      });
    }
  }
}

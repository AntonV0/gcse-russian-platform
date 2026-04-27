import type Stripe from "stripe";
import {
  PRODUCT_CODES,
  getActivePriceByIdDb,
  getActivePriceByStripePriceIdDb,
  getActiveProductByCodeDb,
  getProductByIdDb,
  getUpgradeFlowForPath,
  type DbPrice,
  type DbProduct,
  type UpgradeFlow,
} from "@/lib/billing/catalog";
import {
  deactivateActiveUserProductGrantsDb,
  deactivateActiveUserProductGrantsBySourceDb,
  grantProductAccessDb,
} from "@/lib/billing/grants";
import {
  getActiveUserSubscriptionsDb,
  getSubscriptionByProviderSubscriptionIdDb,
  isSubscriptionActiveStatus,
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

function getSubscriptionCustomerId(subscription: Stripe.Subscription): string | null {
  return typeof subscription.customer === "string" ? subscription.customer : null;
}

function getSubscriptionPeriod(subscription: Stripe.Subscription): {
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

function assertActiveSubscriptionHasEndDate(
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

async function syncSubscriptionRecordAndGrant(params: {
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

  if (isSubscriptionActiveStatus(subscription.status)) {
    await grantProductAccessDb({
      userId: context.userId,
      productId: context.productId,
      priceId: context.priceId,
      accessMode: "full",
      source: "stripe",
      startsAt,
      endsAt,
    });
    return;
  }

  const deactivateResult = await deactivateActiveUserProductGrantsBySourceDb(
    context.userId,
    context.productId,
    "stripe"
  );

  if (!deactivateResult.success) {
    throw new Error("Failed to deactivate inactive Stripe subscription grants");
  }
}

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

async function handleLifetimeUpgrade(params: {
  userId: string;
  targetProduct: DbProduct;
  targetPrice: DbPrice;
}): Promise<void> {
  await grantProductAccessDb({
    userId: params.userId,
    productId: params.targetProduct.id,
    priceId: params.targetPrice.id,
    accessMode: "full",
    source: "stripe",
    startsAt: new Date().toISOString(),
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

async function handleStandardSubscriptionCheckout(params: {
  session: Stripe.Checkout.Session;
  userId: string;
  productId: string;
  priceId: string;
}): Promise<void> {
  const stripe = getStripeClient();

  if (!params.session.subscription) {
    console.error("Subscription checkout completed without subscription id:", {
      sessionId: params.session.id,
    });

    throw new Error("Missing subscription id");
  }

  const subscription = await stripe.subscriptions.retrieve(
    params.session.subscription as string
  );

  const { startsAt, endsAt } = getSubscriptionPeriod(subscription);

  await syncSubscriptionRecordAndGrant({
    userId: params.userId,
    productId: params.productId,
    priceId: params.priceId,
    subscription,
    startsAt,
    endsAt,
    customerId:
      typeof params.session.customer === "string" ? params.session.customer : null,
  });
}

async function handleStandardPaymentCheckout(params: {
  userId: string;
  productId: string;
  priceId: string;
}): Promise<void> {
  await grantProductAccessDb({
    userId: params.userId,
    productId: params.productId,
    priceId: params.priceId,
    accessMode: "full",
    source: "stripe",
    startsAt: new Date().toISOString(),
    endsAt: null,
  });
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
      await handleLifetimeUpgrade({
        userId,
        targetProduct,
        targetPrice,
      });
      return;
    }

    throw new Error(`Unsupported upgrade flow: ${upgradeFlow}`);
  }

  if (session.mode === "subscription") {
    await handleStandardSubscriptionCheckout({
      session,
      userId,
      productId,
      priceId,
    });
    return;
  }

  if (session.mode === "payment") {
    await handleStandardPaymentCheckout({
      userId,
      productId,
      priceId,
    });
    return;
  }

  throw new Error(`Unsupported checkout session mode: ${session.mode}`);
}

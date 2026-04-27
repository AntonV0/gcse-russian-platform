import type Stripe from "stripe";
import {
  getActivePriceByIdDb,
  getProductByIdDb,
  type UpgradeFlow,
} from "@/lib/billing/catalog";
import { grantProductAccessDb } from "@/lib/billing/grants";
import { getStripeClient } from "@/lib/billing/stripe";
import {
  fromUnixTimestamp,
  getMetadataValue,
  getSubscriptionPeriod,
} from "@/lib/billing/webhook-stripe-utils";
import { syncSubscriptionRecordAndGrant } from "@/lib/billing/webhook-subscription-handlers";
import {
  handleLifetimeUpgrade,
  handleMonthlyToThreeMonthUpgrade,
  handleSameCadenceSubscriptionUpgrade,
  hasActiveStripeGrantForPrice,
} from "@/lib/billing/webhook-upgrade-handlers";

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
  startsAt: string;
}): Promise<void> {
  if (
    await hasActiveStripeGrantForPrice({
      userId: params.userId,
      productId: params.productId,
      priceId: params.priceId,
    })
  ) {
    return;
  }

  await grantProductAccessDb({
    userId: params.userId,
    productId: params.productId,
    priceId: params.priceId,
    accessMode: "full",
    source: "stripe",
    startsAt: params.startsAt,
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

  const checkoutCompletedAt =
    fromUnixTimestamp(session.created) ?? new Date().toISOString();

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
        startsAt: checkoutCompletedAt,
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
      startsAt: checkoutCompletedAt,
    });
    return;
  }

  throw new Error(`Unsupported checkout session mode: ${session.mode}`);
}

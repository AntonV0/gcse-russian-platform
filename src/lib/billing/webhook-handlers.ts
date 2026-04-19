import type Stripe from "stripe";
import { grantProductAccessDb } from "@/lib/billing/grants";
import { upsertSubscriptionDb } from "@/lib/billing/subscriptions";
import { getStripeClient } from "@/lib/billing/stripe";

function fromUnixTimestamp(value?: number | null): string | null {
  if (!value) return null;
  return new Date(value * 1000).toISOString();
}

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const userId = session.metadata?.user_id;
  const productId = session.metadata?.product_id;
  const priceId = session.metadata?.price_id;

  if (!userId || !productId || !priceId) {
    console.error("Stripe webhook missing required checkout metadata:", {
      sessionId: session.id,
      metadata: session.metadata,
    });

    throw new Error("Missing checkout metadata");
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
      accessMode: "full",
      source: "stripe",
      startsAt: new Date().toISOString(),
      endsAt: null,
    });
  }
}

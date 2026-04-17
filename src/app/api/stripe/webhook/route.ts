import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient, getStripeWebhookSecret } from "@/lib/billing/stripe";
import { getActivePriceByStripePriceIdDb } from "@/lib/billing/catalog";
import { grantProductAccessDb } from "@/lib/billing/grants";
import { upsertSubscriptionDb } from "@/lib/billing/subscriptions";

function fromUnixTimestamp(value?: number | null): string | null {
  if (!value) return null;
  return new Date(value * 1000).toISOString();
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing stripe-signature header", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;

  try {
    const stripe = getStripeClient();
    const webhookSecret = getStripeWebhookSecret();

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  try {
    if (event.type !== "checkout.session.completed") {
      return new NextResponse("OK", { status: 200 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.user_id;
    const productIdFromMetadata = session.metadata?.product_id;
    const priceIdFromMetadata = session.metadata?.price_id;

    if (!userId || !productIdFromMetadata || !priceIdFromMetadata) {
      console.error("Stripe webhook missing required checkout metadata:", {
        sessionId: session.id,
        metadata: session.metadata,
      });

      return new NextResponse("Missing checkout metadata", { status: 400 });
    }

    const lineItems = session.line_items;
    const stripePriceId =
      typeof lineItems?.data?.[0]?.price?.id === "string"
        ? lineItems.data[0].price.id
        : null;

    let resolvedProductId = productIdFromMetadata;

    if (stripePriceId) {
      const dbPrice = await getActivePriceByStripePriceIdDb(stripePriceId);

      if (dbPrice) {
        resolvedProductId = dbPrice.product_id;
      }
    }

    if (session.mode === "subscription") {
      const stripe = getStripeClient();

      if (!session.subscription) {
        console.error("Subscription checkout completed without subscription id:", {
          sessionId: session.id,
        });

        return new NextResponse("Missing subscription id", { status: 400 });
      }

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      const subscriptionItem = subscription.items.data[0] ?? null;

      await upsertSubscriptionDb({
        userId,
        productId: resolvedProductId,
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
        productId: resolvedProductId,
        accessMode: "full",
        source: "stripe",
        startsAt: fromUnixTimestamp(subscriptionItem?.current_period_start),
        endsAt: fromUnixTimestamp(subscriptionItem?.current_period_end),
      });
    } else if (session.mode === "payment") {
      await grantProductAccessDb({
        userId,
        productId: resolvedProductId,
        accessMode: "full",
        source: "stripe",
        startsAt: new Date().toISOString(),
        endsAt: null,
      });
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Stripe webhook handler error:", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}

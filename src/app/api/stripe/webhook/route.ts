import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient, getStripeWebhookSecret } from "@/lib/billing/stripe";
import {
  handleCheckoutSessionCompleted,
  handleStripeSubscriptionLifecycle,
} from "@/lib/billing/webhook-handlers";
import {
  claimStripeWebhookEventProcessingDb,
  recordStripeWebhookEventFailedDb,
  recordStripeWebhookEventProcessedDb,
} from "@/lib/billing/webhook-events";

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

  let claimedEvent = false;

  try {
    const claim = await claimStripeWebhookEventProcessingDb({
      eventId: event.id,
      eventType: event.type,
      livemode: event.livemode,
    });

    if (!claim.shouldProcess) {
      return new NextResponse("OK", { status: 200 });
    }

    claimedEvent = true;

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await handleStripeSubscriptionLifecycle(subscription);
        break;
      }

      default:
        break;
    }

    await recordStripeWebhookEventProcessedDb(event.id);

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    if (claimedEvent) {
      await recordStripeWebhookEventFailedDb(event.id, error);
    }

    console.error("Stripe webhook handler error:", {
      eventId: event.id,
      eventType: event.type,
      error,
    });
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}

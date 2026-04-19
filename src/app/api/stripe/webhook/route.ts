import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient, getStripeWebhookSecret } from "@/lib/billing/stripe";
import { handleCheckoutSessionCompleted } from "@/lib/billing/webhook-handlers";

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

    await handleCheckoutSessionCompleted(session);

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Stripe webhook handler error:", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}

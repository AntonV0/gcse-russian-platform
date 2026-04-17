import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

/**
 * Shared server-side Stripe client.
 *
 * Safe to commit:
 * - uses env vars only
 * - does not expose secrets in code
 */
export function getStripeClient(): Stripe {
  if (stripeInstance) {
    return stripeInstance;
  }

  const secretKey = getRequiredEnv("STRIPE_SECRET_KEY");

  stripeInstance = new Stripe(secretKey, {
    apiVersion: "2026-03-25.dahlia",
  });

  return stripeInstance;
}

export function getStripeWebhookSecret(): string {
  return getRequiredEnv("STRIPE_WEBHOOK_SECRET");
}

export function getStripeAppBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export type StripeCheckoutMode = "payment" | "subscription";

export function getStripeCheckoutModeFromBillingType(
  billingType: string
): StripeCheckoutMode {
  if (billingType === "subscription") {
    return "subscription";
  }

  return "payment";
}

export type CreateCheckoutSessionInput = {
  stripePriceId: string;
  userId: string;
  productId: string;
  priceId: string;
  purchaseType: "standard" | "upgrade";
  successPath?: string;
  cancelPath?: string;
  customerEmail?: string | null;
};

export async function createStripeCheckoutSession(
  input: CreateCheckoutSessionInput,
  billingType: string
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripeClient();
  const baseUrl = getStripeAppBaseUrl();

  const successUrl = `${baseUrl}${input.successPath ?? "/account"}?checkout=success`;
  const cancelUrl = `${baseUrl}${input.cancelPath ?? "/account"}?checkout=cancelled`;

  const mode = getStripeCheckoutModeFromBillingType(billingType);

  return stripe.checkout.sessions.create({
    mode,
    line_items: [
      {
        price: input.stripePriceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: input.customerEmail ?? undefined,
    metadata: {
      user_id: input.userId,
      product_id: input.productId,
      price_id: input.priceId,
      purchase_type: input.purchaseType,
    },
    ...(mode === "subscription"
      ? {
          subscription_data: {
            metadata: {
              user_id: input.userId,
              product_id: input.productId,
              price_id: input.priceId,
              purchase_type: input.purchaseType,
            },
          },
        }
      : {}),
  });
}

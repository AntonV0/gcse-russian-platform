import Stripe from "stripe";
import {
  buildCheckoutRedirectUrl,
  DEFAULT_CHECKOUT_CANCEL_PATH,
  DEFAULT_CHECKOUT_SUCCESS_PATH,
  normalizeAppBaseUrl,
} from "@/lib/billing/redirect-paths";

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
  return normalizeAppBaseUrl(
    process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      "http://localhost:3000"
  );
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
  stripePriceId?: string | null;
  customAmountGbp?: number | null;
  customLineItemName?: string | null;
  modeOverride?: StripeCheckoutMode | null;
  userId: string;
  productId: string;
  priceId: string;
  purchaseType: "standard" | "upgrade";
  upgradeFlow?: string | null;
  successPath?: string;
  cancelPath?: string;
  customerEmail?: string | null;
};

function buildLineItems(input: CreateCheckoutSessionInput) {
  if (input.stripePriceId) {
    return [
      {
        price: input.stripePriceId,
        quantity: 1,
      },
    ];
  }

  if (
    typeof input.customAmountGbp === "number" &&
    Number.isFinite(input.customAmountGbp) &&
    input.customAmountGbp > 0
  ) {
    return [
      {
        price_data: {
          currency: "gbp",
          unit_amount: Math.round(input.customAmountGbp * 100),
          product_data: {
            name: input.customLineItemName ?? "Upgrade fee",
          },
        },
        quantity: 1,
      },
    ];
  }

  throw new Error("Checkout session requires either stripePriceId or customAmountGbp");
}

export async function createStripeCheckoutSession(
  input: CreateCheckoutSessionInput,
  billingType: string
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripeClient();
  const baseUrl = getStripeAppBaseUrl();

  const successUrl = buildCheckoutRedirectUrl(
    baseUrl,
    input.successPath ?? DEFAULT_CHECKOUT_SUCCESS_PATH,
    "success"
  );
  const cancelUrl = buildCheckoutRedirectUrl(
    baseUrl,
    input.cancelPath ?? DEFAULT_CHECKOUT_CANCEL_PATH,
    "cancelled"
  );

  const mode = input.modeOverride ?? getStripeCheckoutModeFromBillingType(billingType);
  const lineItems = buildLineItems(input);

  return stripe.checkout.sessions.create({
    mode,
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: input.customerEmail ?? undefined,
    metadata: {
      user_id: input.userId,
      product_id: input.productId,
      price_id: input.priceId,
      purchase_type: input.purchaseType,
      upgrade_flow: input.upgradeFlow ?? "",
    },
    ...(mode === "subscription"
      ? {
          subscription_data: {
            metadata: {
              user_id: input.userId,
              product_id: input.productId,
              price_id: input.priceId,
              purchase_type: input.purchaseType,
              upgrade_flow: input.upgradeFlow ?? "",
            },
          },
        }
      : {}),
  });
}

export async function switchStripeSubscriptionToPrice(params: {
  providerSubscriptionId: string;
  newStripePriceId: string;
}): Promise<Stripe.Subscription> {
  const stripe = getStripeClient();

  const existingSubscription = await stripe.subscriptions.retrieve(
    params.providerSubscriptionId
  );

  const existingItem = existingSubscription.items.data[0];

  if (!existingItem) {
    throw new Error("Subscription has no items to update");
  }

  return stripe.subscriptions.update(params.providerSubscriptionId, {
    items: [
      {
        id: existingItem.id,
        price: params.newStripePriceId,
      },
    ],
    proration_behavior: "none",
  });
}

function addMonthsToIsoDate(anchorIso: string, monthsToAdd: number): Date {
  const date = new Date(anchorIso);
  const result = new Date(date.getTime());

  result.setUTCMonth(result.getUTCMonth() + monthsToAdd);

  return result;
}

export async function switchStripeSubscriptionToThreeMonthAnchoredFromCurrentStart(params: {
  providerSubscriptionId: string;
  newStripePriceId: string;
  currentPeriodStartIso: string;
}): Promise<Stripe.Subscription> {
  const stripe = getStripeClient();

  const existingSubscription = await stripe.subscriptions.retrieve(
    params.providerSubscriptionId
  );

  const existingItem = existingSubscription.items.data[0];

  if (!existingItem) {
    throw new Error("Subscription has no items to update");
  }

  const targetTrialEnd = addMonthsToIsoDate(params.currentPeriodStartIso, 3);
  const targetTrialEndUnix = Math.floor(targetTrialEnd.getTime() / 1000);

  return stripe.subscriptions.update(params.providerSubscriptionId, {
    items: [
      {
        id: existingItem.id,
        price: params.newStripePriceId,
      },
    ],
    proration_behavior: "none",
    trial_end: targetTrialEndUnix,
  });
}

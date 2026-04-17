import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  BILLING_TYPES,
  INTERVAL_UNITS,
  PRODUCT_CODES,
  resolveCheckoutCatalogDb,
  type SupportedIntervalUnit,
} from "@/lib/billing/catalog";
import { createStripeCheckoutSession } from "@/lib/billing/stripe";

type CheckoutRequestBody = {
  productCode: string;
  billingType: string;
  intervalUnit?: SupportedIntervalUnit | null;
  isUpgrade?: boolean;
  successPath?: string;
  cancelPath?: string;
};

function isSupportedProductCode(value: string): boolean {
  return Object.values(PRODUCT_CODES).includes(
    value as (typeof PRODUCT_CODES)[keyof typeof PRODUCT_CODES]
  );
}

function isSupportedBillingType(value: string): boolean {
  return Object.values(BILLING_TYPES).includes(
    value as (typeof BILLING_TYPES)[keyof typeof BILLING_TYPES]
  );
}

function isSupportedIntervalUnit(value: string | null | undefined): boolean {
  if (!value) return true;

  return Object.values(INTERVAL_UNITS).includes(
    value as (typeof INTERVAL_UNITS)[keyof typeof INTERVAL_UNITS]
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckoutRequestBody;

    if (!body.productCode || !isSupportedProductCode(body.productCode)) {
      return NextResponse.json(
        { error: "Invalid or missing productCode" },
        { status: 400 }
      );
    }

    if (!body.billingType || !isSupportedBillingType(body.billingType)) {
      return NextResponse.json(
        { error: "Invalid or missing billingType" },
        { status: 400 }
      );
    }

    if (!isSupportedIntervalUnit(body.intervalUnit)) {
      return NextResponse.json({ error: "Invalid intervalUnit" }, { status: 400 });
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolved = await resolveCheckoutCatalogDb({
      userId: user.id,
      targetProductCode: body.productCode,
      billingType: body.billingType,
      intervalUnit: body.intervalUnit ?? null,
      isUpgrade: body.isUpgrade ?? false,
    });

    if (!resolved) {
      return NextResponse.json(
        { error: "Unable to resolve checkout product/price" },
        { status: 400 }
      );
    }

    if (!resolved.price.stripe_price_id) {
      return NextResponse.json(
        { error: "Resolved price is missing Stripe price id" },
        { status: 400 }
      );
    }

    const session = await createStripeCheckoutSession(
      {
        stripePriceId: resolved.price.stripe_price_id,
        userId: user.id,
        productId: resolved.product.id,
        priceId: resolved.price.id,
        purchaseType: resolved.purchaseType,
        successPath: body.successPath,
        cancelPath: body.cancelPath,
        customerEmail: user.email ?? null,
      },
      resolved.price.billing_type
    );

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Stripe checkout route error:", error);

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

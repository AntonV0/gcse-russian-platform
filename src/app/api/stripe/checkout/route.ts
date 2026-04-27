import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";
import { resolveCheckoutCatalogDb } from "@/lib/billing/catalog";
import {
  validateCheckoutRequestBody,
  validateCheckoutResolvedStripePrice,
  type CheckoutRequestBody,
} from "@/lib/billing/checkout-validation";
import { createStripeCheckoutSession } from "@/lib/billing/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckoutRequestBody;
    const checkoutRequest = validateCheckoutRequestBody(body);

    if (!checkoutRequest.ok) {
      return NextResponse.json({ error: checkoutRequest.error }, { status: 400 });
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolved = await resolveCheckoutCatalogDb({
      userId: user.id,
      targetProductCode: checkoutRequest.productCode,
      billingType: checkoutRequest.billingType,
      intervalUnit: checkoutRequest.intervalUnit,
      intervalCount: checkoutRequest.intervalCount,
      isUpgrade: checkoutRequest.isUpgrade,
    });

    if (!resolved) {
      return NextResponse.json(
        { error: "Unable to resolve checkout product/price" },
        { status: 400 }
      );
    }

    const resolvedPriceValidation = validateCheckoutResolvedStripePrice(resolved);
    if (!resolvedPriceValidation.ok) {
      return NextResponse.json({ error: resolvedPriceValidation.error }, { status: 400 });
    }

    const isUpgradeCheckout = resolved.purchaseType === "upgrade";

    const session = await createStripeCheckoutSession(
      {
        stripePriceId: isUpgradeCheckout ? null : resolved.price.stripe_price_id,
        customAmountGbp: isUpgradeCheckout
          ? (resolved.upgradeFeeAmountGbp ?? null)
          : null,
        customLineItemName: isUpgradeCheckout
          ? `${resolved.product.name} upgrade fee`
          : null,
        modeOverride: isUpgradeCheckout ? "payment" : null,
        userId: user.id,
        productId: resolved.product.id,
        priceId: resolved.price.id,
        purchaseType: resolved.purchaseType,
        upgradeFlow: resolved.upgradeFlow ?? null,
        successPath: checkoutRequest.successPath,
        cancelPath: checkoutRequest.cancelPath,
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

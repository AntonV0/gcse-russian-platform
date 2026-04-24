import { hasActiveUserProductGrantDb } from "@/lib/billing/grants";
import { getActivePricesForProductDb, getActiveProductByCodeDb } from "./db";
import { matchPriceByBillingShape } from "./price-matching";
import { canUpgradeFoundationToHigherDb, resolveUpgradeQuoteDb } from "./upgrade-quotes";
import {
  PRODUCT_CODES,
  type CheckoutCatalogResolution,
  type ResolveCheckoutPriceInput,
} from "./types";

export async function resolveCheckoutCatalogDb(
  input: ResolveCheckoutPriceInput
): Promise<CheckoutCatalogResolution | null> {
  const targetProduct = await getActiveProductByCodeDb(input.targetProductCode);

  if (!targetProduct) {
    console.error("Target product not found for checkout resolution:", input);
    return null;
  }

  const targetPrices = await getActivePricesForProductDb(targetProduct.id);
  const targetPrice = matchPriceByBillingShape(
    targetPrices,
    input.billingType,
    input.intervalUnit ?? null,
    input.intervalCount ?? null
  );

  if (!targetPrice) {
    console.error("Target price not found for checkout resolution:", input);
    return null;
  }

  if (input.isUpgrade) {
    const quote = await resolveUpgradeQuoteDb(
      input.userId,
      input.targetProductCode,
      input.billingType,
      input.intervalUnit ?? null,
      input.intervalCount ?? null
    );

    if (
      !quote.eligible ||
      !quote.upgradeFlow ||
      quote.upgradeFeeAmountGbp == null ||
      !quote.upgradeCheckoutPrice
    ) {
      console.error("User is not eligible for upgrade checkout:", {
        userId: input.userId,
        input,
        quote,
      });
      return null;
    }

    return {
      product: targetProduct,
      price: quote.upgradeCheckoutPrice,
      purchaseType: "upgrade",
      upgradeFlow: quote.upgradeFlow,
      upgradeFeeAmountGbp: quote.upgradeFeeAmountGbp,
    };
  }

  return {
    product: targetProduct,
    price: targetPrice,
    purchaseType: "standard",
    upgradeFlow: null,
    upgradeFeeAmountGbp: null,
  };
}

export async function getUserGcseRussianPurchaseStateDb(userId: string): Promise<{
  canBuyFoundation: boolean;
  canBuyHigher: boolean;
  canUpgradeToHigher: boolean;
}> {
  const foundationProduct = await getActiveProductByCodeDb(
    PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION
  );
  const higherProduct = await getActiveProductByCodeDb(PRODUCT_CODES.GCSE_RUSSIAN_HIGHER);

  if (!foundationProduct || !higherProduct) {
    return {
      canBuyFoundation: false,
      canBuyHigher: false,
      canUpgradeToHigher: false,
    };
  }

  const [hasFoundation, hasHigher, canUpgradeToHigher] = await Promise.all([
    hasActiveUserProductGrantDb(userId, foundationProduct.id),
    hasActiveUserProductGrantDb(userId, higherProduct.id),
    canUpgradeFoundationToHigherDb(userId),
  ]);

  return {
    canBuyFoundation: !hasFoundation,
    canBuyHigher: !hasHigher,
    canUpgradeToHigher,
  };
}

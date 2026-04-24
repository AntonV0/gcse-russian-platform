import {
  getActivePricesForProductDb,
  getActiveProductByCodeDb,
  getActiveUpgradeableGrantsDb,
} from "./db";
import { matchPriceByBillingShape } from "./price-matching";
import {
  getUpgradeFlowForPath,
  getUpgradeProductCode,
  matchUpgradeCheckoutPrice,
  sortUpgradeCandidates,
} from "./upgrade-pricing";
import {
  BILLING_TYPES,
  INTERVAL_UNITS,
  PRODUCT_CODES,
  type SupportedIntervalUnit,
  type UpgradeCandidate,
  type UpgradeQuoteResolution,
} from "./types";

export async function resolveUpgradeQuoteDb(
  userId: string,
  targetProductCode: string,
  billingType: string,
  intervalUnit?: SupportedIntervalUnit | null,
  intervalCount?: number | null
): Promise<UpgradeQuoteResolution> {
  const targetProduct = await getActiveProductByCodeDb(targetProductCode);

  if (!targetProduct) {
    return {
      eligible: false,
      sourceGrant: null,
      sourceProduct: null,
      sourcePrice: null,
      targetProduct: null,
      targetPrice: null,
      upgradeCheckoutPrice: null,
      upgradeFlow: null,
      upgradeFeeAmountGbp: null,
    };
  }

  const targetPrices = await getActivePricesForProductDb(targetProduct.id);
  const targetPrice = matchPriceByBillingShape(
    targetPrices,
    billingType,
    intervalUnit ?? null,
    intervalCount ?? null
  );

  if (!targetPrice) {
    return {
      eligible: false,
      sourceGrant: null,
      sourceProduct: null,
      sourcePrice: null,
      targetProduct,
      targetPrice: null,
      upgradeCheckoutPrice: null,
      upgradeFlow: null,
      upgradeFeeAmountGbp: null,
    };
  }

  const upgradeProduct = await getActiveProductByCodeDb(
    getUpgradeProductCode(targetProductCode)
  );
  const upgradePrices = upgradeProduct
    ? await getActivePricesForProductDb(upgradeProduct.id)
    : [];

  const sourceCandidates = await getActiveUpgradeableGrantsDb(userId);

  const validCandidates = sourceCandidates
    .map((candidate) => {
      const upgradeFlow = getUpgradeFlowForPath(
        candidate.product.code,
        candidate.price,
        targetProduct.code,
        targetPrice
      );

      if (!upgradeFlow) {
        return null;
      }

      const upgradeCheckoutPrice = matchUpgradeCheckoutPrice({
        upgradePrices,
        sourceProductCode: candidate.product.code,
        targetProductCode: targetProduct.code,
        sourcePrice: candidate.price,
        targetPrice,
        upgradeFlow,
      });

      if (!upgradeCheckoutPrice) {
        return null;
      }

      return {
        ...candidate,
        upgradeFlow,
        upgradeFeeAmountGbp: upgradeCheckoutPrice.amount_gbp,
        upgradeCheckoutPrice,
      };
    })
    .filter(Boolean) as UpgradeCandidate[];

  if (validCandidates.length === 0) {
    return {
      eligible: false,
      sourceGrant: null,
      sourceProduct: null,
      sourcePrice: null,
      targetProduct,
      targetPrice,
      upgradeCheckoutPrice: null,
      upgradeFlow: null,
      upgradeFeeAmountGbp: null,
    };
  }

  const selected = sortUpgradeCandidates(validCandidates, targetProduct.code)[0];

  return {
    eligible: true,
    sourceGrant: selected.grant,
    sourceProduct: selected.product,
    sourcePrice: selected.price,
    targetProduct,
    targetPrice,
    upgradeCheckoutPrice: selected.upgradeCheckoutPrice,
    upgradeFlow: selected.upgradeFlow,
    upgradeFeeAmountGbp: selected.upgradeFeeAmountGbp,
  };
}

export async function canUpgradeFoundationToHigherDb(userId: string): Promise<boolean> {
  const [higherMonthly, higherThreeMonth, higherLifetime] = await Promise.all([
    resolveUpgradeQuoteDb(
      userId,
      PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
      BILLING_TYPES.SUBSCRIPTION,
      INTERVAL_UNITS.MONTH,
      1
    ),
    resolveUpgradeQuoteDb(
      userId,
      PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
      BILLING_TYPES.SUBSCRIPTION,
      INTERVAL_UNITS.MONTH,
      3
    ),
    resolveUpgradeQuoteDb(
      userId,
      PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
      BILLING_TYPES.ONE_TIME,
      null,
      null
    ),
  ]);

  return higherMonthly.eligible || higherThreeMonth.eligible || higherLifetime.eligible;
}

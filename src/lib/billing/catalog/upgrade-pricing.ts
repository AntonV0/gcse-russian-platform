import {
  matchPriceByBillingShape,
  isFoundationProductCode,
  isHigherProductCode,
  isLifetimePrice,
  isMonthlySubscriptionPrice,
  isThreeMonthSubscriptionPrice,
} from "./price-matching";
import {
  BILLING_TYPES,
  INTERVAL_UNITS,
  PRODUCT_CODES,
  type DbPrice,
  type UpgradeCandidate,
  type UpgradeFlow,
} from "./types";

export function getUpgradeProductCode(productCode: string): string {
  return `${productCode}-upgrade`;
}

export function getUpgradeFlowForPath(
  sourceProductCode: string,
  sourcePrice: DbPrice,
  targetProductCode: string,
  targetPrice: DbPrice
): UpgradeFlow | null {
  const sourceIsFoundation = isFoundationProductCode(sourceProductCode);
  const sourceIsHigher = isHigherProductCode(sourceProductCode);
  const targetIsFoundation = isFoundationProductCode(targetProductCode);
  const targetIsHigher = isHigherProductCode(targetProductCode);

  if (!sourceIsFoundation && !sourceIsHigher) {
    return null;
  }

  if (!targetIsFoundation && !targetIsHigher) {
    return null;
  }

  if (
    sourceIsFoundation &&
    targetIsHigher &&
    isLifetimePrice(targetPrice) &&
    (isMonthlySubscriptionPrice(sourcePrice) ||
      isThreeMonthSubscriptionPrice(sourcePrice) ||
      isLifetimePrice(sourcePrice))
  ) {
    return "lifetime";
  }

  if (
    sourceIsFoundation &&
    targetIsFoundation &&
    isLifetimePrice(targetPrice) &&
    (isMonthlySubscriptionPrice(sourcePrice) ||
      isThreeMonthSubscriptionPrice(sourcePrice))
  ) {
    return "lifetime";
  }

  if (
    sourceIsHigher &&
    targetIsHigher &&
    isLifetimePrice(targetPrice) &&
    (isMonthlySubscriptionPrice(sourcePrice) ||
      isThreeMonthSubscriptionPrice(sourcePrice))
  ) {
    return "lifetime";
  }

  if (
    sourceIsFoundation &&
    isMonthlySubscriptionPrice(sourcePrice) &&
    targetIsHigher &&
    isMonthlySubscriptionPrice(targetPrice)
  ) {
    return "same_cadence";
  }

  if (
    sourceIsFoundation &&
    isThreeMonthSubscriptionPrice(sourcePrice) &&
    targetIsHigher &&
    isThreeMonthSubscriptionPrice(targetPrice)
  ) {
    return "same_cadence";
  }

  if (
    isMonthlySubscriptionPrice(sourcePrice) &&
    isThreeMonthSubscriptionPrice(targetPrice) &&
    ((sourceIsFoundation && targetIsFoundation) ||
      (sourceIsHigher && targetIsHigher) ||
      (sourceIsFoundation && targetIsHigher))
  ) {
    return "monthly_to_three_month";
  }

  return null;
}

export function sortUpgradeCandidates(
  candidates: UpgradeCandidate[],
  targetProductCode: string
): UpgradeCandidate[] {
  return [...candidates].sort((a, b) => {
    const aSameProduct = a.product.code === targetProductCode ? 1 : 0;
    const bSameProduct = b.product.code === targetProductCode ? 1 : 0;

    if (aSameProduct !== bSameProduct) {
      return bSameProduct - aSameProduct;
    }

    if (a.upgradeFeeAmountGbp !== b.upgradeFeeAmountGbp) {
      return a.upgradeFeeAmountGbp - b.upgradeFeeAmountGbp;
    }

    return 0;
  });
}

function findOneTimePriceByAmount(
  upgradePrices: DbPrice[],
  amountGbp: number
): DbPrice | null {
  return (
    upgradePrices.find(
      (price) =>
        price.billing_type === BILLING_TYPES.ONE_TIME && price.amount_gbp === amountGbp
    ) ?? null
  );
}

function findThreeMonthSubscriptionPriceByAmount(
  upgradePrices: DbPrice[],
  amountGbp: number
): DbPrice | null {
  return (
    upgradePrices.find(
      (price) =>
        price.billing_type === BILLING_TYPES.SUBSCRIPTION &&
        price.interval_unit === INTERVAL_UNITS.MONTH &&
        (price.interval_count ?? 1) === 3 &&
        price.amount_gbp === amountGbp
    ) ?? null
  );
}

function matchLifetimeUpgradeCheckoutPrice(params: {
  upgradePrices: DbPrice[];
  sourceProductCode: string;
  targetProductCode: string;
  sourcePrice: DbPrice;
}): DbPrice | null {
  if (
    params.sourceProductCode === PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION &&
    params.targetProductCode === PRODUCT_CODES.GCSE_RUSSIAN_HIGHER
  ) {
    if (isMonthlySubscriptionPrice(params.sourcePrice)) {
      return findOneTimePriceByAmount(params.upgradePrices, 349);
    }

    if (isThreeMonthSubscriptionPrice(params.sourcePrice)) {
      return findOneTimePriceByAmount(params.upgradePrices, 269);
    }

    if (isLifetimePrice(params.sourcePrice)) {
      return findOneTimePriceByAmount(params.upgradePrices, 99);
    }
  }

  if (
    params.sourceProductCode === PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION &&
    params.targetProductCode === PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION
  ) {
    if (isMonthlySubscriptionPrice(params.sourcePrice)) {
      return findOneTimePriceByAmount(params.upgradePrices, 249);
    }

    if (isThreeMonthSubscriptionPrice(params.sourcePrice)) {
      return findOneTimePriceByAmount(params.upgradePrices, 169);
    }
  }

  if (
    params.sourceProductCode === PRODUCT_CODES.GCSE_RUSSIAN_HIGHER &&
    params.targetProductCode === PRODUCT_CODES.GCSE_RUSSIAN_HIGHER
  ) {
    if (isMonthlySubscriptionPrice(params.sourcePrice)) {
      return findOneTimePriceByAmount(params.upgradePrices, 339);
    }

    if (isThreeMonthSubscriptionPrice(params.sourcePrice)) {
      return findOneTimePriceByAmount(params.upgradePrices, 249);
    }
  }

  return null;
}

function matchMonthlyToThreeMonthUpgradeCheckoutPrice(params: {
  upgradePrices: DbPrice[];
  sourceProductCode: string;
  targetProductCode: string;
  sourcePrice: DbPrice;
}): DbPrice | null {
  if (!isMonthlySubscriptionPrice(params.sourcePrice)) {
    return null;
  }

  if (
    params.sourceProductCode === PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION &&
    params.targetProductCode === PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION
  ) {
    return findThreeMonthSubscriptionPriceByAmount(params.upgradePrices, 79);
  }

  if (
    params.sourceProductCode === PRODUCT_CODES.GCSE_RUSSIAN_HIGHER &&
    params.targetProductCode === PRODUCT_CODES.GCSE_RUSSIAN_HIGHER
  ) {
    return findThreeMonthSubscriptionPriceByAmount(params.upgradePrices, 89);
  }

  if (
    params.sourceProductCode === PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION &&
    params.targetProductCode === PRODUCT_CODES.GCSE_RUSSIAN_HIGHER
  ) {
    return findThreeMonthSubscriptionPriceByAmount(params.upgradePrices, 99);
  }

  return null;
}

function matchSameCadenceUpgradeCheckoutPrice(params: {
  upgradePrices: DbPrice[];
  sourceProductCode: string;
  targetProductCode: string;
  sourcePrice: DbPrice;
  targetPrice: DbPrice;
}): DbPrice | null {
  if (
    params.sourceProductCode === PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION &&
    params.targetProductCode === PRODUCT_CODES.GCSE_RUSSIAN_HIGHER &&
    isMonthlySubscriptionPrice(params.sourcePrice) &&
    isMonthlySubscriptionPrice(params.targetPrice)
  ) {
    return (
      params.upgradePrices.find(
        (price) =>
          price.billing_type === BILLING_TYPES.SUBSCRIPTION &&
          price.interval_unit === INTERVAL_UNITS.MONTH &&
          (price.interval_count ?? 1) === 1 &&
          price.amount_gbp === 9
      ) ?? null
    );
  }

  if (
    params.sourceProductCode === PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION &&
    params.targetProductCode === PRODUCT_CODES.GCSE_RUSSIAN_HIGHER &&
    isThreeMonthSubscriptionPrice(params.sourcePrice) &&
    isThreeMonthSubscriptionPrice(params.targetPrice)
  ) {
    return findThreeMonthSubscriptionPriceByAmount(params.upgradePrices, 19);
  }

  return matchPriceByBillingShape(
    params.upgradePrices,
    params.targetPrice.billing_type,
    params.targetPrice.interval_unit,
    params.targetPrice.interval_count
  );
}

export function matchUpgradeCheckoutPrice(params: {
  upgradePrices: DbPrice[];
  sourceProductCode: string;
  targetProductCode: string;
  sourcePrice: DbPrice;
  targetPrice: DbPrice;
  upgradeFlow: UpgradeFlow;
}): DbPrice | null {
  if (params.upgradeFlow === "lifetime") {
    return matchLifetimeUpgradeCheckoutPrice({
      upgradePrices: params.upgradePrices,
      sourceProductCode: params.sourceProductCode,
      targetProductCode: params.targetProductCode,
      sourcePrice: params.sourcePrice,
    });
  }

  if (params.upgradeFlow === "monthly_to_three_month") {
    return matchMonthlyToThreeMonthUpgradeCheckoutPrice({
      upgradePrices: params.upgradePrices,
      sourceProductCode: params.sourceProductCode,
      targetProductCode: params.targetProductCode,
      sourcePrice: params.sourcePrice,
    });
  }

  if (params.upgradeFlow === "same_cadence") {
    return matchSameCadenceUpgradeCheckoutPrice({
      upgradePrices: params.upgradePrices,
      sourceProductCode: params.sourceProductCode,
      targetProductCode: params.targetProductCode,
      sourcePrice: params.sourcePrice,
      targetPrice: params.targetPrice,
    });
  }

  return null;
}

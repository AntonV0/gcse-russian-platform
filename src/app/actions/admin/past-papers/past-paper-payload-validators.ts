import {
  pastPaperPaperNames,
  pastPaperResourceTypes,
  pastPaperTiers,
  type PastPaperPaperName,
  type PastPaperResourceType,
  type PastPaperTier,
} from "@/lib/past-papers/past-paper-helpers-db";

export function validatePaperName(value: string): PastPaperPaperName {
  if (pastPaperPaperNames.includes(value as PastPaperPaperName)) {
    return value as PastPaperPaperName;
  }

  throw new Error("Invalid paper name");
}

export function validateTier(value: string): PastPaperTier {
  if (pastPaperTiers.includes(value as PastPaperTier)) {
    return value as PastPaperTier;
  }

  throw new Error("Invalid tier");
}

export function validateResourceType(value: string): PastPaperResourceType {
  if (pastPaperResourceTypes.includes(value as PastPaperResourceType)) {
    return value as PastPaperResourceType;
  }

  throw new Error("Invalid resource type");
}

function validateOfficialUrl(value: string) {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error("Official URL must be a valid URL");
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Official URL must start with http or https");
  }

  return url.toString();
}

export function validateOfficialPearsonUrl(value: string, isOfficial: boolean) {
  const officialUrl = validateOfficialUrl(value);

  if (!isOfficial) {
    return officialUrl;
  }

  const url = new URL(officialUrl);

  if (
    url.hostname !== "qualifications.pearson.com" &&
    !url.hostname.endsWith(".qualifications.pearson.com")
  ) {
    throw new Error("Official Pearson resources must use qualifications.pearson.com");
  }

  return officialUrl;
}

export function getBooleanFromString(value: string, defaultValue: boolean) {
  const normalized = value.trim().toLowerCase();

  if (!normalized) return defaultValue;

  if (["true", "yes", "y", "1", "published"].includes(normalized)) {
    return true;
  }

  if (["false", "no", "n", "0", "draft"].includes(normalized)) {
    return false;
  }

  throw new Error(`Invalid boolean value: ${value}`);
}

export function getOptionalNonNegativeNumberFromString(value: string, fieldName: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const numberValue = Number(trimmed);
  if (!Number.isFinite(numberValue) || numberValue < 0) {
    throw new Error(`${fieldName} must be zero or greater`);
  }

  return numberValue;
}

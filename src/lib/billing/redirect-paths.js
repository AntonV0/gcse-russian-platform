const INTERNAL_REDIRECT_BASE_URL = "https://gcse-russian.internal";
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f]/;

export const DEFAULT_CHECKOUT_SUCCESS_PATH = "/account";
export const DEFAULT_CHECKOUT_CANCEL_PATH = "/account";

/**
 * @param {unknown} value
 * @returns {string | null}
 */
export function normalizeInternalRedirectPath(value) {
  if (typeof value !== "string") {
    return null;
  }

  if (
    value.length === 0 ||
    value.length > 2048 ||
    value !== value.trim() ||
    CONTROL_CHARACTER_PATTERN.test(value) ||
    value.includes("\\") ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return null;
  }

  try {
    const url = new URL(value, INTERNAL_REDIRECT_BASE_URL);

    if (url.origin !== INTERNAL_REDIRECT_BASE_URL) {
      return null;
    }

    const normalizedPath = `${url.pathname}${url.search}${url.hash}`;

    if (!normalizedPath.startsWith("/") || normalizedPath.startsWith("//")) {
      return null;
    }

    return normalizedPath;
  } catch {
    return null;
  }
}

/**
 * @param {unknown} value
 * @param {string} fallbackPath
 * @returns {string | null}
 */
export function resolveOptionalInternalRedirectPath(value, fallbackPath) {
  if (value == null) {
    return fallbackPath;
  }

  return normalizeInternalRedirectPath(value);
}

/**
 * @param {string} rawBaseUrl
 * @returns {string}
 */
export function normalizeAppBaseUrl(rawBaseUrl) {
  const trimmedBaseUrl = rawBaseUrl.trim().replace(/\/+$/, "");

  if (/^https?:\/\//i.test(trimmedBaseUrl)) {
    return trimmedBaseUrl;
  }

  return `https://${trimmedBaseUrl}`;
}

/**
 * @param {string} baseUrl
 * @param {string} redirectPath
 * @param {"success" | "cancelled"} status
 * @returns {string}
 */
export function buildCheckoutRedirectUrl(baseUrl, redirectPath, status) {
  const url = new URL(redirectPath, `${normalizeAppBaseUrl(baseUrl)}/`);

  url.searchParams.set("checkout", status);

  return url.toString();
}

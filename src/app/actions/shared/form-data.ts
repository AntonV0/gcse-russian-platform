export function getTrimmedString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export function getOptionalString(formData: FormData, key: string) {
  const value = getTrimmedString(formData, key);
  return value.length > 0 ? value : null;
}

export function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "true";
}

export function getOptionalPositiveNumber(formData: FormData, key: string) {
  const raw = getTrimmedString(formData, key);
  if (!raw) return null;

  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${key} must be a positive number`);
  }

  return value;
}

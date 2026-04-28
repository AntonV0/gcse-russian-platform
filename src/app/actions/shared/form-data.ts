export function getTrimmedString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export function getRequiredString(formData: FormData, key: string) {
  const value = getTrimmedString(formData, key);

  if (!value) {
    throw new Error(`Missing required field: ${key}`);
  }

  return value;
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

export function getEnumValue<const T extends readonly string[]>(
  formData: FormData,
  key: string,
  values: T
): T[number] {
  const value = getRequiredString(formData, key);

  if (!values.includes(value)) {
    throw new Error(`${key} must be one of: ${values.join(", ")}`);
  }

  return value;
}

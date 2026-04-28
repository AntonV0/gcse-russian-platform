import { describe, expect, it } from "vitest";
import {
  getBoolean,
  getEnumValue,
  getOptionalPositiveNumber,
  getOptionalString,
  getRequiredString,
  getTrimmedString,
} from "@/app/actions/shared/form-data";

function buildFormData(entries: Record<string, string>) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(entries)) {
    formData.set(key, value);
  }

  return formData;
}

describe("form data action helpers", () => {
  it("trims string values and normalizes empty optional strings", () => {
    const formData = buildFormData({
      title: "  GCSE Russian  ",
      description: "   ",
    });

    expect(getTrimmedString(formData, "title")).toBe("GCSE Russian");
    expect(getOptionalString(formData, "description")).toBeNull();
  });

  it("requires non-empty string values", () => {
    const formData = buildFormData({ title: "  " });

    expect(() => getRequiredString(formData, "title")).toThrow(
      "Missing required field: title"
    );
  });

  it("reads explicit boolean fields", () => {
    const formData = buildFormData({ enabled: "true", disabled: "false" });

    expect(getBoolean(formData, "enabled")).toBe(true);
    expect(getBoolean(formData, "disabled")).toBe(false);
    expect(getBoolean(formData, "missing")).toBe(false);
  });

  it("validates optional positive numbers", () => {
    const formData = buildFormData({ minutes: "15", empty: "" });

    expect(getOptionalPositiveNumber(formData, "minutes")).toBe(15);
    expect(getOptionalPositiveNumber(formData, "empty")).toBeNull();
    expect(() =>
      getOptionalPositiveNumber(buildFormData({ minutes: "0" }), "minutes")
    ).toThrow("minutes must be a positive number");
  });

  it("validates enum values", () => {
    const allowed = ["up", "down"] as const;

    expect(getEnumValue(buildFormData({ direction: "up" }), "direction", allowed)).toBe(
      "up"
    );
    expect(() =>
      getEnumValue(buildFormData({ direction: "sideways" }), "direction", allowed)
    ).toThrow("direction must be one of: up, down");
  });
});

import { describe, expect, it } from "vitest";
import {
  getSafeProfileAvatarKey,
  isProfileAvatarKey,
  profileAvatarOptions,
} from "@/lib/profile/avatar-customization";

describe("profile avatar validation", () => {
  it("accepts only configured avatar keys", () => {
    for (const avatar of profileAvatarOptions) {
      expect(isProfileAvatarKey(avatar.key)).toBe(true);
      expect(getSafeProfileAvatarKey(avatar.key)).toBe(avatar.key);
    }
  });

  it("rejects unknown avatar keys back to the default initials avatar", () => {
    expect(isProfileAvatarKey("ninja")).toBe(false);
    expect(isProfileAvatarKey("../../../admin")).toBe(false);
    expect(getSafeProfileAvatarKey("ninja")).toBe("");
    expect(getSafeProfileAvatarKey(null)).toBe("");
  });
});

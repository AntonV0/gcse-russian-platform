"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type {
  AccentPreference,
  ThemePreference,
} from "@/components/providers/theme-provider";
import {
  getSafeAvatarBackgroundKey,
  isProfileAvatarKey,
} from "@/lib/profile/avatar-customization";
import { createClient } from "@/lib/supabase/server";

const themePreferences = new Set<ThemePreference>(["light", "dark", "system"]);
const accentPreferences = new Set<AccentPreference>([
  "blue",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "brown",
  "slate",
]);
const appearanceCookieOptions = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax" as const,
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function skipOnboardingProfileAction() {
  redirect("/dashboard");
}

export async function saveOnboardingProfileAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/signup");
  }

  const displayName = getString(formData, "displayName");
  const avatarKey = getString(formData, "avatarKey");
  const avatarBackgroundKey = getSafeAvatarBackgroundKey(
    getString(formData, "avatarBackgroundKey")
  );
  const themePreference = getString(formData, "themePreference") as ThemePreference;
  const accentPreference = getString(formData, "accentPreference") as AccentPreference;

  if (!isProfileAvatarKey(avatarKey)) {
    redirect("/onboarding?step=profile&error=avatar");
  }

  const safeDisplayName =
    displayName.length > 50 ? displayName.slice(0, 50) : displayName;
  const payload: {
    display_name: string | null;
    avatar_key: string | null;
    avatar_background_key: string;
    theme_preference?: ThemePreference;
    accent_preference?: AccentPreference;
  } = {
    display_name: safeDisplayName || null,
    avatar_key: avatarKey || null,
    avatar_background_key: avatarBackgroundKey,
  };

  if (themePreferences.has(themePreference)) {
    payload.theme_preference = themePreference;
  }

  if (accentPreferences.has(accentPreference)) {
    payload.accent_preference = accentPreference;
  }

  const { error } = await supabase.from("profiles").update(payload).eq("id", user.id);

  if (error) {
    redirect(`/onboarding?step=profile&error=${encodeURIComponent(error.message)}`);
  }

  const cookieStore = await cookies();

  if (payload.theme_preference) {
    cookieStore.set("theme", payload.theme_preference, appearanceCookieOptions);
  }

  if (payload.accent_preference) {
    cookieStore.set("accent", payload.accent_preference, appearanceCookieOptions);
  }

  revalidatePath("/dashboard");
  revalidatePath("/profile");
  revalidatePath("/settings");
  redirect("/dashboard");
}

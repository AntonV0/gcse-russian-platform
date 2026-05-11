"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  AccentPreference,
  ThemePreference,
} from "@/components/providers/theme-provider";

type AppearancePreferenceUpdate = {
  themePreference?: ThemePreference;
  accentPreference?: AccentPreference;
};

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

export async function updateAppearancePreferences(update: AppearancePreferenceUpdate) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false };
  }

  const payload: {
    theme_preference?: ThemePreference;
    accent_preference?: AccentPreference;
  } = {};

  if (update.themePreference && themePreferences.has(update.themePreference)) {
    payload.theme_preference = update.themePreference;
  }

  if (update.accentPreference && accentPreferences.has(update.accentPreference)) {
    payload.accent_preference = update.accentPreference;
  }

  if (Object.keys(payload).length === 0) {
    return { ok: false };
  }

  const { error } = await supabase.from("profiles").update(payload).eq("id", user.id);

  if (error) {
    console.error("Error updating appearance preferences:", error);
    return { ok: false };
  }

  const cookieStore = await cookies();

  if (payload.theme_preference) {
    cookieStore.set("theme", payload.theme_preference, appearanceCookieOptions);
  }

  if (payload.accent_preference) {
    cookieStore.set("accent", payload.accent_preference, appearanceCookieOptions);
  }

  revalidatePath("/settings");
  return { ok: true };
}

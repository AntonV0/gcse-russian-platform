"use client";

import { useEffect } from "react";
import {
  useTheme,
  type AccentPreference,
  type ThemePreference,
} from "@/components/providers/theme-provider";

type AppearancePreferenceSyncProps = {
  themePreference?: ThemePreference | null;
  accentPreference?: AccentPreference | null;
};

export default function AppearancePreferenceSync({
  themePreference,
  accentPreference,
}: AppearancePreferenceSyncProps) {
  const { hydrateAppearancePreferences } = useTheme();

  useEffect(() => {
    hydrateAppearancePreferences({ themePreference, accentPreference });
  }, [accentPreference, hydrateAppearancePreferences, themePreference]);

  return null;
}

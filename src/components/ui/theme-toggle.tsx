"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { DevOnlyComponentMarker } from "@/components/ui/dev-component-marker";
import IconButton from "@/components/ui/icon-button";
import { useOptionalTheme, type ThemeMode } from "@/components/providers/theme-provider";

function subscribeToHydration() {
  return () => {};
}

function getClientHydrationSnapshot() {
  return true;
}

function getServerHydrationSnapshot() {
  return false;
}

export default function ThemeToggle() {
  const themeContext = useOptionalTheme();
  const [fallbackTheme, setFallbackTheme] = useState<ThemeMode | null>(null);
  const hasMounted = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot
  );
  const theme = themeContext?.theme ?? fallbackTheme;
  const toggleTheme = useCallback(() => {
    if (themeContext) {
      themeContext.toggleTheme();
      return;
    }

    if (typeof document === "undefined") {
      return;
    }

    const currentTheme =
      document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem("theme", nextTheme);
    setFallbackTheme(nextTheme);
  }, [themeContext]);

  const title = "Toggle theme";

  return (
    <span className="dev-marker-host relative inline-flex">
      <DevOnlyComponentMarker
        componentName="ThemeToggle"
        filePath="src/components/ui/theme-toggle.tsx"
        tier="semantic"
        componentRole="Theme mode toggle control"
        bestFor="Header utility navigation, account-level display controls, and quick light/dark mode switching."
        usageExamples={[
          "Site header theme toggle",
          "Platform header utility control",
          "Admin shell display toggle",
        ]}
        notes="Use once in the main app chrome. Avoid placing multiple theme toggles on the same page."
      />

      <IconButton
        type="button"
        onClick={toggleTheme}
        icon={hasMounted && theme === "dark" ? "sun" : "moon"}
        label={title}
      />
    </span>
  );
}

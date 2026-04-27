"use client";

import { useSyncExternalStore } from "react";
import { DevOnlyComponentMarker } from "@/components/ui/dev-component-marker";
import IconButton from "@/components/ui/icon-button";
import { useTheme } from "@/components/providers/theme-provider";

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
  const { theme, toggleTheme } = useTheme();
  const hasMounted = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot
  );

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

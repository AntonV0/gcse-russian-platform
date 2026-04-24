"use client";

import { useSyncExternalStore } from "react";
import AppIcon from "@/components/ui/app-icon";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import { useTheme } from "@/components/providers/theme-provider";

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

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
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
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
      ) : null}

      <button
        type="button"
        onClick={toggleTheme}
        className="app-icon-button app-focus-ring"
        aria-label={title}
        title={title}
      >
        {hasMounted && theme ? (
          <AppIcon
            icon={theme === "dark" ? "sun" : "moon"}
            size={17}
            className="app-icon-button-icon"
          />
        ) : (
          <span aria-hidden="true" className="block h-[17px] w-[17px] shrink-0" />
        )}
      </button>
    </span>
  );
}

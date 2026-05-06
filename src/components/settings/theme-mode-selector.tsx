"use client";

import { useSyncExternalStore } from "react";
import AppIcon from "@/components/ui/app-icon";
import { useTheme, type ThemePreference } from "@/components/providers/theme-provider";

const themeOptions: Array<{
  value: ThemePreference;
  label: string;
  description: string;
  icon: "sun" | "moon" | "settings";
}> = [
  {
    value: "light",
    label: "Light",
    description: "Use a bright interface all the time.",
    icon: "sun",
  },
  {
    value: "dark",
    label: "Dark",
    description: "Use a darker interface all the time.",
    icon: "moon",
  },
  {
    value: "system",
    label: "System",
    description: "Follow your device appearance automatically.",
    icon: "settings",
  },
];

function subscribeToHydration() {
  return () => {};
}

function getClientHydrationSnapshot() {
  return true;
}

function getServerHydrationSnapshot() {
  return false;
}

export default function ThemeModeSelector() {
  const { themePreference, setThemePreference } = useTheme();
  const hasMounted = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot
  );
  const displayedPreference = hasMounted ? themePreference : null;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--accent-decorative-border)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--background-elevated))] text-[var(--accent-on-soft)]">
          <AppIcon icon="sun" size={18} />
        </span>

        <div className="min-w-0">
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Display mode
          </h3>
          <p className="mt-1 text-sm app-text-muted">
            Pick the version that feels easiest to read while you study.
          </p>
        </div>
      </div>

      <div
        className="grid gap-3 sm:grid-cols-3"
        role="radiogroup"
        aria-label="Display mode"
      >
        {themeOptions.map((option) => {
          const isActive = displayedPreference === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setThemePreference(option.value)}
              className={[
                "app-focus-ring rounded-xl border p-4 text-left transition",
                "hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]",
                isActive
                  ? "app-selected-surface"
                  : "border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-primary)] hover:border-[var(--border-strong)]",
              ].join(" ")}
              role="radio"
              aria-checked={isActive}
            >
              <span className="flex items-start gap-3">
                <span
                  className={[
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                    isActive
                      ? "border-[var(--accent-decorative-border)] bg-[color-mix(in_srgb,var(--accent)_9%,var(--background-elevated))] text-[var(--accent-on-soft)]"
                      : "border-[var(--border)] bg-[var(--background-muted)]",
                  ].join(" ")}
                >
                  <AppIcon icon={option.icon} size={18} />
                </span>

                <span className="min-w-0 space-y-1">
                  <span className="block text-sm font-semibold">{option.label}</span>
                  <span
                    className={[
                      "block text-xs leading-5",
                      isActive ? "text-[var(--accent-on-soft)]" : "app-text-muted",
                    ].join(" ")}
                  >
                    {option.description}
                  </span>
                </span>
              </span>

              <span
                className={[
                  "mt-4 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                  isActive
                    ? "bg-[var(--accent-fill)] text-[var(--accent-on-fill)] shadow-[0_6px_14px_color-mix(in_srgb,var(--accent)_12%,transparent)]"
                    : "bg-[var(--background-muted)] text-[var(--text-secondary)]",
                ].join(" ")}
              >
                {isActive ? "Selected" : "Choose"}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-sm app-text-muted">
        Your display choice is remembered in this browser. Choose System if you want
        GCSE Russian to follow your device setting.
      </p>
    </div>
  );
}

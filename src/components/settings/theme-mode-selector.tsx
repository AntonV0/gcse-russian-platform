"use client";

import { useSyncExternalStore, type KeyboardEvent } from "react";
import AppIcon from "@/components/ui/app-icon";
import SelectableCardButton from "@/components/ui/selectable-card-button";
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

function getNextThemeOptionIndex(key: string, currentIndex: number) {
  if (key === "ArrowRight" || key === "ArrowDown") {
    return (currentIndex + 1) % themeOptions.length;
  }

  if (key === "ArrowLeft" || key === "ArrowUp") {
    return (currentIndex - 1 + themeOptions.length) % themeOptions.length;
  }

  if (key === "Home") {
    return 0;
  }

  if (key === "End") {
    return themeOptions.length - 1;
  }

  return null;
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
          <h3 className="text-base font-bold text-[var(--text-primary)]">Display mode</h3>
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
        {themeOptions.map((option, index) => {
          const isActive = displayedPreference === option.value;
          const isTabStop = isActive || (!displayedPreference && index === 0);

          function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
            const nextIndex = getNextThemeOptionIndex(event.key, index);

            if (nextIndex === null) {
              return;
            }

            event.preventDefault();

            const nextOption = themeOptions[nextIndex];

            setThemePreference(nextOption.value);
            event.currentTarget.parentElement
              ?.querySelector<HTMLButtonElement>(
                `[data-radio-value="${nextOption.value}"]`
              )
              ?.focus();
          }

          return (
            <SelectableCardButton
              key={option.value}
              data-radio-value={option.value}
              onClick={() => setThemePreference(option.value)}
              onKeyDown={handleKeyDown}
              role="radio"
              aria-checked={isActive}
              tabIndex={isTabStop ? 0 : -1}
              active={isActive}
              label={option.label}
              description={option.description}
              icon={option.icon}
              statusLabel={isActive ? "Selected" : "Choose"}
            />
          );
        })}
      </div>

      <p className="text-sm app-text-muted">
        Your display choice is remembered in this browser. Choose System if you want GCSE
        Russian to follow your device setting.
      </p>
    </div>
  );
}

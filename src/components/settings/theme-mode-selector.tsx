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

function formatThemeLabel(value: string | null) {
  if (!value) return "Loading";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function ThemeModeSelector() {
  const { theme, themePreference, setThemePreference } = useTheme();
  const hasMounted = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot
  );
  const displayedTheme = hasMounted ? theme : null;
  const displayedPreference = hasMounted ? themePreference : null;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {themeOptions.map((option) => {
          const isActive = displayedPreference === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setThemePreference(option.value)}
              className={[
                "app-focus-ring rounded-2xl border p-4 text-left transition",
                "hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]",
                isActive
                  ? "border-[var(--accent-selected-border)] bg-[var(--accent-selected-bg)] text-[var(--accent-on-soft)] shadow-[0_1px_2px_rgba(0,0,0,0.22),0_0_0_1px_var(--accent-glow),0_14px_32px_color-mix(in_srgb,var(--accent)_10%,transparent)]"
                  : "border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-primary)] hover:border-[var(--border-strong)]",
              ].join(" ")}
              aria-pressed={isActive}
            >
              <div className="flex items-start gap-3">
                <span
                  className={[
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                    isActive
                      ? "border-[var(--accent-selected-border)] bg-[var(--background-elevated)] text-[var(--accent-on-soft)]"
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
              </div>

              <span
                className={[
                  "mt-4 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                  isActive
                    ? "bg-[color-mix(in_srgb,var(--accent)_10%,var(--background-elevated))] text-[var(--accent-on-soft)]"
                    : "bg-[var(--background-muted)] text-[var(--text-secondary)]",
                ].join(" ")}
              >
                {isActive ? "Selected" : "Choose"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl bg-[var(--background-muted)] p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-1 text-xs font-medium uppercase tracking-wide app-text-soft">
              Preference
            </div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">
              {formatThemeLabel(displayedPreference)}
            </div>
          </div>

          <div>
            <div className="mb-1 text-xs font-medium uppercase tracking-wide app-text-soft">
              Active theme
            </div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">
              {formatThemeLabel(displayedTheme)}
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm app-text-muted">
        The header theme button still works as a quick Light/Dark override. Choose System
        here when you want the platform to follow your device setting again.
      </p>
    </div>
  );
}

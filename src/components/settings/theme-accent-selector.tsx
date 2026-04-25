"use client";

import { useSyncExternalStore } from "react";
import AppIcon from "@/components/ui/app-icon";
import {
  useTheme,
  type AccentPreference,
} from "@/components/providers/theme-provider";

const accentOptions: Array<{
  value: AccentPreference;
  label: string;
  swatch: string;
}> = [
  { value: "blue", label: "Blue", swatch: "#2563eb" },
  { value: "purple", label: "Purple", swatch: "#7c3aed" },
  { value: "pink", label: "Pink", swatch: "#db2777" },
  { value: "red", label: "Red", swatch: "#dc2626" },
  { value: "orange", label: "Orange", swatch: "#ea580c" },
  { value: "yellow", label: "Yellow", swatch: "#a16207" },
  { value: "green", label: "Green", swatch: "#16a34a" },
  { value: "teal", label: "Teal/Cyan", swatch: "#0891b2" },
  { value: "brown", label: "Brown", swatch: "#8b5e34" },
  { value: "slate", label: "Slate", swatch: "#475569" },
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

export default function ThemeAccentSelector() {
  const { accentPreference, setAccentPreference } = useTheme();
  const hasMounted = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot
  );
  const displayedAccent = hasMounted ? accentPreference : null;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl [background:var(--accent-gradient-soft)] text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-selected-border)] shadow-[0_8px_18px_color-mix(in_srgb,var(--accent)_10%,transparent)]">
          <AppIcon icon="palette" size={18} />
        </span>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            Accent colour
          </h3>
          <p className="mt-1 text-sm app-text-muted">
            Choose the colour used for key actions, links, selected states, and focus.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {accentOptions.map((option) => {
          const isActive = displayedAccent === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setAccentPreference(option.value)}
              className={[
                "app-focus-ring min-h-20 rounded-2xl border p-3 text-left transition",
                "hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]",
                isActive
                  ? "app-selected-surface"
                  : "border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--border-strong)]",
              ].join(" ")}
              aria-pressed={isActive}
            >
              <span className="flex items-center gap-2">
                <span
                  className={[
                    "h-5 w-5 shrink-0 rounded-full ring-2 ring-[var(--background-elevated)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--text-primary)_16%,transparent)]",
                    isActive
                      ? "outline outline-2 outline-offset-2 outline-[var(--accent-selected-border)]"
                      : "",
                  ].join(" ")}
                  style={{ backgroundColor: option.swatch }}
                  aria-hidden="true"
                />
                <span
                  className={[
                    "text-sm font-semibold",
                    isActive ? "text-[var(--accent-on-soft)]" : "text-[var(--text-primary)]",
                  ].join(" ")}
                >
                  {option.label}
                </span>
              </span>

              <span
                className={[
                  "mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                  isActive
                    ? "[background:var(--accent-gradient-fill)] text-[var(--accent-on-fill)] shadow-[0_8px_18px_color-mix(in_srgb,var(--accent)_16%,transparent)]"
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
        Blue remains the default. This setting is saved on this device alongside your
        Light/Dark/System choice.
      </p>
    </div>
  );
}

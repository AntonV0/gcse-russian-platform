"use client";

import { useSyncExternalStore } from "react";
import AppIcon from "@/components/ui/app-icon";
import { useTheme, type AccentPreference } from "@/components/providers/theme-provider";

const accentOptions: Array<{
  value: AccentPreference;
  label: string;
}> = [
  { value: "blue", label: "Blue" },
  { value: "purple", label: "Purple" },
  { value: "pink", label: "Pink" },
  { value: "red", label: "Red" },
  { value: "orange", label: "Orange" },
  { value: "yellow", label: "Yellow" },
  { value: "green", label: "Green" },
  { value: "teal", label: "Teal" },
  { value: "brown", label: "Bronze" },
  { value: "slate", label: "Slate" },
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
  const { accentPreference, setAccentPreference, theme } = useTheme();
  const hasMounted = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot
  );
  const displayedAccent = hasMounted ? accentPreference : null;
  const displayedTheme = hasMounted ? theme : null;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl [background:var(--accent-gradient-soft)] text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-decorative-border)] shadow-[0_8px_18px_var(--accent-decorative-glow)]">
          <AppIcon icon="palette" size={18} />
        </span>

        <div className="min-w-0">
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Accent colour
          </h3>
          <p className="mt-1 text-sm app-text-muted">
            Choose the colour used for buttons, lesson highlights, progress, and focus.
          </p>
        </div>
      </div>

      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5"
        role="radiogroup"
        aria-label="Accent colour"
      >
        {accentOptions.map((option) => {
          const isActive = displayedAccent === option.value;

          return (
            <button
              key={option.value}
              type="button"
              data-theme={displayedTheme ?? undefined}
              data-accent={option.value}
              onClick={() => setAccentPreference(option.value)}
              className={[
                "app-focus-ring min-h-28 overflow-hidden rounded-xl border p-3 text-left transition",
                "hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]",
                isActive
                  ? "app-selected-surface"
                  : "border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--border-strong)]",
              ].join(" ")}
              role="radio"
              aria-checked={isActive}
            >
              <span className="flex items-center gap-2">
                <span
                  className={[
                    "h-6 w-6 shrink-0 rounded-full [background:linear-gradient(135deg,var(--accent)_0%,var(--accent-fill-hover)_100%)] ring-2 ring-[var(--background-elevated)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--text-primary)_16%,transparent)]",
                    isActive
                      ? "outline outline-2 outline-offset-2 outline-[var(--accent-selected-border)]"
                      : "",
                  ].join(" ")}
                  aria-hidden="true"
                />
                <span
                  className={[
                    "text-sm font-semibold",
                    isActive
                      ? "text-[var(--accent-on-soft)]"
                      : "text-[var(--text-primary)]",
                  ].join(" ")}
                >
                  {option.label}
                </span>
              </span>

              <span
                className="mt-3 block rounded-lg border border-[color-mix(in_srgb,var(--accent)_28%,var(--border-subtle))] [background:linear-gradient(135deg,color-mix(in_srgb,var(--accent)_13%,var(--background-elevated))_0%,var(--background-elevated)_100%)] p-2"
                aria-hidden="true"
              >
                <span className="mb-2 block h-1.5 rounded-full [background:linear-gradient(90deg,var(--accent)_0%,var(--accent-fill-hover)_100%)] shadow-[0_6px_16px_color-mix(in_srgb,var(--accent)_18%,transparent)]" />
                <span className="flex items-center justify-between gap-2">
                  <span className="h-2 w-10 rounded-full bg-[var(--background-muted)]" />
                  <span className="h-5 w-5 rounded-md [background:linear-gradient(135deg,var(--accent)_0%,var(--accent-fill-hover)_100%)] shadow-[0_6px_14px_color-mix(in_srgb,var(--accent)_18%,transparent)]" />
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
        Each tile previews the real surfaces, borders, and progress colours used around
        the course.
      </p>
    </div>
  );
}

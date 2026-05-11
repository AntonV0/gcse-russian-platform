"use client";

import { useSyncExternalStore, type KeyboardEvent } from "react";
import AppIcon from "@/components/ui/app-icon";
import SelectableCardButton from "@/components/ui/selectable-card-button";
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

function getNextAccentOptionIndex(key: string, currentIndex: number) {
  if (key === "ArrowRight" || key === "ArrowDown") {
    return (currentIndex + 1) % accentOptions.length;
  }

  if (key === "ArrowLeft" || key === "ArrowUp") {
    return (currentIndex - 1 + accentOptions.length) % accentOptions.length;
  }

  if (key === "Home") {
    return 0;
  }

  if (key === "End") {
    return accentOptions.length - 1;
  }

  return null;
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
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--accent-decorative-border)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--background-elevated))] text-[var(--accent-on-soft)]">
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
        {accentOptions.map((option, index) => {
          const isActive = displayedAccent === option.value;
          const isTabStop = isActive || (!displayedAccent && index === 0);

          function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
            const nextIndex = getNextAccentOptionIndex(event.key, index);

            if (nextIndex === null) {
              return;
            }

            event.preventDefault();

            const nextOption = accentOptions[nextIndex];

            setAccentPreference(nextOption.value);
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
              data-theme={displayedTheme ?? undefined}
              data-accent={option.value}
              onClick={() => setAccentPreference(option.value)}
              onKeyDown={handleKeyDown}
              role="radio"
              aria-checked={isActive}
              tabIndex={isTabStop ? 0 : -1}
              active={isActive}
              label={option.label}
              className="min-h-28 overflow-hidden p-3"
              leadingVisual={
                <span
                  className={[
                    "h-6 w-6 shrink-0 rounded-full bg-[var(--accent-fill)] ring-2 ring-[var(--background-elevated)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--text-primary)_16%,transparent)]",
                    isActive
                      ? "outline outline-2 outline-offset-2 outline-[var(--accent-selected-border)]"
                      : "",
                  ].join(" ")}
                  aria-hidden="true"
                />
              }
              statusLabel={isActive ? "Selected" : "Choose"}
            >
              <span
                className="mt-3 block rounded-lg border border-[color-mix(in_srgb,var(--accent)_22%,var(--border-subtle))] bg-[var(--background-elevated)] p-2"
                aria-hidden="true"
              >
                <span className="mb-2 block h-1.5 rounded-full bg-[var(--accent-fill)] shadow-[0_6px_16px_color-mix(in_srgb,var(--accent)_12%,transparent)]" />
                <span className="flex items-center justify-between gap-2">
                  <span className="h-2 w-10 rounded-full bg-[var(--background-muted)]" />
                  <span className="h-5 w-5 rounded-md bg-[color-mix(in_srgb,var(--accent)_12%,var(--background-elevated))] shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_20%,transparent)]" />
                </span>
              </span>
            </SelectableCardButton>
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

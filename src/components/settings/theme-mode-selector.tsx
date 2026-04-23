"use client";

import { useTheme, type ThemePreference } from "@/components/providers/theme-provider";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";

const themeOptions: Array<{
  value: ThemePreference;
  label: string;
  description: string;
}> = [
  {
    value: "light",
    label: "Light",
    description: "Always use the light theme.",
  },
  {
    value: "dark",
    label: "Dark",
    description: "Always use the dark theme.",
  },
  {
    value: "system",
    label: "System",
    description: "Follow your device appearance automatically.",
  },
];

export default function ThemeModeSelector() {
  const { theme, themePreference, setThemePreference } = useTheme();

  return (
    <div className="space-y-4">
      <FormField
        label="Theme mode"
        description="Choose a fixed theme or follow your device setting."
      >
        <div className="flex flex-wrap gap-2">
          {themeOptions.map((option) => {
            const isActive = themePreference === option.value;

            return (
              <Button
                key={option.value}
                type="button"
                variant={isActive ? "primary" : "secondary"}
                size="sm"
                onClick={() => setThemePreference(option.value)}
                ariaLabel={`Use ${option.label.toLowerCase()} theme mode`}
              >
                {option.label}
              </Button>
            );
          })}
        </div>
      </FormField>

      <div className="rounded-2xl bg-[var(--background-muted)] p-4">
        <div className="space-y-2">
          <div className="text-sm font-semibold text-[var(--text-primary)]">
            Current appearance
          </div>

          <div className="text-sm text-[var(--text-secondary)]">
            <span className="font-medium text-[var(--text-primary)]">Preference:</span>{" "}
            {themePreference
              ? themePreference.charAt(0).toUpperCase() + themePreference.slice(1)
              : "Loading"}
          </div>

          <div className="text-sm text-[var(--text-secondary)]">
            <span className="font-medium text-[var(--text-primary)]">Active theme:</span>{" "}
            {theme ? theme.charAt(0).toUpperCase() + theme.slice(1) : "Loading"}
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm text-[var(--text-secondary)]">
        <p>
          {themeOptions.find((option) => option.value === themePreference)?.description}
        </p>
        <p>
          The header theme button still works as a quick override and will switch you to a
          fixed Light or Dark choice.
        </p>
      </div>
    </div>
  );
}

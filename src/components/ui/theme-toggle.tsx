"use client";

import AppIcon from "@/components/ui/app-icon";
import { useTheme } from "@/components/providers/theme-provider";

export default function ThemeToggle() {
  const { theme, toggleTheme, themePreference } = useTheme();

  const title =
    themePreference === "system"
      ? "Toggle theme (currently following system)"
      : "Toggle theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="app-icon-button app-focus-ring"
      aria-label={title}
      title={title}
    >
      {theme ? (
        <AppIcon
          icon={theme === "dark" ? "sun" : "moon"}
          size={17}
          className="app-icon-button-icon"
        />
      ) : (
        <span aria-hidden="true" className="block h-[17px] w-[17px] shrink-0" />
      )}
    </button>
  );
}

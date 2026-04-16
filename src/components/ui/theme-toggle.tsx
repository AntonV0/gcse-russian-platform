"use client";

import { useReducer } from "react";
import AppIcon from "@/components/ui/app-icon";
import { appIcons } from "@/lib/shared/icons";

function getCurrentTheme(): "light" | "dark" {
  if (typeof document === "undefined") {
    return "light";
  }

  const current = document.documentElement.getAttribute("data-theme");
  return current === "dark" ? "dark" : "light";
}

export default function ThemeToggle() {
  const [, forceRender] = useReducer((value: number) => value + 1, 0);
  const theme = getCurrentTheme();

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    forceRender();
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="app-icon-button app-focus-ring"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <AppIcon
        icon={theme === "dark" ? appIcons.sun : appIcons.moon}
        size={17}
        className="app-icon-button-icon"
      />
    </button>
  );
}

"use client";

import { useState } from "react";
import AppIcon from "@/components/ui/app-icon";

type ThemeMode = "light" | "dark";

function readCurrentTheme(): ThemeMode {
  if (typeof document === "undefined") {
    return "light";
  }

  const current = document.documentElement.getAttribute("data-theme");
  return current === "dark" ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(() => readCurrentTheme());

  function toggleTheme() {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
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
        icon={theme === "dark" ? "sun" : "moon"}
        size={17}
        className="app-icon-button-icon"
      />
    </button>
  );
}

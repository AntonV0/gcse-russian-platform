"use client";

import { useEffect, useState } from "react";
import AppIcon from "@/components/ui/app-icon";

type ThemeMode = "light" | "dark";

function readCurrentTheme(): ThemeMode {
  const current = document.documentElement.getAttribute("data-theme");
  return current === "dark" ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode | null>(null);

  useEffect(() => {
    setTheme(readCurrentTheme());
  }, []);

  function toggleTheme() {
    const current = theme ?? readCurrentTheme();
    const next: ThemeMode = current === "dark" ? "light" : "dark";

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

"use client";

import { useEffect, useState } from "react";
import AppIcon from "@/components/ui/app-icon";
import { appIcons } from "@/lib/icons";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme") as
      | "light"
      | "dark"
      | null;

    setTheme(current || "light");
    setMounted(true);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  if (!mounted) return null;

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

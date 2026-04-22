"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  theme: ThemeMode | null;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

const THEME_STORAGE_KEY = "theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ThemeMode {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredTheme(): ThemeMode | null {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "dark" || stored === "light" ? stored : null;
}

function readResolvedTheme(): ThemeMode {
  const current = document.documentElement.getAttribute("data-theme");
  return current === "dark" ? "dark" : "light";
}

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;

  // enable transitions
  root.classList.add("theme-transition");

  root.setAttribute("data-theme", theme);

  // disable transitions after change
  window.setTimeout(() => {
    root.classList.remove("theme-transition");
  }, 300);
}

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode | null>(null);

  const setTheme = useCallback((nextTheme: ThemeMode) => {
    applyTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const current = theme ?? readResolvedTheme();
    const nextTheme: ThemeMode = current === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  }, [setTheme, theme]);

  useEffect(() => {
    const storedTheme = readStoredTheme();
    const resolvedTheme = storedTheme ?? readResolvedTheme();

    applyTheme(resolvedTheme);
    setThemeState(resolvedTheme);

    function handleStorage(event: StorageEvent) {
      if (event.key !== THEME_STORAGE_KEY) {
        return;
      }

      const nextStoredTheme =
        event.newValue === "dark" || event.newValue === "light" ? event.newValue : null;

      const nextTheme = nextStoredTheme ?? getSystemTheme();

      applyTheme(nextTheme);
      setThemeState(nextTheme);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleSystemThemeChange() {
      const storedTheme = readStoredTheme();

      if (storedTheme) {
        return;
      }

      const nextTheme = mediaQuery.matches ? "dark" : "light";
      applyTheme(nextTheme);
      setThemeState(nextTheme);
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

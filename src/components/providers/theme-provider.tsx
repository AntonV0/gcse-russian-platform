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
export type ThemePreference = ThemeMode | "system";

type ThemeContextValue = {
  theme: ThemeMode | null;
  themePreference: ThemePreference | null;
  setThemePreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
};

const THEME_STORAGE_KEY = "theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ThemeMode {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredThemePreference(): ThemePreference | null {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" || stored === "system" ? stored : null;
}

function readResolvedTheme(): ThemeMode {
  const current = document.documentElement.getAttribute("data-theme");
  return current === "dark" ? "dark" : "light";
}

function resolveTheme(preference: ThemePreference | null): ThemeMode {
  if (preference === "light" || preference === "dark") {
    return preference;
  }

  return getSystemTheme();
}

function applyTheme(theme: ThemeMode, animate = true) {
  const root = document.documentElement;

  if (animate) {
    root.classList.add("theme-transition");
  }

  root.setAttribute("data-theme", theme);

  if (animate) {
    window.setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 300);
  }
}

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode | null>(null);
  const [themePreference, setThemePreferenceState] = useState<ThemePreference | null>(
    null
  );

  const setThemePreference = useCallback((nextPreference: ThemePreference) => {
    const resolvedTheme = resolveTheme(nextPreference);

    localStorage.setItem(THEME_STORAGE_KEY, nextPreference);
    applyTheme(resolvedTheme);
    setThemePreferenceState(nextPreference);
    setThemeState(resolvedTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const currentResolvedTheme = theme ?? readResolvedTheme();
    const nextTheme: ThemeMode = currentResolvedTheme === "dark" ? "light" : "dark";

    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
    setThemePreferenceState(nextTheme);
    setThemeState(nextTheme);
  }, [theme]);

  useEffect(() => {
    const storedPreference = readStoredThemePreference();
    const initialPreference: ThemePreference = storedPreference ?? "system";
    const initialResolvedTheme = resolveTheme(initialPreference);

    applyTheme(initialResolvedTheme, false);
    setThemePreferenceState(initialPreference);
    setThemeState(initialResolvedTheme);

    function handleStorage(event: StorageEvent) {
      if (event.key !== THEME_STORAGE_KEY) {
        return;
      }

      const nextPreference =
        event.newValue === "light" ||
        event.newValue === "dark" ||
        event.newValue === "system"
          ? event.newValue
          : "system";

      const nextResolvedTheme = resolveTheme(nextPreference);

      applyTheme(nextResolvedTheme);
      setThemePreferenceState(nextPreference);
      setThemeState(nextResolvedTheme);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleSystemThemeChange() {
      const storedPreference = readStoredThemePreference() ?? "system";

      if (storedPreference !== "system") {
        return;
      }

      const nextResolvedTheme: ThemeMode = mediaQuery.matches ? "dark" : "light";

      applyTheme(nextResolvedTheme);
      setThemePreferenceState("system");
      setThemeState(nextResolvedTheme);
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
      themePreference,
      setThemePreference,
      toggleTheme,
    }),
    [theme, themePreference, setThemePreference, toggleTheme]
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

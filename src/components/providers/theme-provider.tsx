"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { updateAppearancePreferences } from "@/app/actions/settings/preference-actions";

export type ThemeMode = "light" | "dark";
export type ThemePreference = ThemeMode | "system";
export type AccentPreference =
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "brown"
  | "slate";

type ThemeContextValue = {
  theme: ThemeMode | null;
  themePreference: ThemePreference | null;
  accentPreference: AccentPreference | null;
  setThemePreference: (preference: ThemePreference) => void;
  setAccentPreference: (preference: AccentPreference) => void;
  toggleTheme: () => void;
};

const THEME_STORAGE_KEY = "theme";
const ACCENT_STORAGE_KEY = "accent";
const DEFAULT_ACCENT: AccentPreference = "blue";
const ACCENT_OPTIONS = new Set<AccentPreference>([
  "blue",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "brown",
  "slate",
]);

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredThemePreference(): ThemePreference | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" || stored === "system" ? stored : null;
}

function isAccentPreference(value: string | null): value is AccentPreference {
  return value !== null && ACCENT_OPTIONS.has(value as AccentPreference);
}

function readStoredAccentPreference(): AccentPreference | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem(ACCENT_STORAGE_KEY);
  return isAccentPreference(stored) ? stored : null;
}

function readResolvedTheme(): ThemeMode {
  if (typeof document === "undefined") {
    return "light";
  }

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
  if (typeof document === "undefined") {
    return;
  }

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

function applyAccent(accent: AccentPreference, animate = true) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;

  if (animate) {
    root.classList.add("theme-transition");
  }

  root.setAttribute("data-accent", accent);

  if (animate) {
    window.setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 300);
  }
}

function readInitialThemeState() {
  const storedPreference = readStoredThemePreference();
  const storedAccent = readStoredAccentPreference();
  const initialPreference: ThemePreference = storedPreference ?? "system";

  return {
    theme: resolveTheme(initialPreference),
    themePreference: initialPreference,
    accentPreference: storedAccent ?? DEFAULT_ACCENT,
  };
}

type ThemeProviderProps = {
  children: React.ReactNode;
  initialThemePreference?: ThemePreference | null;
  initialAccentPreference?: AccentPreference | null;
};

export function ThemeProvider({
  children,
  initialThemePreference,
  initialAccentPreference,
}: ThemeProviderProps) {
  const initialState = readInitialThemeState();
  const resolvedInitialPreference =
    initialThemePreference ?? initialState.themePreference;
  const resolvedInitialAccent = initialAccentPreference ?? initialState.accentPreference;
  const [theme, setThemeState] = useState<ThemeMode | null>(() =>
    resolveTheme(resolvedInitialPreference)
  );
  const [themePreference, setThemePreferenceState] = useState<ThemePreference | null>(
    () => resolvedInitialPreference
  );
  const [accentPreference, setAccentPreferenceState] = useState<AccentPreference | null>(
    () => resolvedInitialAccent
  );

  const setThemePreference = useCallback((nextPreference: ThemePreference) => {
    const resolvedTheme = resolveTheme(nextPreference);

    localStorage.setItem(THEME_STORAGE_KEY, nextPreference);
    applyTheme(resolvedTheme);
    setThemePreferenceState(nextPreference);
    setThemeState(resolvedTheme);
    void updateAppearancePreferences({ themePreference: nextPreference });
  }, []);

  const toggleTheme = useCallback(() => {
    const currentResolvedTheme = theme ?? readResolvedTheme();
    const nextTheme: ThemeMode = currentResolvedTheme === "dark" ? "light" : "dark";

    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
    setThemePreferenceState(nextTheme);
    setThemeState(nextTheme);
    void updateAppearancePreferences({ themePreference: nextTheme });
  }, [theme]);

  const setAccentPreference = useCallback((nextPreference: AccentPreference) => {
    localStorage.setItem(ACCENT_STORAGE_KEY, nextPreference);
    applyAccent(nextPreference);
    setAccentPreferenceState(nextPreference);
    void updateAppearancePreferences({ accentPreference: nextPreference });
  }, []);

  useEffect(() => {
    applyTheme(theme ?? readResolvedTheme(), false);
    applyAccent(
      accentPreference ?? readStoredAccentPreference() ?? DEFAULT_ACCENT,
      false
    );
    localStorage.setItem(THEME_STORAGE_KEY, themePreference ?? "system");
    localStorage.setItem(ACCENT_STORAGE_KEY, accentPreference ?? DEFAULT_ACCENT);

    function handleStorage(event: StorageEvent) {
      if (event.key === ACCENT_STORAGE_KEY) {
        const nextPreference = isAccentPreference(event.newValue)
          ? event.newValue
          : DEFAULT_ACCENT;

        applyAccent(nextPreference);
        setAccentPreferenceState(nextPreference);
        return;
      }

      if (event.key === THEME_STORAGE_KEY) {
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
  }, [theme, themePreference, accentPreference]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      themePreference,
      accentPreference,
      setThemePreference,
      setAccentPreference,
      toggleTheme,
    }),
    [
      theme,
      themePreference,
      accentPreference,
      setThemePreference,
      setAccentPreference,
      toggleTheme,
    ]
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

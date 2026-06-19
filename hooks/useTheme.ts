"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "simple-notion-theme";

export type ThemeMode = "light" | "dark" | "system";

export function useTheme() {
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [systemIsDark, setSystemIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    if (
      savedTheme === "dark" ||
      savedTheme === "light" ||
      savedTheme === "system"
    ) {
      setThemeMode(savedTheme);
    }

    setSystemIsDark(mediaQuery.matches);
    setIsLoaded(true);

    function handleSystemThemeChange(event: MediaQueryListEvent) {
      setSystemIsDark(event.matches);
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  const isDark =
    themeMode === "dark" || (themeMode === "system" && systemIsDark);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    localStorage.setItem(THEME_KEY, themeMode);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  }, [isDark, isLoaded, themeMode]);

  return {
    isDark,
    setThemeMode,
    themeMode,
  };
}
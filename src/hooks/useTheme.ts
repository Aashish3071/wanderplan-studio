import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system");
  const [isClient, setIsClient] = useState(false);

  // Set up the theme from localStorage once the component mounts on the client
  useEffect(() => {
    setIsClient(true);
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const root = window.document.documentElement;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const activeTheme = theme === "system" ? systemTheme : theme;

    root.classList.remove("light", "dark");
    root.classList.add(activeTheme);
    localStorage.setItem("theme", theme);
  }, [theme, isClient]);

  useEffect(() => {
    if (!isClient) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        const root = window.document.documentElement;
        const systemTheme = mediaQuery.matches ? "dark" : "light";
        root.classList.remove("light", "dark");
        root.classList.add(systemTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, isClient]);

  // Get the current color scheme preference for the system
  const getSystemTheme = () => {
    if (!isClient) return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  return {
    theme,
    setTheme,
    isLight: !isClient ? true : (
      theme === "light" ||
      (theme === "system" && !getSystemTheme())
    ),
    isDark: !isClient ? false : (
      theme === "dark" ||
      (theme === "system" && getSystemTheme())
    ),
  };
}

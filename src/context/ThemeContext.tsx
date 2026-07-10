import { createContext, useContext, useState, useEffect, useLayoutEffect } from "react";

type Mode = "Light" | "Dark";

const themes = {
  Light: {
    "--bg": "#e4e4df",
    "--ink": "#1a1a17",
    "--ink-mid": "#54533a",
    "--ink-muted": "#8a8a7c",
    "--ink-faint": "#aaaaa0",
  },
  Dark: {
    "--bg": "#1a1a17",
    "--ink": "#e4e4df",
    "--ink-mid": "#a8a899",
    "--ink-muted": "#6b6b5e",
    "--ink-faint": "#4a4a40",
  },
};

const applyTheme = (mode: Mode) => {
  const vars = themes[mode];
  Object.entries(vars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
};

interface ThemeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function getPreferredMode(): Mode {
  const stored = localStorage.getItem("theme") as Mode | null;
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "Dark"
    : "Light";
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<Mode>(getPreferredMode);

  useLayoutEffect(() => {
    applyTheme(mode);
  }, [mode]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const listener = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("theme")) return;
      const newMode: Mode = e.matches ? "Dark" : "Light";
      setMode(newMode);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const handleSetMode = (newMode: Mode) => {
    setMode(newMode);
    localStorage.setItem("theme", newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, setMode: handleSetMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};

import { createContext, useContext, useState } from "react";

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
    // "--ink-mid": "#c8c8b8",
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

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<Mode>("Light");

  const handleSetMode = (newMode: Mode) => {
    setMode(newMode);
    applyTheme(newMode);
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

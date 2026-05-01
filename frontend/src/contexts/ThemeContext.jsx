import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Force "light" on the first load of this session to ensure the human-crafted theme is visible
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Sync with HTML class
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("ttm_theme", theme);
  }, [theme]);

  const value = {
    theme,
    toggleTheme: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

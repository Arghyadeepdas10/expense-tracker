"use client"
import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { createContext, ReactNode, useState } from "react";

interface ThemeContextProps {
  toggle: boolean;
  toggleTheme: () => void;
  theme: "light" | "dark";
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const Theme = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [toggle, setToggle] = useState(false);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const modetheme = createTheme({
    palette: {
      mode: theme,
    },
  });

  return (
    <ThemeContext.Provider value={{ toggle, toggleTheme, theme }}>
      <MuiThemeProvider theme={modetheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
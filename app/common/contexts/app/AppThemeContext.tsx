import { createAppTheme } from "@common/theme";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
// Re-export ThemeProvider from MUI so the file is self-contained.
export { ThemeProvider, CssBaseline };

// ---------- Color Mode Context + Provider ----------
type ColorMode = "light" | "dark";

interface IAppThemeContextProps {
  mode: ColorMode;
  toggleColorMode: () => void;
  setMode: (mode: ColorMode) => void;
}

const AppThemeContext = createContext<IAppThemeContextProps | undefined>(
  {} as IAppThemeContextProps
);

interface IColorModeProviderProps {
  children: React.ReactNode;
}

const THEME_COLOR_KEY = "mui-color-scheme";

const getInitialMode = (): ColorMode => {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    const saved = localStorage.getItem(THEME_COLOR_KEY) as ColorMode | null;
    if (saved === "light" || saved === "dark") return saved;

    const prefersDark = window.matchMedia?.(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDark ? "dark" : "light";
  }

  // fallback to light mode for SSR or non-browser environments
  return "light";
};

export function AppThemeProvider({ children }: IColorModeProviderProps) {
  const [mode, setModeState] = useState<ColorMode>(getInitialMode);

  const setMode = useCallback((currentMode: ColorMode) => {
    setModeState(currentMode);

    try {
      localStorage.setItem(THEME_COLOR_KEY, currentMode);
    } catch (error) {
      console.error(error);
    }

    document.documentElement.style.colorScheme = currentMode;
  }, []);

  const toggleColorMode = useCallback(() => {
    setMode(mode === "light" ? "dark" : "light");
  }, [mode, setMode]);

  const value = useMemo(
    () => ({ mode, toggleColorMode, setMode }),
    [mode, toggleColorMode, setMode]
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <AppThemeContext.Provider value={value}>
      {/* ThemeProvider colocará o theme no contexto */}
      {/* Importante: Use CssBaseline no seu App */}
      {/* @ts-ignore */}
      <ThemeProvider theme={theme}>
        <Box minHeight="100dvh" display="flex" flexDirection="column">
          {children}
        </Box>
      </ThemeProvider>
    </AppThemeContext.Provider>
  );
}

export const useAppThemeContext = () => {
  const ctx = useContext(AppThemeContext);
  if (!ctx)
    throw new Error("useColorMode must be used within <ColorModeProvider>");
  return ctx;
};

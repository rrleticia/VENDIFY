import {
  createTheme,
  responsiveFontSizes,
  type ThemeOptions,
  type Theme,
} from "@mui/material/styles";
import { deepmerge } from "@mui/utils";
import {
  indigo,
  blueGrey,
  teal,
  grey,
  green,
  red,
  amber,
} from "@mui/material/colors";

// ---------- Palette Augmentation (adds palette.neutral + button "soft" variant) ----------
declare module "@mui/material/styles" {
  interface Palette {
    neutral: Palette["primary"];
  }
  interface PaletteOptions {
    neutral?: PaletteOptions["primary"];
  }
}
declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    soft: true;
  }
}

// ---------- Design Tokens ----------
const brand = {
  // Adjust these 3 to rebrand quickly:
  primary: indigo,
  secondary: teal,
  neutral: blueGrey,
};

const commonOptions: ThemeOptions = {
  shape: { borderRadius: 12 },
  spacing: 8,
  typography: {
    fontFamily: [
      "Inter",
      "Roboto",
      "system-ui",
      "-apple-system",
      "Segoe UI",
      "Arial",
    ].join(","),
    button: {
      textTransform: "none",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  transitions: {
    duration: {
      shorter: 120,
      shortest: 90,
    },
  },
  zIndex: {
    appBar: 1200,
    drawer: 1100,
    modal: 1500,
    tooltip: 1600,
  },
};

// ---------- Tokens per mode ----------
function getDesignTokens(mode: "light" | "dark"): ThemeOptions {
  const isLight = mode === "light";
  return {
    palette: {
      mode,
      primary: {
        light: brand.primary[400],
        main: isLight ? brand.primary[600] : brand.primary[300],
        dark: isLight ? brand.primary[800] : brand.primary[200],
      },
      secondary: {
        light: brand.secondary[300],
        main: isLight ? brand.secondary[500] : brand.secondary[300],
        dark: brand.secondary[700],
      },
      neutral: {
        light: brand.neutral[300],
        main: isLight ? brand.neutral[500] : brand.neutral[400],
        dark: brand.neutral[700],
      },
      success: {
        light: green[400],
        main: isLight ? green[600] : green[400],
        dark: green[800],
      },
      warning: {
        light: amber[400],
        main: isLight ? amber[600] : amber[400],
        dark: amber[800],
      },
      error: {
        light: red[400],
        main: isLight ? red[600] : red[400],
        dark: red[800],
      },
      divider: isLight ? grey[300] : "rgba(255,255,255,0.12)",
      background: {
        default: isLight ? "#f6f7fb" : "#0f1115",
        paper: isLight ? "#ffffff" : "#141821",
      },
      text: {
        primary: isLight ? grey[900] : grey[100],
        secondary: isLight ? grey[700] : grey[400],
        disabled: isLight ? grey[500] : grey[600],
      },
      action: {
        hoverOpacity: 0.08,
        selectedOpacity: 0.12,
        disabledOpacity: 0.38,
        focusOpacity: 0.15,
      },
    },
  };
}

// ---------- Component Overrides & Defaults ----------
function getThemedComponents(mode: "light" | "dark"): ThemeOptions {
  const isLight = mode === "light";
  return {
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: "none",
            // Subtle grid bg for large monitors (optional)
            // backgroundImage: isLight
            //   ? 'radial-gradient(#eceef3 1px, transparent 1px)'
            //   : 'radial-gradient(#1b2230 1px, transparent 1px)',
            // backgroundSize: '16px 16px',
          },
          "*:focus-visible": {
            outlineColor: isLight ? brand.primary[600] : brand.primary[300],
          },
        },
      },

      MuiAppBar: {
        defaultProps: { elevation: 0, color: "default" },
        styleOverrides: {
          root: {
            backdropFilter: "saturate(180%) blur(8px)",
            backgroundColor: isLight
              ? "rgba(255,255,255,0.86)"
              : "rgba(20,24,33,0.7)",
            borderBottom: `1px solid ${isLight ? "#e9edf3" : "rgba(255,255,255,0.08)"}`,
          },
        },
      },

      MuiContainer: {
        defaultProps: { maxWidth: "lg" },
      },

      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: `1px solid ${isLight ? "#e8ecf2" : "rgba(255,255,255,.08)"} `,
            boxShadow: isLight
              ? "0 2px 6px rgba(20,30,55,.06)"
              : "0 2px 10px rgba(0,0,0,.35)",
          },
        },
      },

      MuiButtonBase: {
        defaultProps: { disableRipple: true },
      },

      MuiButton: {
        defaultProps: { size: "medium" },
        styleOverrides: {
          root: {
            borderRadius: 12,
            paddingInline: 16,
          },
          contained: {
            boxShadow: isLight
              ? "0 4px 10px rgba(63,81,181,.18)"
              : "0 4px 10px rgba(0,0,0,.5)",
          },
          outlined: {
            borderWidth: 2,
            "&:hover": { borderWidth: 2 },
          },
        },
        variants: [
          // Soft variant
          {
            props: { variant: "soft" as any },
            style: ({ theme }) => ({
              background:
                theme.palette.mode === "light"
                  ? "#EEF2FF"
                  : "rgba(99,102,241,0.14)",
              color:
                theme.palette.mode === "light"
                  ? theme.palette.primary.main
                  : theme.palette.primary.light,
              border: `1px solid ${
                theme.palette.mode === "light"
                  ? "#E0E7FF"
                  : "rgba(99,102,241,0.3)"
              }`,
              "&:hover": {
                background:
                  theme.palette.mode === "light"
                    ? "#E0E7FF"
                    : "rgba(99,102,241,0.22)",
              },
            }),
          },
        ],
      },

      MuiTextField: {
        defaultProps: { size: "small", variant: "outlined" },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: isLight ? "#fff" : "#11151d",
          },
          notchedOutline: {
            borderColor: isLight ? "#dbe1ea" : "rgba(255,255,255,0.12)",
          },
          input: {
            paddingBlock: 12,
          },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: `1px solid ${isLight ? "#e9edf3" : "rgba(255,255,255,.08)"}`,
            backgroundImage: "none",
          },
        },
      },

      MuiChip: {
        defaultProps: { size: "small" },
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: 10,
          },
        },
      },

      MuiTooltip: {
        defaultProps: { arrow: true },
        styleOverrides: {
          tooltip: {
            fontSize: "0.8rem",
            padding: "8px 10px",
          },
        },
      },

      MuiMenu: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          paper: {
            borderRadius: 12,
            border: `1px solid ${isLight ? "#e8ecf2" : "rgba(255,255,255,.08)"}`,
            backgroundImage: "none",
          },
        },
      },

      MuiDialog: {
        defaultProps: { fullWidth: true, maxWidth: "sm" },
        styleOverrides: {
          paper: {
            borderRadius: 16,
            border: `1px solid ${isLight ? "#e8ecf2" : "rgba(255,255,255,.08)"}`,
            backgroundImage: "none",
          },
        },
      },

      MuiLink: {
        defaultProps: { underline: "hover" },
        styleOverrides: {
          root: ({ theme }) => ({
            fontWeight: 600,
            color: theme.palette.primary.main,
          }),
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isLight ? "#e9edf3" : "rgba(255,255,255,.08)",
          },
        },
      },
    },
  };
}

// ---------- Theme Factory ----------
export function createAppTheme(mode: "light" | "dark" = "light"): Theme {
  const base = createTheme(commonOptions);

  return responsiveFontSizes(base);
}

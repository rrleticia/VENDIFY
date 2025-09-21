import { useAppThemeContext } from "@common/contexts/app";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import Brightness4 from "@mui/icons-material/Brightness4";
import Brightness7 from "@mui/icons-material/Brightness7";

function ThemeToggle() {
  const { mode, toggleColorMode } = useAppThemeContext();

  return (
    <Tooltip
      title={`Trocar para modo ${mode === "light" ? "escuro" : "claro"}`}
    >
      <IconButton
        onClick={toggleColorMode}
        color="inherit"
        sx={{
          fontSize: 1,
          borderRadius: "50%",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {mode === "dark" ? (
          <Brightness7 sx={{ fontSize: 20 }} />
        ) : (
          <Brightness4 sx={{ fontSize: 20 }} />
        )}
      </IconButton>
    </Tooltip>
  );
}

export default function AppFooter() {
  return (
    <Box
      component="footer"
      sx={{ borderTop: 1, borderColor: "divider", px: 2, py: 3 }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2025 Loja Virtual
        </Typography>
        <ThemeToggle />
      </Box>
    </Box>
  );
}

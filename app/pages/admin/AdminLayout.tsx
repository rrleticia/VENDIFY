import { RoleGuard } from "@admin/guards/RoleGuard";

import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Link, Outlet, useLocation } from "react-router";
import { useAdminAuth } from "../contexts/AdminAuthContext";

export default function AdminLayout() {
  const { pathname } = useLocation();
  const { user, signOut } = useAdminAuth();

  return (
    // <RoleGuard roles={["admin", "editor", "vendedor"]}>
    <Box className="min-h-screen" sx={{ bgcolor: "background.default" }}>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6">BUYLY • Admin</Typography>
          <Button
            component={Link}
            to="/admin/dashboard"
            color={pathname.includes("/dashboard") ? "inherit" : "secondary"}
          >
            Dashboard
          </Button>
          <Button
            component={Link}
            to="/admin/catalogo"
            color={pathname.includes("/catalogo") ? "inherit" : "secondary"}
          >
            Catálogo
          </Button>
          <Button
            component={Link}
            to="/admin/pedidos"
            color={pathname.includes("/pedidos") ? "inherit" : "secondary"}
          >
            Pedidos
          </Button>
          <Button
            component={Link}
            to="/admin/clientes"
            color={pathname.includes("/clientes") ? "inherit" : "secondary"}
          >
            Clientes
          </Button>
          <Button
            component={Link}
            to="/admin/config"
            color={pathname.includes("/config") ? "inherit" : "secondary"}
          >
            Config
          </Button>
          <Box sx={{ flex: 1 }} />
          <Typography variant="body2">
            {user?.name} ({user?.role})
          </Typography>
          <Button onClick={signOut} color="inherit">
            Sair
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
    //  </RoleGuard>
  );
}

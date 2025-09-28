<<<<<<< HEAD
import "@common/boot/persistProducts";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Stack,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  IconButton,
  Breadcrumbs,
  Link as MLink,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink, Outlet, useLocation } from "react-router";
import { isAuthenticated, logout } from "@services/api/AdminAuthService";
import { useNavigate } from "react-router";
import React from "react";

const drawerWidth = 220;

function useBreadcrumb() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  const trail = [];
  let acc = "";
  for (const p of parts) {
    acc += `/${p}`;
    trail.push({ label: p.charAt(0).toUpperCase() + p.slice(1), to: acc });
  }
  return trail;
}

export default function AdminLayout() {
  const nav = useNavigate();
  const authed = isAuthenticated();
  const [open, setOpen] = React.useState(false);
  const crumbs = useBreadcrumb();

const Menu = (
    <Box role="presentation" sx={{ width: drawerWidth }}>
      <List>
        {authed && (
          <>
            <ListItemButton component={RouterLink} to="/admin/catalog">
              <ListItemText primary="Catálogo" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/admin/categories">
              <ListItemText primary="Categorias" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/admin/orders">
              <ListItemText primary="Pedidos" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/admin/logs">
              <ListItemText primary="Logs" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/admin/security">
              <ListItemText primary="Segurança" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/admin/users">
              <ListItemText primary="Usuários" />
            </ListItemButton>
          </>
        )}
        {!authed && (
          <ListItemButton component={RouterLink} to="/admin/login">
            <ListItemText primary="Login" />
          </ListItemButton>
        )}
      </List>
      <Divider />
      {authed && (
        <Box p={2}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              logout();
              nav("/admin/login", { replace: true });
            }}
          >
            Sair
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => setOpen(true)}
            sx={{ mr: 1, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin
          </Typography>
          <Stack
            direction="row"
            gap={1}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {authed && (
              <Button component={RouterLink} to="/admin">
                Dashboard
              </Button>
            )}
            {authed && (
              <Button component={RouterLink} to="/admin/catalog">
                Catálogo
              </Button>
            )}
            {authed && (
              <Button component={RouterLink} to="/admin/categories">
                Categorias
              </Button>
            )}
            {authed && (
              <Button component={RouterLink} to="/admin/orders">
                Pedidos
              </Button>
            )}
            {authed && (
              <Button component={RouterLink} to="/admin/logs">
                Logs
              </Button>
            )}
            {authed && (
              <Button component={RouterLink} to="/admin/security">
                Segurança
              </Button>
            )}
            {authed && (
              <Button component={RouterLink} to="/admin/users">
                Usuários
              </Button>
            )}
            {!authed && (
              <Button component={RouterLink} to="/admin/login">
                Login
              </Button>
            )}
            {authed && (
              <Button
                onClick={() => {
                  logout();
                  nav("/admin/login", { replace: true });
                }}
              >
                Sair
              </Button>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Drawer mobile */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: { md: "none" } }}
      >
        {Menu}
      </Drawer>

      {/* Drawer desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          },
        }}
        open
      >
        <Toolbar />
        {Menu}
      </Drawer>

      {/* Main area */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, mt: 8, ml: { md: `${drawerWidth}px` } }}
      >
        <Breadcrumbs sx={{ mb: 2 }}>
          <MLink
            component={RouterLink}
            underline="hover"
            color="inherit"
            to="/admin"
          >
            Admin
          </MLink>
          {crumbs.slice(1).map((c) => (
            <MLink
              key={c.to}
              component={RouterLink}
              underline="hover"
              color="inherit"
              to={c.to}
            >
              {c.label}
            </MLink>
          ))}
        </Breadcrumbs>
        <Container maxWidth="lg" sx={{ py: 1 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
=======
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
>>>>>>> 82c00265b44286a4cf7bd413917921aa91196f00

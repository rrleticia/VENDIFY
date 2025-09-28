import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Badge,
  Typography,
  Stack,
} from "@mui/material";
import { Link, NavLink } from "react-router";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import { useAuthContext, useCart } from "@common/contexts/";

function UserButton() {
  const { isAuthenticated, logout } = useAuthContext();

  if (isAuthenticated) {
    return (
      <>
        <Button component={NavLink} to="/orders" color="inherit">
          Pedidos
        </Button>
        <Button component={NavLink} to="/ebooks" color="inherit" startIcon={<MenuBookRoundedIcon />}>
          E-books
        </Button>
        <Button component={NavLink} to="/profile" color="inherit">
          Perfil
        </Button>
        <Button onClick={() => logout()}>Sair</Button>
      </>
    );
  } else {
    return (
      <>
        <Button component={NavLink} to="/register" color="inherit">
          Cadastrar
        </Button>
        <Button component={NavLink} to="/login" color="inherit">
          Entrar
        </Button>
      </>
    );
  }
}

export default function AppHeader({}) {
  const { itemsCount } = useCart();
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        height: 76,
        borderBottom: 1,
        borderColor: "divider",
        justifyContent: "center",
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Stack direction="row" sx={{ flex: 1 }}>
          <IconButton component={NavLink} to="/">
            <StorefrontIcon color="primary" />
          </IconButton>
          <Typography variant="body1" padding={2} fontWeight={700}>
            VENDIFY
          </Typography>
        </Stack>

        <Stack direction="row" sx={{ flex: 1, justifyContent: "end" }}>
          <Button component={NavLink} to="/catalog" color="inherit">
            Catálogo
          </Button>

          <UserButton></UserButton>

          <IconButton component={Link} to="/cart" aria-label="Carrinho">
            <Badge badgeContent={itemsCount} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

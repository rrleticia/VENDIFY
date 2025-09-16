import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Badge,
  Typography,
  Stack,
} from "@mui/material";
import { Link, NavLink, type SubmitFunction } from "react-router";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AppSearch from "./AppSearch";

interface IAppSearchProps {
  search: string; // valor inicial (vem do loader: ?name=...)
  onSearch: SubmitFunction; // useSubmit() da página
}

export default function AppHeader({ search, onSearch }: IAppSearchProps) {
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
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

        <AppSearch search={search} onSearch={onSearch} debounceMs={400} />

        <Stack direction="row" sx={{ flex: 1, justifyContent: "end" }}>
          <Button component={NavLink} to="/catalog" color="inherit">
            Catálogo
          </Button>
          <Button component={NavLink} to="/orders" color="inherit">
            Pedidos
          </Button>
          <Button component={NavLink} to="/profile" color="inherit">
            Perfil
          </Button>
          <IconButton component={Link} to="/cart" aria-label="Carrinho">
            <Badge badgeContent={1} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>{" "}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

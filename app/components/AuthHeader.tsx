import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import { NavLink } from "react-router";
import StorefrontIcon from "@mui/icons-material/Storefront";

interface IAuthHeaderProps {}

export default function AuthHeader({}: IAuthHeaderProps) {
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
        <Button component={NavLink} to="/" color="inherit">
          Voltar
        </Button>
      </Toolbar>
    </AppBar>
  );
}

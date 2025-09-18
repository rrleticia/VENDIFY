import AppFooter from "@components/AppFooter";
import AppHeader from "@components/AppHeader";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { useLocation, useNavigation, useSubmit } from "react-router";
import {
  Outlet,
  useLoaderData,
  type ClientLoaderFunctionArgs,
} from "react-router";

export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  const url = new URL(request.url);
  const name = url.searchParams.get("name")?.toLowerCase() ?? "";

  // In SPA mode just return a plain object
  return { name };
}

function NavDebug() {
  const navigation = useNavigation();
  const location = useLocation();
  if (navigation.state === "idle") return null;

  return (
    <Paper
      elevation={4}
      sx={{
        position: "fixed",
        right: 12,
        top: 0,
        p: 1.5,
        zIndex: 9999,
        borderRadius: 2,
      }}
    >
      <Stack>
        <Typography variant="caption">NAV STATE: {navigation.state}</Typography>
        <Typography variant="caption">
          from: {location.pathname + location.search}
        </Typography>
        <Typography variant="caption">
          to: {navigation.location?.pathname ?? "—"}
          {navigation.location?.search ?? ""}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default function HomeLayout() {
  const { name } = useLoaderData() as {
    name: string;
  };

  const submit = useSubmit();

  return (
    <>
      <NavDebug></NavDebug>
      <AppHeader search={name} onSearch={submit} />

      <Box sx={{ paddingY: 4, flex: 1, marginX: 9 }}>
        <Outlet />
      </Box>

      <AppFooter />
    </>
  );
}

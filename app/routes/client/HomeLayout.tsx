import AppFooter from "@components/AppStructure/AppFooter";
import AppHeader from "@components/AppStructure/AppHeader";
import { Box } from "@mui/material";
import { Outlet } from "react-router";

export default function HomeLayout() {
  return (
    <>
      <AppHeader />

      <Box sx={{ paddingY: 4, flex: 1, paddingX: 12 }}>
        <Outlet />
      </Box>

      <AppFooter />
    </>
  );
}

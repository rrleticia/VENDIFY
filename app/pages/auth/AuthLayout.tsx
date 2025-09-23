import AppFooter from "@components/AppStructure/AppFooter";
import AuthHeader from "@components/AppStructure/AuthHeader";
import { Box } from "@mui/material";
import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <>
      <AuthHeader></AuthHeader>

      <Box
        sx={{
          paddingY: 4,
          flex: 1,
          marginX: 9,
          alignContent: "center",
        }}
      >
        <Outlet />
      </Box>

      <AppFooter />
    </>
  );
}

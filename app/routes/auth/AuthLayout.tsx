import AppFooter from "@components/AppFooter";
import AuthHeader from "@components/AuthHeader";
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

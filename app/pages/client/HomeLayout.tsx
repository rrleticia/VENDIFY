<<<<<<< HEAD
import "@common/boot/persistProducts";
import AppFooter from "@components/AppFooter";
import AppHeader from "@components/AppHeader";
import { Box } from "@mui/material";
import { Outlet } from "react-router";

export default function HomeLayout() {
=======
import {
  AppThemeProvider,
  UserProvider,
  ProfileProvider,
  CartProvider,
  AuthProvider,
  OrdersProvider,
  ProductDetailsProvider,
} from "@common/contexts";
import AppFooter from "@components/AppFooter";
import AppHeader from "@components/AppHeader";
import { Box, CssBaseline } from "@mui/material";
import type { ReactNode } from "react";
import { Outlet } from "react-router";

interface IHomeProviderprops {
  children: ReactNode;
}

function HomeProvider({ children }: IHomeProviderprops) {
  return (
    <AppThemeProvider>
      <CssBaseline />
      <UserProvider>
        <ProfileProvider>
          <CartProvider>
            <AuthProvider>
              <OrdersProvider>
                <ProductDetailsProvider>
                  <HomeProvider>{children} </HomeProvider>
                </ProductDetailsProvider>
              </OrdersProvider>
            </AuthProvider>
          </CartProvider>
        </ProfileProvider>
      </UserProvider>
    </AppThemeProvider>
  );
}

function HomeComponents() {
>>>>>>> 82c00265b44286a4cf7bd413917921aa91196f00
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
<<<<<<< HEAD
=======

export default function HomeLayout() {
  return (
    <HomeProvider>
      <HomeComponents></HomeComponents>
    </HomeProvider>
  );
}
>>>>>>> 82c00265b44286a4cf7bd413917921aa91196f00

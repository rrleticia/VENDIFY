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

export default function HomeLayout() {
  return (
    <HomeProvider>
      <HomeComponents></HomeComponents>
    </HomeProvider>
  );
}

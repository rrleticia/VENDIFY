import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./pages/client/HomeLayout.tsx", [
    index("./pages/client/HomePage.tsx"),
    route("home", "./pages/auxiliar/RedirectHomePage.tsx"),
    route("catalog", "./pages/client/CatalogPage.tsx"),
    route("product/:id", "./pages/client/ProductDetails.tsx"),
    route("cart", "./pages/client/CartPage.tsx"),
    route("orders", "./pages/client/OrdersPage.tsx"),
    route("profile", "./pages/client/ProfilePage.tsx"),
    route("checkout", "./pages/client/CheckoutPage.tsx"),
    route("checkout/success", "./pages/client/CheckoutSuccessPage.tsx"),
    route("tracking/:id", "./pages/client/TrackingPage.tsx"),
    route("pix/qr", "./pages/client/PixQrPage.tsx"),
  ]),

  layout("./pages/client/AuthLayout.tsx", [
    route("login", "./pages/client/LoginPage.tsx"),
    route("register", "./pages/client/RegisterPage.tsx"),
  ]),

  route("*", "./pages/auxiliar/NotFoundPage.tsx"),
] satisfies RouteConfig;

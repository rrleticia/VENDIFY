import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./routes/client/HomeLayout.tsx", [
    index("./routes/client/HomePage.tsx"),
    route("home", "./routes/auxiliar/RedirectHomePage.tsx"),
    route("catalog", "./routes/client/CatalogPage.tsx"),
    route("product/:id", "./routes/client/ProductDetails.tsx"),
    route("cart", "./routes/client/CartPage.tsx"),
    route("orders", "./routes/client/OrdersPage.tsx"),
    route("profile", "./routes/client/ProfilePageOriginal.tsx"),
    route("checkout", "./routes/client/CheckoutPage.tsx"),
    route("checkout/success", "./routes/client/CheckoutSuccessPage.tsx"),
  ]),

  layout("./routes/auth/AuthLayout.tsx", [
    route("login", "./routes/auth/LoginPage.tsx"),
    route("register", "./routes/auth/RegisterPage.tsx"),
  ]),

  route("*", "./routes/auxiliar/NotFoundPage.tsx"),
] satisfies RouteConfig;

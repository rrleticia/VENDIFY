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
  ]),

  layout("./pages/auth/AuthLayout.tsx", [
    route("login", "./pages/auth/LoginPage.tsx"),
    route("register", "./pages/auth/RegisterPage.tsx"),
  ]),

  layout("./pages/admin/AdminLayout.tsx", [
    route("admin/dashboard", "./pages/admin/AdminDashboardPage.tsx"),
    route("admin/products", "./pages/admin/CatalogPage.tsx"),
    route("admin/customer-orders", "./pages/admin/OrdersPage.tsx"),
    route("admin/customers", "./pages/admin/CustomersPage.tsx"),
    route("admin/config", "./pages/admin/SettingsPage.tsx"),
  ]),

  route("*", "./pages/auxiliar/NotFoundPage.tsx"),
] satisfies RouteConfig;

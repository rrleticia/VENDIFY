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

  layout("./pages/client/AuthLayout.tsx", [
    route("login", "./pages/client/LoginPage.tsx"),
    route("register", "./pages/client/RegisterPage.tsx"),
  ]),

  // --- Admin ---
  layout("./pages/admin/AdminLayout.tsx", [
    route("admin/", "./pages/auxiliar/RedirectAdminPage.tsx"),
    route("admin/dashboard", "./pages/admin/DashboardAdminPage.tsx"),
    route("admin/login", "./pages/admin/AdminLoginPage.tsx"),
    route("admin/catalog", "./pages/admin/CatalogAdminPage.tsx"),
    route("admin/categories", "./pages/admin/CategoriesAdminPage.tsx"),
    route("admin/orders", "./pages/admin/OrdersAdminPage.tsx"),
    route("admin/logs", "./pages/admin/LogsAdminPage.tsx"),
    route("admin/security", "./pages/admin/SecurityAdminPage.tsx"),
    route("admin/users", "./pages/admin/UsersAdminPage.tsx"),
  ]),

  route("*", "./pages/auxiliar/NotFoundPage.tsx"),
] satisfies RouteConfig;

import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./routes/HomeLayout.tsx", [
    index("./routes/HomePage.tsx"),
    route("catalog", "./routes/CatalogPage.tsx"),
  ]),

  layout("./routes/auth/AuthLayout.tsx", [
    route("login", "./routes/auth/LoginPage.tsx"),
    route("register", "./routes/auth/RegisterPage.tsx"),
  ]),

  route("*", "./routes/NotFoundPage.tsx"),
] satisfies RouteConfig;

// app/routes.ts
import {
  type RouteConfig,
  index,
  layout,
  // route,
} from "@react-router/dev/routes";

export default [
  // app/routes.ts

  layout("./routes/HomeLayout.tsx", [
    index("./routes/HomePage.tsx"),

    // route("auth", "./routes/auth/Layout.tsx", [
    //   route("login", "./routes/auth/LoginPage.tsx"),
    //   route("register", "./routes/auth/RegisterPage.tsx"),
    // ]),

    // route("*", "./routes/NotFound.tsx"),
  ]),
] satisfies RouteConfig;

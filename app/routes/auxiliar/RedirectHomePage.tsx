// app/routes/auxiliar/RedirectHomePage.tsx
import { redirect } from "react-router";

export function clientLoader() {
  return redirect("/");
}

export default function RedirectHome() {
  return null;
}

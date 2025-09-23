import { redirect } from "react-router";

export function clientLoader() {
  return redirect("/admin/login");
}

export default function RedirectAdmin() {
  return null;
}

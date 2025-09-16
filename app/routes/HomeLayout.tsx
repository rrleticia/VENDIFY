import type { ProductType } from "@common/types/ProductType";
import AppFooter from "@components/AppFooter";
import AppHeader from "@components/AppHeader";
import { Container } from "@mui/material";
import { useSubmit } from "react-router";
import {
  Outlet,
  useLoaderData,
  type ClientLoaderFunctionArgs,
} from "react-router";

export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  const url = new URL(request.url);
  const name = url.searchParams.get("name")?.toLowerCase() ?? "";

  const all: ProductType[] = [];
  const products = name
    ? all.filter((p) => p.name.toLowerCase().includes(name))
    : all;

  // In SPA mode just return a plain object
  return { products, name };
}

export default function HomeLayout() {
  const { products, name } = useLoaderData() as {
    products: ProductType[];
    name: string;
  };

  const submit = useSubmit();

  return (
    <>
      <AppHeader search={name} onSearch={submit} />

      <Container sx={{ py: 4, flex: 1 }}>
        <Outlet />
      </Container>

      <AppFooter />
    </>
  );
}

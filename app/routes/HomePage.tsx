import { Typography, Grid } from "@mui/material";
import { products } from "@common/mocks";
import ProductCard from "@components/ProductCard";
import { useSearchParams } from "react-router";

export default function HomePage() {
  const [params] = useSearchParams();
  const query = (params.get("name") || "").toLowerCase().trim();

  const featured = products.slice(0, 8);
  const data = query
    ? featured.filter((p) =>
        [p.name, p.brand, p.category]
          .filter(Boolean)
          .some((s) => String(s).toLowerCase().includes(query))
      )
    : featured;

  return (
    <>
      <Typography variant="h5" fontWeight={800} mb={2}>
        Destaques
      </Typography>
      <Grid container spacing={2}>
        {data.map((product) => (
          <Grid key={product.id} size={2}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

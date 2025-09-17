import {
  Grid,
  Box,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { categories, products } from "@common/mocks";
import type { ProductType } from "@common/types/ProductType";

export default function CatalogPage() {
  const [sort, setSort] = useState<"relevance" | "price_asc" | "price_desc">(
    "relevance"
  );
  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let arr = products.filter((p) => !active || p.category === active);
    if (sort === "price_asc") arr = [...arr].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") arr = [...arr].sort((a, b) => b.price - a.price);
    return arr;
  }, [sort, active]);

  return (
    <Box>
      <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
        <Chip
          label="Todos"
          color={!active ? "primary" : "default"}
          onClick={() => setActive(null)}
        />
        {categories.map((c) => (
          <Chip
            key={c}
            label={c}
            color={active === c ? "primary" : "default"}
            sx={{}}
            onClick={() => setActive(c)}
          />
        ))}
        <Box sx={{ flex: 1 }} />
        <ToggleButtonGroup
          value={sort}
          exclusive
          onChange={(_, v) => v && setSort(v)}
        >
          <ToggleButton value="relevance">Relevância</ToggleButton>
          <ToggleButton value="price_asc">Menor preço</ToggleButton>
          <ToggleButton value="price_desc">Maior preço</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={2}>
        {filtered.map((product: ProductType) => (
          <Grid key={product.id} size={2}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

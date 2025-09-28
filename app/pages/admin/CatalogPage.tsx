import { CatalogProvider } from "../contexts/CatalogContext";
import ProductTable from "../components/ProductTable";
import { Card, CardContent, Typography } from "@mui/material";

export default function CatalogPage() {
  return (
    <CatalogProvider>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Catálogo de Produtos
          </Typography>
          <ProductTable />
        </CardContent>
      </Card>
    </CatalogProvider>
  );
}

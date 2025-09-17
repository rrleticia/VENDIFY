import { products } from "@common/mocks";
import { Box, Grid, Typography, Button, Paper } from "@mui/material";
import { useParams } from "react-router";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const product = products.find((p) => String(p.id) === String(id));

  if (!product) return <Typography>Produto não encontrado.</Typography>;

  return (
    <Grid container spacing={3}>
      <Grid sx={{ xs: 12, md: 6 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            sx={{ width: "100%", borderRadius: 2 }}
          />
        </Paper>
      </Grid>
      <Grid sx={{ xs: 12, md: 6 }}>
        <Typography variant="h4" fontWeight={800}>
          {product.name}
        </Typography>
        <Typography color="text.secondary" mt={1}>
          {product.category}
        </Typography>
        <Typography variant="h5" mt={2}>
          {product.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Typography>
        <Typography mt={2}>{product.description}</Typography>
        <Button
          onClick={() => {}}
          variant="contained"
          size="large"
          sx={{ mt: 3 }}
        >
          Adicionar ao carrinho
        </Button>
      </Grid>
    </Grid>
  );
}

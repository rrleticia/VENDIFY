import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import { Link } from "react-router";
import type { ProductType } from "@common/types/ProductType";

export default function ProductCard({ product }: { product: ProductType }) {
  const addItem = (product: any) => {};

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 1,
        elevation: 0,
        transition: "transform 0.2s ease-in-out",
        "&:hover": { transform: "scale(1.015)" },
      }}
      variant="outlined"
    >
      <CardMedia
        component="img"
        image={product.image}
        title={product.name}
        sx={{
          height: 180,
          objectFit: "cover",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      />
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom noWrap>
          {product.name}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
          gutterBottom
        >
          {product.category}
        </Typography>
        <Typography variant="h6" mt={1}>
          {product.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Typography>
      </CardContent>
      <CardActions
        disableSpacing
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          p: 2,
          pt: 0,
          gap: 1,
        }}
      >
        <Button
          component={Link}
          to={`/product/${product.id}`}
          variant="outlined"
          size="small"
          fullWidth
          disableRipple
          sx={{ m: 0 }} // <- elimina margem
        >
          Detalhes
        </Button>
        <Button
          onClick={() => addItem(product)}
          variant="contained"
          size="medium"
          fullWidth
          disableElevation
          sx={{ m: 0 }} // <- elimina margem
        >
          Comprar
        </Button>
      </CardActions>
    </Card>
  );
}

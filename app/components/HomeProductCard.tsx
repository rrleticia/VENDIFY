import type { ProductType } from "@common/types";
import { formatBRL } from "@common/util";
import {
  Card,
  Box,
  Chip,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  Rating,
  CardActions,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

interface IHomeProductCardProps {
  product: ProductType;
}

export default function HomeProductCard({ product }: IHomeProductCardProps) {
  const rating = product.rating ?? 0;
  return (
    <Card
      sx={{
        borderRadius: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ position: "relative" }}>
        {product.badge && (
          <Chip
            size="small"
            color={
              product.badge === "Promo"
                ? "error"
                : product.badge === "Novo"
                  ? "primary"
                  : "success"
            }
            label={product.badge}
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              zIndex: 1,
              borderRadius: 1.5,
            }}
          />
        )}
        <CardMedia
          component="img"
          src={product.image}
          alt={product.name}
          sx={{ height: 210, objectFit: "cover", width: 275 }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography noWrap fontWeight={700}>
          {product.name}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
          <Rating name="read-only" value={rating} readOnly size="small" />
          <Typography variant="caption" color="text.secondary">
            {rating.toFixed(1)}
          </Typography>
        </Stack>
        <Typography sx={{ mt: 1.5 }} variant="h6">
          {formatBRL(product.price)}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          component={RouterLink}
          to={`/product/${product.id}`}
          endIcon={<ArrowForwardRoundedIcon />}
        >
          Ver produto
        </Button>
      </CardActions>
    </Card>
  );
}

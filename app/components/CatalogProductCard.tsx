import type { ProductType } from "@common/types";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import { Link } from "react-router";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";

type Props = {
  product: ProductType;
  onAddToCart?: (product: ProductType) => void;
};

export default function CartalogProductCard({ product, onAddToCart }: Props) {
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
          {product.categoryId}
        </Typography>

        {/* Informações específicas para ebooks */}
        {product.isDigital && (
          <Stack direction="row" gap={1} sx={{ mb: 1 }}>
            <Chip
              icon={<MenuBookRoundedIcon fontSize="small" />}
              label="E-book"
              size="small"
              color="primary"
              variant="outlined"
            />
            {product.fileFormat && (
              <Chip
                label={product.fileFormat}
                size="small"
                variant="outlined"
              />
            )}
          </Stack>
        )}

        {/* Informações adicionais para ebooks */}
        {product.isDigital && (
          <Stack direction="row" gap={1} sx={{ mb: 1 }}>
            {product.pages && (
              <Typography variant="caption" color="text.secondary">
                {product.pages} páginas
              </Typography>
            )}
            {product.fileSize && (
              <Typography variant="caption" color="text.secondary">
                • {product.fileSize}
              </Typography>
            )}
          </Stack>
        )}

        <Typography variant="h6" mt={1}>
          {product.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Typography>

        {!!product.tags?.length && (
          <Stack
            direction="row"
            spacing={0.5}
            useFlexGap
            flexWrap="wrap"
            sx={{ mt: 1 }}
          >
            {product.tags.map((t) => (
              <Chip key={t} size="small" label={t} variant="outlined" />
            ))}
          </Stack>
        )}
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
          sx={{ m: 0 }}
        >
          Detalhes
        </Button>
        <Button
          onClick={() => onAddToCart?.(product)}
          variant="contained"
          size="medium"
          fullWidth
          disableElevation
          sx={{ m: 0 }}
          startIcon={product.isDigital ? <DownloadRoundedIcon /> : undefined}
        >
          {product.isDigital ? "Comprar E-book" : "Comprar"}
        </Button>
      </CardActions>
    </Card>
  );
}

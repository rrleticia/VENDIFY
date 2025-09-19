// src/routes/ProductDetails.tsx (ou onde sua página estiver)
import { useEffect } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router";
import {
  Box,
  Grid,
  Typography,
  Button,
  Paper,
  Stack,
  Divider,
  Alert,
  Chip,
  Breadcrumbs,
  Link as MLink,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  TextField,
  CircularProgress,
  Rating,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import PixRoundedIcon from "@mui/icons-material/PixRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import ProductCard from "../../components/Pages/ProductCard";
import type { ShippingMethodId } from "@app/services/api/ProductService";
import {
  useProductDetails,
  ProductDetailsProvider,
} from "@common/contexts/ProductDetailsContext";

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function ProductDetailsView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { state, loadById, updateCep, selectShipping, calcFreight, total } =
    useProductDetails();

  useEffect(() => {
    if (id) void loadById(id);
  }, [id, loadById]);

  const product = state.product;
  const stock = product?.stock ?? 12;
  const paymentMethods = product?.paymentMethods ?? ["PIX", "Cartão"];

  const shippingOptions = product?.shippingOptions ?? [
    { id: "pickup", label: "Retirada no local", icon: "store" as const },
    { id: "correios", label: "Correios", icon: "truck" as const },
    { id: "carrier", label: "Transportadora", icon: "truck" as const },
  ];

  const categoryPath = product?.category ? [product.category] : [];
  const related = state.related ?? [];

  const isOutOfStock = (stock ?? 0) <= 0;
  const isLowStock = !isOutOfStock && (stock ?? 0) <= 5;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Button
          variant="text"
          startIcon={<ArrowBackIosNewRoundedIcon />}
          onClick={() => navigate(-1)}
        >
          Voltar
        </Button>

        <Breadcrumbs aria-label="breadcrumb">
          <MLink component={Link} to="/" underline="hover" color="inherit">
            Início
          </MLink>
          <MLink
            component={Link}
            to="/catalog"
            underline="hover"
            color="inherit"
          >
            Catálogo
          </MLink>
          {categoryPath.map((c) => (
            <MLink
              key={c}
              component={Link}
              to={`/catalog?category=${encodeURIComponent(c)}`}
              underline="hover"
              color="inherit"
            >
              {c}
            </MLink>
          ))}
          <Typography color="text.primary">{product?.name}</Typography>
        </Breadcrumbs>
      </Stack>

      <Grid container spacing={4}>
        {/* Imagem */}
        <Grid sx={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Box
              component="img"
              src={product?.image}
              alt={product?.name}
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: 2,
                objectFit: "cover",
                aspectRatio: "1 / 1",
              }}
            />
          </Paper>
        </Grid>

        {/* Detalhes */}
        <Grid sx={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800} lineHeight={1.2}>
              {product?.name}
            </Typography>

            {/* Avaliação */}
            {typeof product?.rating === "number" && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mt: 0.5 }}
              >
                <Rating value={product?.rating} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary">
                  {product?.rating?.toFixed(1)}
                  {product?.ratingsCount ? ` (${product.ratingsCount})` : ""}
                </Typography>
              </Stack>
            )}

            <Typography variant="subtitle1" color="text.secondary">
              {product?.category}
            </Typography>

            {!!product?.tags?.length && (
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {product?.tags.map((t) => (
                  <Chip key={t} size="small" label={t} variant="outlined" />
                ))}
              </Stack>
            )}

            {isOutOfStock ? (
              <Alert severity="error" variant="outlined">
                Produto esgotado no momento.
              </Alert>
            ) : isLowStock ? (
              <Alert severity="warning" variant="outlined">
                Restam apenas <b>{stock}</b> unidade{stock > 1 ? "s" : ""}!
              </Alert>
            ) : (
              <Chip
                size="small"
                color="success"
                label={`Em estoque: ${stock}+`}
              />
            )}

            <Divider />

            <Typography variant="h5" color="primary" fontWeight={700}>
              {formatBRL(product?.price ?? 0)}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              {product?.description}
            </Typography>

            {/* Pagamento */}
            <Stack spacing={1} sx={{ mt: 1 }}>
              <Typography variant="subtitle2">Formas de pagamento</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {paymentMethods.includes("PIX") && (
                  <Chip
                    icon={<PixRoundedIcon />}
                    label="PIX"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                )}
                {paymentMethods.some((m: string) =>
                  m.toLowerCase().includes("cart")
                ) && (
                  <Chip
                    icon={<CreditCardRoundedIcon />}
                    label="Cartões"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Stack>
            </Stack>

            {/* CEP + Frete */}
            <Divider />
            <Stack spacing={1}>
              <Typography variant="subtitle2">Calcular frete</Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <TextField
                  label="CEP"
                  placeholder="00000-000"
                  value={state.cep}
                  onChange={(e) => updateCep(e.target.value)}
                  inputProps={{ inputMode: "numeric", maxLength: 9 }}
                  sx={{ flex: 1 }}
                />
                <Button
                  onClick={calcFreight}
                  variant="outlined"
                  disabled={state.freteLoading}
                >
                  {state.freteLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    "Calcular"
                  )}
                </Button>
              </Stack>

              <FormLabel id="shipping-label">Opções de entrega</FormLabel>
              <RadioGroup
                aria-labelledby="shipping-label"
                value={state.shipping}
                onChange={(e) =>
                  selectShipping(e.target.value as ShippingMethodId)
                }
              >
                <Stack spacing={1}>
                  {shippingOptions.map((opt) => {
                    const calc = state.fretes[opt.id as ShippingMethodId];
                    const price =
                      calc?.price ?? (opt.id === "pickup" ? 0 : undefined);
                    const eta =
                      calc?.eta ?? (opt.id === "pickup" ? "Imediata" : "—");
                    return (
                      <FormControlLabel
                        key={opt.id}
                        value={opt.id}
                        control={<Radio />}
                        label={
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            {opt.icon === "store" ? (
                              <StorefrontRoundedIcon fontSize="small" />
                            ) : (
                              <LocalShippingRoundedIcon fontSize="small" />
                            )}
                            <Typography variant="body2">
                              <b>{opt.label}</b>
                              {" — "}
                              {price !== undefined
                                ? formatBRL(price)
                                : "calcule o frete"}
                              {" • "}
                              {eta}
                            </Typography>
                          </Stack>
                        }
                      />
                    );
                  })}
                </Stack>
              </RadioGroup>
            </Stack>

            <Divider />

            {/* Total */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle1" color="text.secondary">
                Total
              </Typography>
              <Typography variant="h6" fontWeight={800}>
                {formatBRL(total)}
              </Typography>
            </Stack>

            {/* Ações */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                disabled={isOutOfStock}
                onClick={() => {
                  // TODO: integrar com CartContext/Service
                  // addToCart(product!.id, 1, { shipping: state.shipping, cep: state.cep, freight: state.fretes[state.shipping] })
                }}
              >
                Adicionar ao carrinho
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/catalog"
              >
                Voltar ao catálogo
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      {/* Relacionados */}
      {!!related.length && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
            Produtos relacionados
          </Typography>
          <Grid container spacing={2}>
            {related.map((p) => (
              <Grid key={p.id} sx={{ xs: 12, sm: 6, md: 3 }}>
                <ProductCard product={p} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}

export default function ProductDetailsPage() {
  return (
    <ProductDetailsProvider>
      <ProductDetailsView />
    </ProductDetailsProvider>
  );
}

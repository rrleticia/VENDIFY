// ProductDetailsPage.tsx
import { categories } from "@common/mocks";
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
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import PixRoundedIcon from "@mui/icons-material/PixRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import { useParams, Link, useNavigate, Navigate } from "react-router";
import { useEffect, useMemo, useState } from "react";

import type { ShippingMethodId } from "@common/types";
import { useProductDetails } from "@common/contexts";
import CatalogProductCard from "@components/CatalogProductCard";
import type { ShippingOption } from "@app/services/api/types";

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ProductDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { state, loadById, updateCep, selectShipping, calcFreight, total } =
    useProductDetails();

  const [calcTouched, setCalcTouched] = useState(false);

  useEffect(() => {
    if (id) void loadById(id);
  }, [id, loadById]);

  const product = state.product;
  const related = state.related ?? [];
  const shipping = state.shipping as string;
  const fretes = state.fretes as Record<
    string,
    { price: number; etaDays?: number; eta?: string }
  >;
  const freteLoading = state.freteLoading;

  const stock = product?.stock ?? 12;
  const paymentMethods = product?.paymentMethods ?? ["PIX", "Cartão"];
  const DEFAULT_OPTIONS: ShippingOption[] = [
    { id: "pickup", label: "Retirada no local", icon: "store" },
    { id: "correios", label: "Correios", icon: "truck" },
    { id: "carrier", label: "Transportadora", icon: "truck" },
  ];
  const shippingOptions = (
    product?.shippingOptions?.length ? product.shippingOptions : DEFAULT_OPTIONS
  ) as ShippingOption[];

  const isOutOfStock = stock <= 0;
  const isLowStock = !isOutOfStock && stock <= 5;

  const categoryPath = useMemo(() => { const c = categories.find(x=>x.id===product?.categoryId); return c? [c.name] : []; }, [product?.categoryId]);

  const relatedList = useMemo(() => {
    if (!product?.category) return [];
    return related
      .filter(
        (p) =>
          p.category === product.category && String(p.id) !== String(product.id)
      )
      .slice(0, 8);
  }, [product, related]);

  const totalValue = total ?? product?.price ?? 0;

  const handleCalcFrete = async () => {
    setCalcTouched(true);
    if (state.cep.replace(/\D/g, "").length !== 8) return;
    await calcFreight();
  };

  useEffect(() => {
    if (
      calcTouched &&
      state.cep.replace(/\D/g, "").length === 8 &&
      Object.keys(fretes ?? {}).length === 0
    ) {
      void handleCalcFrete();
    }
  }, [shipping]);

  const notFound = !state.loading && !product;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {notFound ? (
        <Navigate to="/not-found" replace />
      ) : (
        <>
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
              <Typography color="text.primary">
                {product?.name ?? "Carregando..."}
              </Typography>
            </Breadcrumbs>
          </Stack>

          <Grid container spacing={4}>
            {/* Imagem */}
            <Grid sx={{ xs: 12, md: 6, maxWidth: "50%" }}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Box
                  component="img"
                  src={product?.image}
                  alt={product?.name ?? "Produto"}
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
                  {product?.name ?? "Carregando..."}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {product?.category ?? "—"}
                </Typography>

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
                  {product?.description ?? ""}
                </Typography>

                {/* Pagamento */}
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Typography variant="subtitle2">
                    Formas de pagamento
                  </Typography>
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
                      onClick={handleCalcFrete}
                      variant="outlined"
                      disabled={freteLoading}
                    >
                      {freteLoading ? (
                        <CircularProgress size={20} />
                      ) : (
                        "Calcular"
                      )}
                    </Button>
                  </Stack>

                  <FormLabel id="shipping-label">Opções de entrega</FormLabel>
                  <RadioGroup
                    aria-labelledby="shipping-label"
                    value={shipping}
                    onChange={(e) =>
                      selectShipping(e.target.value as ShippingMethodId)
                    }
                  >
                    <Stack spacing={1}>
                      {shippingOptions.map((opt) => {
                        const calc = fretes?.[opt.id];
                        const price =
                          calc?.price ?? (opt.id === "pickup" ? 0 : undefined);
                        const eta =
                          (calc?.eta as string) ??
                          (calc?.etaDays != null
                            ? `${calc.etaDays} dia(s)`
                            : opt.id === "pickup"
                              ? "Imediata"
                              : "—");
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
                    {formatBRL(totalValue)}
                  </Typography>
                </Stack>

                {/* Ações */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    disabled={isOutOfStock}
                    onClick={() => {
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

          {/* --------- RELACIONADOS --------- */}
          {relatedList.length > 0 && (
            <Box sx={{ mt: 6 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                Produtos relacionados
              </Typography>
              <Grid container spacing={2}>
                {relatedList.map((p) => (
                  <Grid key={p.id} sx={{ xs: 12, sm: 6, md: 3 }}>
                    <CatalogProductCard product={p} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

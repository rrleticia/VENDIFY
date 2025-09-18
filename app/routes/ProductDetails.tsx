import { products } from "@common/mocks";
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

import ProductCard from "../components/ProductCard";

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ------- MOCK de cálculo de frete -------
// Regras simples: base por método + fator por região do CEP (1º dígito)
// pickup = 0; correios = 18–42; carrier = 25–55
async function mockCalcFrete(cep: string, methodId: string) {
  // Simula latência de rede
  await new Promise((r) => setTimeout(r, 600));

  const first = Number(cep[0] || 9);
  const regionFactor =
    [1.0, 1.05, 1.08, 1.1, 1.12, 1.15, 1.18, 1.2, 1.25, 1.3][first] ?? 1.22;

  if (methodId === "pickup") {
    return { price: 0, eta: "Imediata" };
  }
  if (methodId === "correios") {
    const base = 18 + (first % 5) * 6; // 18–42
    return { price: Math.round(base * regionFactor), eta: "3–7 dias úteis" };
  }
  // carrier
  const base = 25 + (first % 6) * 5; // 25–55
  return { price: Math.round(base * regionFactor), eta: "2–5 dias úteis" };
}

// ------- Hook/ganchos para “real depois” -------
// Substitua por ViaCEP + Correios/transportadora reais.
// Ex.: buscar endereço com ViaCEP, faixa de CEP x tabela de frete do lojista, etc.
async function realCalcFreteFuturo(cep: string, methodId: string) {
  // TODO integrar com API real
  return mockCalcFrete(cep, methodId);
}

export default function ProductDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const product = products.find((p) => String(p.id) === String(id));

  const stock = product?.stock ?? 12;
  const paymentMethods = product?.paymentMethods ?? ["PIX", "Cartão"];
  const shippingOptions = product?.shippingOptions ?? [
    { id: "pickup", label: "Retirada no local", icon: "store" as const },
    { id: "correios", label: "Correios", icon: "truck" as const },
    { id: "carrier", label: "Transportadora", icon: "truck" as const },
  ];

  const [shipping, setShipping] = useState<string>(
    shippingOptions[0]?.id ?? "pickup"
  );
  const [cep, setCep] = useState<string>("");
  const [freteLoading, setFreteLoading] = useState(false);
  const [fretes, setFretes] = useState<
    Record<string, { price: number; eta: string }>
  >({});
  const [calcTouched, setCalcTouched] = useState(false);

  const isOutOfStock = stock <= 0;
  const isLowStock = !isOutOfStock && stock <= 5;

  const categoryPath = useMemo(
    () => (product?.category ? [product.category] : []),
    [product?.category]
  );

  // Produtos relacionados (mesma categoria, exclui o atual)
  const related = useMemo(() => {
    if (!product?.category) return [];
    return products
      .filter(
        (p) =>
          p.category === product.category && String(p.id) !== String(product.id)
      )
      .slice(0, 8);
  }, [product]);

  const total = useMemo(() => {
    const freteSel = fretes[shipping]?.price ?? 0;
    return (product?.price ?? 0) + freteSel;
  }, [fretes, shipping, product?.price]);

  if (!product) return <Navigate to="/not-found" replace />;

  const handleCalcFrete = async () => {
    setCalcTouched(true);
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return; // CEP inválido
    setFreteLoading(true);
    try {
      const results: Record<string, { price: number; eta: string }> = {};
      for (const opt of shippingOptions) {
        // Trocar para realCalcFreteFuturo quando integrar a API real
        results[opt.id] = await mockCalcFrete(clean, opt.id);
      }
      setFretes(results);
    } finally {
      setFreteLoading(false);
    }
  };

  // Recalcula automaticamente quando trocar o método (se já tiver frete calculado)
  useEffect(() => {
    if (
      calcTouched &&
      cep.replace(/\D/g, "").length === 8 &&
      Object.keys(fretes).length === 0
    ) {
      handleCalcFrete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipping]);

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
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>
      </Stack>

      <Grid container spacing={4}>
        {/* Imagem */}
        <Grid sx={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Box
              component="img"
              src={product.image}
              alt={product.name}
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
              {product.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {product.category}
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
              {formatBRL(product.price)}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              {product.description}
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
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  inputProps={{ inputMode: "numeric", maxLength: 9 }}
                  sx={{ flex: 1 }}
                />
                <Button
                  onClick={handleCalcFrete}
                  variant="outlined"
                  disabled={freteLoading}
                >
                  {freteLoading ? <CircularProgress size={20} /> : "Calcular"}
                </Button>
              </Stack>

              <FormLabel id="shipping-label">Opções de entrega</FormLabel>
              <RadioGroup
                aria-labelledby="shipping-label"
                value={shipping}
                onChange={(e) => setShipping(e.target.value)}
              >
                <Stack spacing={1}>
                  {shippingOptions.map((opt) => {
                    const calc = fretes[opt.id];
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
                  // TODO: integrar com carrinho (context/Redux/zustand)
                  // addToCart(product.id, 1, { shipping, cep, freight: fretes[shipping] })
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
      {related.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
            Produtos relacionados
          </Typography>
          <Grid container spacing={2}>
            {related.map((p) => (
              <Grid key={p.id} sx={{ xs: 12, sm: 6, md: 3 }}>
                {/* Se já existe ProductCard no projeto, reutiliza: */}
                <ProductCard product={p} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}

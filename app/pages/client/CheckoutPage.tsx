// src/routes/CheckoutPage.tsx
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51S8ruPK5Bj6WctFELhsFKizat0yWqknDy36ox9Op8qyFPgmszYX8jA7Qnvb6nalH6mgDjwUthN4dGRGwp5r082yd00aUOTpb4L");

import { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Divider,
  TextField,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Chip,
  Alert,
  Snackbar,
} from "@mui/material";
import PixRoundedIcon from "@mui/icons-material/PixRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import DiscountRoundedIcon from "@mui/icons-material/DiscountRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { useNavigate } from "react-router";
import { useCart } from "@common/contexts";
import FreteCalculator from "@components/FreteCalculator";

type PaymentKind = "pix" | "card";

function money(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function CardPaymentForm({ total, onSuccess }: { total: number; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const res = await fetch("http://localhost:4242/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total, method: "card" }),
    });
    const { client_secret } = await res.json();

    const result = await stripe.confirmCardPayment(client_secret, {
      payment_method: { card: elements.getElement(CardElement)! },
    });

    if (result.error) {
      alert(result.error.message);
    } 
    else if (result.paymentIntent?.status === "succeeded") {
    onSuccess();
    navigate("/checkout/success", {
      state: {
        total,
        payment: "card",
        shipping: "correios", 
        orderId: `#${Date.now()}`,
        hasDigitalProducts: false, 
        digitalItems: [],
      },
      replace: true,
    });
  }

  };

  return (
  <form onSubmit={handleSubmit}>
    <CardElement
      options={{
        style: { base: { fontSize: "16px" } },
        hidePostalCode: true
      }}
    />
    <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
      Pagar com cartão
    </Button>
  </form>
);
}


export default function CheckoutPage() {

  const navigate = useNavigate();
  const { estado, subtotal, clear } = useCart();

  const [name, setName] = useState("Letícia Andrade");
  const [cep, setZip] = useState("58400-000");
  const [street, setStreet] = useState("Rua das Flores, 123");
  const [cidade, setCity] = useState("Campina Grande");
  const [stateUF, setStateUF] = useState("PB");

  const [payment, setPayment] = useState<PaymentKind>("pix");

  const [freteSelecionado, setFreteSelecionado] = useState<{
    valor: number;
    prazo: number;
    nome: string;
  } | null>(null);

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const [snack, setSnack] = useState<{
    open: boolean;
    msg: string;
    sev: "success" | "info" | "warning" | "error";
  }>({ open: false, msg: "", sev: "success" });

  const items = estado.items;

  const hasOnlyDigitalProducts = items.length > 0 && items.every(item => item.product.isDigital);
  const hasPhysicalProducts = items.some(item => !item.product.isDigital);
  const hasMixedProducts = items.some(item => item.product.isDigital) && hasPhysicalProducts;

  const shippingCost = useMemo(() => {
    if (hasOnlyDigitalProducts) return 0;

    if (freteSelecionado) return freteSelecionado.valor;

    return 0;
  }, [hasOnlyDigitalProducts, freteSelecionado]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon === "CUPOM10") return Math.min(subtotal * 0.1, 50);
    if (appliedCoupon === "FRETEGRATIS") return shippingCost;
    return 0;
  }, [appliedCoupon, subtotal, shippingCost]);

  const total = useMemo(
    () => Math.max(0, subtotal + shippingCost - discount),
    [subtotal, shippingCost, discount]
  );

  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    if (!["CUPOM10", "FRETEGRATIS"].includes(code)) {
      setSnack({ open: true, msg: "Cupom inválido.", sev: "error" });
      return;
    }
    setAppliedCoupon(code);
    setSnack({ open: true, msg: `Cupom ${code} aplicado.`, sev: "success" });
  }
  function clearCoupon() {
    setAppliedCoupon(null);
    setCoupon("");
  }

  async function confirmOrder() {
    if (hasPhysicalProducts && (!name || !cep || !street || !cidade || !stateUF)) {
      setSnack({
        open: true,
        msg: "Preencha o endereço completo para produtos físicos.",
        sev: "error",
      });
      return;
    }
    if (items.length === 0) {
      setSnack({ open: true, msg: "Carrinho vazio.", sev: "warning" });
      return;
    }
    await clear();
    navigate("/checkout/success", {
      replace: true,
      state: { 
        total, 
        payment, 
        shipping: hasOnlyDigitalProducts ? "digital" : (freteSelecionado?.nome || "correios"), 
        orderId: `#${Date.now()}`,
        hasDigitalProducts: hasOnlyDigitalProducts || hasMixedProducts,
        digitalItems: items.filter(item => item.product.isDigital)
      },
    });
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
      {/* topo */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <ArrowBackIosNewRoundedIcon fontSize="small" />
          <Typography
            variant="body2"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(-1)}
          >
            Voltar
          </Typography>
        </Stack>
        <Typography variant="h6" fontWeight={800}>
          Finalizar compra
        </Typography>
        <Box />
      </Stack>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          {/* Endereço - só mostra se há produtos físicos */}
          {hasPhysicalProducts && (
            <Paper
              variant="outlined"
              sx={{ p: 2, borderRadius: 3, mb: 2, width: 1 }}
            >
              <Typography variant="subtitle1" fontWeight={800}>
                Endereço de entrega
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Nome completo"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    label="CEP"
                    fullWidth
                    value={cep}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Endereço"
                    fullWidth
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <TextField
                    label="Cidade"
                    fullWidth
                    value={cidade}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <TextField
                    label="UF"
                    fullWidth
                    value={stateUF}
                    onChange={(e) => setStateUF(e.target.value.toUpperCase())}
                  />
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Entrega - Calculador de Frete */}
          {!hasOnlyDigitalProducts && (
            <FreteCalculator
              temProdutosFisicos={!hasOnlyDigitalProducts}
              onFreteSelect={setFreteSelecionado}
              cepInicial={cep}
              onEnderecoChange={(endereco) => {
                if (endereco) {
                  setStreet(endereco.logradouro || street);
                  setCity(endereco.localidade || cidade);
                  setStateUF(endereco.uf || stateUF);
                }
              }}
            />
          )}

          {/* Informação sobre produtos digitais */}
          {hasOnlyDigitalProducts && (
            <Paper
              variant="outlined"
              sx={{ p: 2, borderRadius: 3, mb: 2, width: 1 }}
            >
              <Typography variant="subtitle1" fontWeight={800}>
                Entrega digital
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Stack direction="row" alignItems="center" gap={2}>
                <DownloadRoundedIcon color="primary" />
                <Box>
                  <Typography variant="body2" fontWeight={700}>
                    Download imediato
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Seus e-books ficarão disponíveis após confirmação do pagamento
                  </Typography>
                </Box>
                <Typography variant="body2" color="success.main" fontWeight={700}>
                  Grátis
                </Typography>
              </Stack>
            </Paper>
          )}

          {/* Aviso para produtos mistos */}
          {hasMixedProducts && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Seu carrinho contém produtos físicos e digitais. Os e-books estarão disponíveis imediatamente após o pagamento, enquanto os produtos físicos seguirão o prazo de entrega selecionado.
            </Alert>
          )}

          {/* Pagamento */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, width: 1 }}>
            <Typography variant="subtitle1" fontWeight={800}>
              Pagamento
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <RadioGroup
              value={payment}
              onChange={(_, v) => setPayment(v as PaymentKind)}
            >
              <FormControlLabel
                value="pix"
                control={<Radio />}
                label={
                  <Row
                    icon={<PixRoundedIcon />}
                    title="PIX"
                    subtitle="Confirmação imediata com QR Code"
                  />
                }
              />
              <FormControlLabel
                value="card"
                control={<Radio />}
                label={
                  <Row
                    icon={<CreditCardRoundedIcon />}
                    title="Cartão de crédito"
                    subtitle="Visa, Mastercard, Elo, Amex"
                  />
                }
              />
            </RadioGroup>
            {payment === "pix" ? (
              <Alert sx={{ mt: 1 }} severity="info" variant="outlined">
                O QR Code será exibido após confirmar o pedido.
              </Alert>
            ) : (
              <Elements stripe={stripePromise}>
                <CardPaymentForm 
                  total={total} 
                  onSuccess={async () => await clear()} 
                />
              </Elements>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            variant="outlined"
            sx={{ p: 2, borderRadius: 3, mb: 2, width: 1 }}
          >
            <Typography variant="subtitle1" fontWeight={800}>
              Resumo do pedido
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Stack gap={1.25} sx={{ mb: 1 }}>
              {items.map((it, idx) => (
                <Stack
                  key={`${it.product.id}-${idx}`}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={1}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap={1.25}
                    sx={{ minWidth: 0 }}
                  >
                    {it.product.image ? (
                      <Box
                        component="img"
                        src={it.product.image}
                        alt={it.product.name}
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 1,
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 1,
                          bgcolor: "action.hover",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        noWrap
                        title={it.product.name}
                      >
                        {it.product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        qnt. {it.qty} × {money(it.product.price)}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography variant="body2">{money(it.lineTotal)}</Typography>
                </Stack>
              ))}
            </Stack>

            <Divider sx={{ my: 1.5 }} />

            {/* Cupom */}
            <Stack direction="row" gap={1} alignItems="center" sx={{ mb: 1 }}>
              <DiscountRoundedIcon fontSize="small" />
              <Typography variant="body2" fontWeight={700}>
                Cupom
              </Typography>
            </Stack>
            {appliedCoupon ? (
              <Chip
                color="success"
                variant="outlined"
                size="small"
                label={`Aplicado: ${appliedCoupon}`}
                onDelete={clearCoupon}
                deleteIcon={<CloseRoundedIcon />}
                sx={{ mb: 1 }}
              />
            ) : (
              <Stack direction="row" gap={1} sx={{ mb: 1 }}>
                <TextField
                  size="small"
                  placeholder="CUPOM10 ou FRETEGRATIS"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  fullWidth
                />
                <Button variant="outlined" onClick={applyCoupon}>
                  Aplicar
                </Button>
              </Stack>
            )}

            {/* Totais */}
            <Stack gap={0.75} sx={{ my: 1 }}>
              <RowTotal label="Subtotal" value={money(subtotal)} />
              <RowTotal
                label="Entrega"
                value={shippingCost === 0 ? "Grátis" : money(shippingCost)}
              />
              {discount > 0 && (
                <RowTotal
                  label="Desconto"
                  value={`- ${money(discount)}`}
                  muted
                />
              )}
              <Divider sx={{ my: 1 }} />
              <RowTotal label="Total" value={money(total)} strong />
            </Stack>

            <Button
              fullWidth
              size="large"
              variant="contained"
              sx={{ borderRadius: 999, mt: 1.5 }}
              onClick={confirmOrder}
            >
              Confirmar pedido
            </Button>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.75, textAlign: "center" }}
            >
              Ao confirmar, você concorda com os Termos e Condições.
            </Typography>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, width: 1 }}>
            <Typography variant="subtitle1" fontWeight={800}>
              Dúvidas?
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="body2" color="text.secondary">
              O prazo de entrega é estimado e pode variar. Pagamentos via PIX
              têm aprovação imediata.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snack.open}
        autoHideDuration={2200}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snack.sev}
          variant="filled"
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function Row({
  icon,
  title,
  subtitle,
  price,
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  price?: string;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: 1 }}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        {icon}
        <Box>
          <Typography variant="body2" fontWeight={700}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Box>
      </Stack>
      {price ? <Typography variant="body2">{price}</Typography> : null}
    </Stack>
  );
}
function RowTotal({
  label,
  value,
  strong,
  muted,
}: {
  label: string;
  value: string;
  strong?: boolean;
  muted?: boolean;
}) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant="body2" color={muted ? "text.secondary" : undefined}>
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={strong ? 800 : 600}>
        {value}
      </Typography>
    </Stack>
  );
}

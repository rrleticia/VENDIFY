// src/routes/CheckoutPage.tsx
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
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import PixRoundedIcon from "@mui/icons-material/PixRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import DiscountRoundedIcon from "@mui/icons-material/DiscountRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useNavigate } from "react-router";
import { useCart } from "@common/contexts";
import { useOrders } from "@common/contexts";
import { createOrder } from "@services/api/OrdersService";

type ShippingKind = "pickup" | "pac" | "sedex";
type PaymentKind = "pix" | "card";

function money(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { state, subtotal, clear } = useCart();

  // endereço
  const [name, setName] = useState("Letícia Andrade");
  const [zip, setZip] = useState("58400-000");
  const [street, setStreet] = useState("Rua das Flores, 123");
  const [city, setCity] = useState("Campina Grande");
  const [stateUF, setStateUF] = useState("PB");

  // entrega & pagamento
  const [shipping, setShipping] = useState<ShippingKind>("pac");
  const [payment, setPayment] = useState<PaymentKind>("pix");

  // cupom
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // feedback
  const [snack, setSnack] = useState<{
    open: boolean;
    msg: string;
    sev: "success" | "info" | "warning" | "error";
  }>({ open: false, msg: "", sev: "success" });

  const items = state.items;

  const shippingCost = useMemo(() => {
    if (shipping === "pickup") return 0;
    if (shipping === "pac") return subtotal > 200 ? 0 : 19.9;
    return 34.9; // sedex
  }, [shipping, subtotal]);

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

  const { refresh: refreshOrders } = useOrders();

  async function confirmOrder() {
    if (!name || !zip || !street || !city || !stateUF) {
      setSnack({
        open: true,
        msg: "Preencha o endereço completo.",
        sev: "error",
      });
      return;
    }
    if (items.length === 0) {
      setSnack({ open: true, msg: "Carrinho vazio.", sev: "warning" });
      return;
    }
    // cria pedido no "backend" de mock
    const created = await createOrder({
        items: state.items.map((it: any) => ({
        id: it.product.id,
        name: it.product.name,
        image: it.product.image,
        price: it.product.price,
        qty: it.qty,
        ...(it.product?.isDigital ? { downloadUrl: it.product.downloadUrl } : {}),
      })),
      address: {
        name,
        line1: street,
        city,
        state: stateUF,
        zip,
      },
      payment: { method: payment.toUpperCase() as any },
      shipment: { method: shipping === "pickup" ? "Retirada" : "Correios" },
      subtotal,
      shipping: shippingCost,
      discount,
      total,
    });

    // limpa carrinho local
    await clear();
    // atualiza OrdersContext para refletir novo pedido
    try {
      await refreshOrders();
    } catch {
      /* não crítico */
    }

    navigate("/checkout/success", {
      replace: true,
      state: { total, payment, shipping, orderId: created.id, items: created.items },
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
          {/* Endereço */}
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
                  value={zip}
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
                  value={city}
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

          {/* Entrega */}
          <Paper
            variant="outlined"
            sx={{ p: 2, borderRadius: 3, mb: 2, width: 1 }}
          >
            <Typography variant="subtitle1" fontWeight={800}>
              Forma de entrega
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <RadioGroup
              value={shipping}
              onChange={(_, v) => setShipping(v as ShippingKind)}
              sx={{ "& .MuiFormControlLabel-root": { m: 0, mb: 1.25 } }}
            >
              <FormControlLabel
                value="pickup"
                control={<Radio />}
                label={
                  <Row
                    icon={<StorefrontRoundedIcon />}
                    title="Retirar na loja"
                    subtitle="Pronto em até 2h"
                    price="Grátis"
                  />
                }
              />
              <FormControlLabel
                value="pac"
                control={<Radio />}
                label={
                  <Row
                    icon={<LocalShippingRoundedIcon />}
                    title="Correios - PAC"
                    subtitle="5–8 dias úteis"
                    price={subtotal > 200 ? "Grátis" : money(19.9)}
                  />
                }
              />
              <FormControlLabel
                value="sedex"
                control={<Radio />}
                label={
                  <Row
                    icon={<LocalShippingRoundedIcon />}
                    title="Correios - SEDEX"
                    subtitle="2–3 dias úteis"
                    price={money(34.9)}
                  />
                }
              />
            </RadioGroup>
          </Paper>

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
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField label="Número do cartão (mock)" fullWidth />
                </Grid>
                <Grid size={{ xs: 6, md: 2 }}>
                  <TextField label="Validade" placeholder="MM/AA" fullWidth />
                </Grid>
                <Grid size={{ xs: 6, md: 2 }}>
                  <TextField label="CVV" fullWidth />
                </Grid>
              </Grid>
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

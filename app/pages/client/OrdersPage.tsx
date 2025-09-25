import { useMemo, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  Grid,
  Button,
  Divider,
  Chip,
  TextField,
  Tabs,
  Tab,
  Collapse,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  AvatarGroup,
  Alert,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { Link as RouterLink } from "react-router";
import { useOrders } from "@common/contexts/"; // <<< integração ao contexto
import { formatDate, formatBRL } from "@common/util";

// -------- Types (mock) --------
type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PICKING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED";

type OrderItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  qty: number;
};

type Address = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
};

type Payment = { method: "PIX" | "CARD"; last4?: string };

type Shipment = {
  method: "Correios" | "Transportadora" | "Retirada";
  tracking?: string;
  etaDays?: number;
};

type Order = {
  id: string; // ex: #2025-0001
  createdAt: string; // ISO date
  status: OrderStatus;
  items: OrderItem[];
  address: Address;
  payment: Payment;
  shipment: Shipment;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  canceledAt?: string;
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Aguardando pagamento",
  PAID: "Pagamento aprovado",
  PICKING: "Em separação",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
};

const STATUS_COLOR: Record<
  OrderStatus,
  "default" | "primary" | "warning" | "info" | "success" | "error"
> = {
  PENDING: "default",
  PAID: "primary",
  PICKING: "warning",
  SHIPPED: "info",
  DELIVERED: "success",
  CANCELED: "error",
};

const STEPS = [
  "Pedido recebido",
  "Pagamento aprovado",
  "Em separação",
  "Enviado",
  "Entregue",
];
const STEP_INDEX: Record<OrderStatus, number> = {
  PENDING: 0,
  PAID: 1,
  PICKING: 2,
  SHIPPED: 3,
  DELIVERED: 4,
  CANCELED: 0, // tratamos cancelado à parte
};

// -------- Small components --------
function StatusChip({ status }: { status: OrderStatus }) {
  return (
    <Chip
      size="small"
      color={STATUS_COLOR[status]}
      label={STATUS_LABEL[status]}
    />
  );
}

function ItemsAvatars({ items }: { items: OrderItem[] }) {
  return (
    <AvatarGroup
      max={4}
      sx={{ "& .MuiAvatar-root": { width: 32, height: 32 } }}
    >
      {items.map((it) => (
        <Avatar key={it.id} src={it.image} alt={it.name} />
      ))}
    </AvatarGroup>
  );
}

// -------- Page --------
export default function OrdersPage() {
  // Integração ao contexto (sem alterar UI)
  const { orders, filters, setFilters, cancel, makeReorder } = useOrders();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Mantém o mesmo filtro client-side do arquivo original
  const filtered = useMemo(() => {
    return orders.filter((o: Order) => {
      const search = filters.text ?? "";
      const matchText =
        !search ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.items.some((it: OrderItem) =>
          it.name.toLowerCase().includes(search.toLowerCase())
        );
      const matchStatus =
        filters.status === "ALL" || o.status === filters.status;
      const time = new Date(o.createdAt).getTime();
      const after =
        !filters.start ||
        time >= new Date(`${filters.start}T00:00:00`).getTime();
      const before =
        !filters.end || time <= new Date(`${filters.end}T23:59:59`).getTime();
      return matchText && matchStatus && after && before;
    });
  }, [orders, filters]);

  const clearFilters = () => {
    setFilters({ text: "", status: "ALL", start: "", end: "" });
  };

  const canCancel = (status: OrderStatus) =>
    status === "PENDING" || status === "PAID";

  const onCancel = (id: string) => {
    // chama o backend via contexto
    void cancel(id);
  };

  const onReorder = (o: Order) => {
    // dispara lógica de recompra via contexto (e mantém o link para /cart como no original)
    void makeReorder(o.id);
    // o link de navegação permanece no botão (RouterLink) como antes
  };

  return (
    <Container sx={{ py: 3 }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "start", sm: "center" }}
        gap={1}
      >
        <Stack>
          <Typography variant="h5" fontWeight={800}>
            Meus pedidos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Acompanhe o status e os detalhes de suas compras.
          </Typography>
        </Stack>
        <Button
          component={RouterLink}
          to="/catalog"
          startIcon={<Inventory2RoundedIcon />}
        >
          Ir ao catálogo
        </Button>
      </Stack>

      {/* Filtros */}
      <Paper variant="outlined" sx={{ p: 2, mt: 2, borderRadius: 3 }}>
        <Grid container spacing={2}>
          <Grid sx={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Buscar por código ou produto"
              placeholder="#2025-0001, “teclado”…"
              value={filters.text}
              onChange={(e) => setFilters({ text: e.target.value })}
              InputProps={{
                startAdornment: (
                  <SearchRoundedIcon sx={{ mr: 1, color: "text.disabled" }} />
                ),
              }}
            />
          </Grid>
          <Grid sx={{ xs: 6, md: 2 }}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="De"
              InputLabelProps={{ shrink: true }}
              value={filters.start}
              onChange={(e) => setFilters({ start: e.target.value })}
            />
          </Grid>
          <Grid sx={{ xs: 6, md: 2 }}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Até"
              slotProps={{ inputLabel: { shrink: true } }}
              value={filters.end}
              onChange={(e) => setFilters({ end: e.target.value })}
            />
          </Grid>
          <Grid sx={{ xs: 12, md: 4 }}>
            <Tabs
              value={filters.status}
              onChange={(_, v) => setFilters({ status: v })}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Todos" value="ALL" />
              <Tab label="Aguardando" value="PENDING" />
              <Tab label="Pago" value="PAID" />
              <Tab label="Separação" value="PICKING" />
              <Tab label="Enviado" value="SHIPPED" />
              <Tab label="Entregue" value="DELIVERED" />
              <Tab label="Cancelado" value="CANCELED" />
            </Tabs>
          </Grid>
        </Grid>

        <Stack direction="row" gap={1} sx={{ mt: 1 }}>
          <Chip label={`${filtered.length} pedido(s)`} />
          {(filters.text ||
            filters.start ||
            filters.end ||
            filters.status !== "ALL") && (
            <Button onClick={clearFilters}>Limpar filtros</Button>
          )}
        </Stack>
      </Paper>

      {/* Lista de pedidos */}
      <Stack gap={2} sx={{ mt: 2 }}>
  {filtered.map((o: Order) => {
          const activeStep = STEP_INDEX[o.status];
          return (
            <Paper key={o.id} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              {/* Cabeçalho do pedido */}
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                gap={1}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={1}
                  flexWrap="wrap"
                >
                  <Typography fontWeight={800}>{o.id}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(o.createdAt)}
                  </Typography>
                  <StatusChip status={o.status} />
                </Stack>
                <Stack direction="row" alignItems="center" gap={2}>
                  <Typography>
                    Total: <b>{formatBRL(o.total)}</b>
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<VisibilityRoundedIcon />}
                    onClick={() =>
                      setExpandedId((prev) => (prev === o.id ? null : o.id))
                    }
                  >
                    Ver detalhes
                  </Button>
                </Stack>
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              {/* Resumo curto */}
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
                gap={2}
              >
                <Stack direction="row" alignItems="center" gap={1.5}>
                  <ItemsAvatars items={o.items} />
                    <Typography variant="body2" color="text.secondary">
                    {o.items.length} item(ns) •{" "}
                    {o.items.map((i: OrderItem) => `${i.qty}x ${i.name}`).join(", ")}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  gap={2}
                  flexWrap="wrap"
                >
                  <Stack direction="row" alignItems="center" gap={0.5}>
                    <LocalShippingRoundedIcon fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {o.shipment.method}
                      {o.shipment.etaDays
                        ? ` • ${o.shipment.etaDays} dia(s)`
                        : ""}
                      {o.shipment.tracking ? ` • ${o.shipment.tracking}` : ""}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Pagamento:{" "}
                    {o.payment.method === "PIX"
                      ? "PIX"
                      : `Cartão **** ${o.payment.last4 ?? "----"}`}
                  </Typography>
                </Stack>

                <Stack direction="row" gap={1} flexWrap="wrap">
                  {o.shipment.tracking && (
                    <Button
                      size="small"
                      component={RouterLink}
                      to={`/tracking/${o.shipment.tracking}`}
                    >
                      Acompanhar envio
                    </Button>
                  )}
                  <Button
                    size="small"
                    startIcon={<ReplayRoundedIcon />}
                    onClick={() => onReorder(o)}
                    component={RouterLink}
                    to={`/cart?reorder=${encodeURIComponent(o.id)}`}
                  >
                    Comprar novamente
                  </Button>
                  {canCancel(o.status) && (
                    <Button
                      size="small"
                      color="error"
                      startIcon={<CancelRoundedIcon />}
                      onClick={() => onCancel(o.id)}
                    >
                      Cancelar
                    </Button>
                  )}
                </Stack>
              </Stack>

              {/* Detalhes */}
              <Collapse in={expandedId === o.id} unmountOnExit>
                <Box sx={{ pt: 2 }}>
                  {o.status === "CANCELED" ? (
                    <Alert severity="error" icon={<CancelRoundedIcon />}>
                      Pedido cancelado em{" "}
                      {o.canceledAt ? formatDate(o.canceledAt) : "—"}.
                    </Alert>
                  ) : (
                    <Stepper
                      activeStep={activeStep}
                      alternativeLabel
                      sx={{ mb: 2 }}
                    >
                      {STEPS.map((label) => (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  )}

                  <Grid container spacing={2}>
                    {/* Itens */}
                    <Grid sx={{ xs: 12, md: 6 }}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography fontWeight={700} gutterBottom>
                          Itens do pedido
                        </Typography>
                        <Stack divider={<Divider flexItem />} gap={1}>
                          {o.items.map((it: OrderItem) => (
                            <Stack
                              key={it.id}
                              direction="row"
                              alignItems="center"
                              gap={1}
                              py={1}
                            >
                              <Box
                                component="img"
                                src={it.image}
                                alt={it.name}
                                sx={{
                                  width: 56,
                                  height: 56,
                                  objectFit: "cover",
                                  borderRadius: 1,
                                }}
                              />
                              <Box flex={1} minWidth={0}>
                                <Typography noWrap fontWeight={600}>
                                  {it.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {it.qty}x • {formatBRL(it.price)}
                                </Typography>
                              </Box>
                              <Typography fontWeight={700}>
                                {formatBRL(it.qty * it.price)}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>

                        {/* Digital downloads */}
                        {o.items.some((it: OrderItem) => (it as any).downloadUrl) && (
                          <Box sx={{ mt: 2 }}>
                            <Typography fontWeight={700} gutterBottom>
                              Downloads
                            </Typography>
                            <Stack direction="row" gap={1} flexWrap="wrap">
                              {o.items
                                .filter((it: OrderItem) => (it as any).downloadUrl)
                                .map((it: OrderItem) => (
                                  <Button
                                    key={`dl-${it.id}`}
                                    variant="outlined"
                                    href={(it as any).downloadUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    size="small"
                                  >
                                    Baixar {it.name}
                                  </Button>
                                ))}
                            </Stack>
                          </Box>
                        )}

                        <Divider sx={{ my: 1.5 }} />

                        <Stack gap={0.5}>
                          <Row label="Subtotal" value={formatBRL(o.subtotal)} />
                          <Row
                            label="Frete"
                            value={
                              o.shipping === 0
                                ? "Grátis"
                                : formatBRL(o.shipping)
                            }
                          />
                          {o.discount > 0 && (
                            <Row
                              label="Desconto"
                              value={`- ${formatBRL(o.discount)}`}
                              color="success.main"
                            />
                          )}
                          <Divider sx={{ my: 1 }} />
                          <Row label="Total" value={formatBRL(o.total)} bold />
                        </Stack>
                      </Paper>
                    </Grid>

                    {/* Entrega e pagamento */}
                    <Grid sx={{ xs: 12, md: 6 }}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography fontWeight={700} gutterBottom>
                          Entrega & Pagamento
                        </Typography>
                        <Stack gap={1.25}>
                          <Stack direction="row" gap={1}>
                            <CheckCircleRoundedIcon
                              color="success"
                              fontSize="small"
                            />
                            <Box>
                              <Typography fontWeight={600}>
                                Endereço de entrega
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {o.address.name}
                                {" — "}
                                {o.address.line1}
                                {o.address.line2 ? `, ${o.address.line2}` : ""}
                                {", "}
                                {o.address.city}/{o.address.state} •{" "}
                                {o.address.zip}
                              </Typography>
                            </Box>
                          </Stack>

                          <Stack direction="row" gap={1}>
                            <LocalShippingRoundedIcon
                              color="info"
                              fontSize="small"
                            />
                            <Box>
                              <Typography fontWeight={600}>Envio</Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {o.shipment.method}
                                {o.shipment.tracking
                                  ? ` • Código: ${o.shipment.tracking}`
                                  : ""}
                                {o.shipment.etaDays
                                  ? ` • ETA: ${o.shipment.etaDays} dia(s)`
                                  : ""}
                              </Typography>
                            </Box>
                          </Stack>

                          <Stack direction="row" gap={1}>
                            <Inventory2RoundedIcon
                              color="primary"
                              fontSize="small"
                            />
                            <Box>
                              <Typography fontWeight={600}>
                                Pagamento
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {o.payment.method === "PIX"
                                  ? "PIX (aprovado)"
                                  : `Cartão **** ${o.payment.last4 ?? "----"}`}
                              </Typography>
                            </Box>
                          </Stack>
                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
            </Paper>
          );
        })}

        {!filtered.length && (
          <Paper
            variant="outlined"
            sx={{ p: 3, textAlign: "center", borderRadius: 3 }}
          >
            <Typography variant="h6" gutterBottom>
              Nenhum pedido encontrado
            </Typography>
            <Typography color="text.secondary">
              Ajuste os filtros ou continue comprando.
            </Typography>
            <Button component={RouterLink} to="/catalog" sx={{ mt: 2 }}>
              Ver catálogo
            </Button>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}

// -------- Helper row component --------
function Row({
  label,
  value,
  bold = false,
  color,
}: {
  label: string;
  value: string;
  bold?: boolean;
  color?: string;
}) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={bold ? 800 : 600} sx={{ color }}>
        {value}
      </Typography>
    </Stack>
  );
}

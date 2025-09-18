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

// -------- Utils --------
function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

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

// -------- Mock data --------
const MOCK_ORDERS: Order[] = [
  {
    id: "#2025-0001",
    createdAt: "2025-09-10T14:22:00Z",
    status: "DELIVERED",
    items: [
      {
        id: 101,
        name: "Fone Bluetooth XY-300",
        image:
          "https://images.unsplash.com/photo-1518449955429-6f0de8b9aa16?q=80&w=1200&auto=format&fit=crop",
        price: 149.9,
        qty: 1,
      },
      {
        id: 102,
        name: "Teclado Mecânico Aurora",
        image:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
        price: 299.0,
        qty: 1,
      },
    ],
    address: {
      name: "Letícia A.",
      line1: "Rua das Flores, 123",
      city: "Campina Grande",
      state: "PB",
      zip: "58400-000",
    },
    payment: { method: "PIX" },
    shipment: { method: "Correios", tracking: "BR123456789BR" },
    subtotal: 448.9,
    shipping: 0,
    discount: 29.9,
    total: 419.0,
  },
  {
    id: "#2025-0002",
    createdAt: "2025-09-12T10:05:00Z",
    status: "SHIPPED",
    items: [
      {
        id: 103,
        name: "Mouse Gamer Helios",
        image:
          "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1200&auto=format&fit=crop",
        price: 189.5,
        qty: 1,
      },
    ],
    address: {
      name: "Ronaldd M.",
      line1: "Av. Principal, 456",
      line2: "Apto 201",
      city: "João Pessoa",
      state: "PB",
      zip: "58000-000",
    },
    payment: { method: "CARD", last4: "8421" },
    shipment: {
      method: "Transportadora",
      tracking: "TRK-987654321",
      etaDays: 2,
    },
    subtotal: 189.5,
    shipping: 29.9,
    discount: 0,
    total: 219.4,
  },
  {
    id: "#2025-0003",
    createdAt: "2025-09-16T18:40:00Z",
    status: "PENDING",
    items: [
      {
        id: 104,
        name: "Mochila Urbana Pro",
        image:
          "https://images.unsplash.com/photo-1544937950-fa07a98d237f?q=80&w=1200&auto=format&fit=crop",
        price: 219.9,
        qty: 1,
      },
    ],
    address: {
      name: "Hanani S.",
      line1: "Rua do Sol, 77",
      city: "Campina Grande",
      state: "PB",
      zip: "58400-111",
    },
    payment: { method: "PIX" },
    shipment: { method: "Retirada" },
    subtotal: 219.9,
    shipping: 0,
    discount: 0,
    total: 219.9,
  },
];

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
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filtros
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<OrderStatus | "ALL">("ALL");
  const [start, setStart] = useState<string>(""); // yyyy-mm-dd
  const [end, setEnd] = useState<string>(""); // yyyy-mm-dd

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchText =
        !search ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.items.some((it) =>
          it.name.toLowerCase().includes(search.toLowerCase())
        );
      const matchStatus = statusTab === "ALL" || o.status === statusTab;
      const time = new Date(o.createdAt).getTime();
      const after = !start || time >= new Date(`${start}T00:00:00`).getTime();
      const before = !end || time <= new Date(`${end}T23:59:59`).getTime();
      return matchText && matchStatus && after && before;
    });
  }, [orders, search, statusTab, start, end]);

  const clearFilters = () => {
    setSearch("");
    setStatusTab("ALL");
    setStart("");
    setEnd("");
  };

  const canCancel = (status: OrderStatus) =>
    status === "PENDING" || status === "PAID";
  const onCancel = (id: string) =>
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, status: "CANCELED", canceledAt: new Date().toISOString() }
          : o
      )
    );

  const onReorder = (o: Order) => {
    // mock: levar para o carrinho com query ?reorder=...
    // na sua app real, você recriaria os itens no carrinho.
    console.log("Recomprar:", o.id);
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </Grid>
          <Grid sx={{ xs: 6, md: 2 }}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Até"
              InputLabelProps={{ shrink: true }}
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </Grid>
          <Grid sx={{ xs: 12, md: 4 }}>
            <Tabs
              value={statusTab}
              onChange={(_, v) => setStatusTab(v)}
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
          {(search || start || end || statusTab !== "ALL") && (
            <Button onClick={clearFilters}>Limpar filtros</Button>
          )}
        </Stack>
      </Paper>

      {/* Lista de pedidos */}
      <Stack gap={2} sx={{ mt: 2 }}>
        {filtered.map((o) => {
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
                    {o.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}
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
                          {o.items.map((it) => (
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

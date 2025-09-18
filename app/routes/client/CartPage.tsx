// CartPage.tsx — versão refatorada (sem cupom no carrinho)
// - Remove toda a lógica e UI de cupom
// - Mantém apenas edição de itens + frete estimado + total
// - Checkout continuará sendo o único lugar onde se aplica cupom/forma de entrega/pagamento

import { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Divider,
  Stack,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { Link as RouterLink } from "react-router";

// ---------- Mock ----------
type Product = {
  id: number;
  name: string;
  image: string;
  price: number; // preço unitário
  stock: number; // mock de estoque
};

type CartItem = {
  product: Product;
  qty: number;
};

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Fone Bluetooth XY-300",
    image:
      "https://images.unsplash.com/photo-1518449955429-6f0de8b9aa16?q=80&w=1200&auto=format&fit=crop",
    price: 149.9,
    stock: 8,
  },
  {
    id: 2,
    name: "Teclado Mecânico Aurora",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
    price: 299.0,
    stock: 5,
  },
  {
    id: 3,
    name: "Mouse Gamer Helios",
    image:
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1200&auto=format&fit=crop",
    price: 189.5,
    stock: 12,
  },
];

const INITIAL_CART: CartItem[] = [
  { product: MOCK_PRODUCTS[0], qty: 1 },
  { product: MOCK_PRODUCTS[1], qty: 2 },
];

// ---------- Utils ----------
function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// frete mock: grátis acima de R$400; senão R$29,90
function calcShipping(subtotal: number) {
  return subtotal >= 400 ? 0 : 29.9;
}

// ---------- Component ----------
export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);

  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + it.product.price * it.qty, 0),
    [items]
  );

  const shipping = useMemo(() => calcShipping(subtotal), [subtotal]);
  const total = Math.max(0, subtotal) + shipping;

  const inc = (id: number) =>
    setItems((prev) =>
      prev.map((it) =>
        it.product.id === id
          ? { ...it, qty: Math.min(it.qty + 1, it.product.stock) }
          : it
      )
    );

  const dec = (id: number) =>
    setItems((prev) =>
      prev
        .map((it) =>
          it.product.id === id ? { ...it, qty: Math.max(0, it.qty - 1) } : it
        )
        .filter((it) => it.qty > 0)
    );

  const remove = (id: number) =>
    setItems((prev) => prev.filter((it) => it.product.id !== id));

  const clear = () => setItems([]);

  if (!items.length) {
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Seu carrinho está vazio
        </Typography>
        <Typography color="text.secondary">
          Explore nossos produtos e adicione seus favoritos.
        </Typography>
        <Stack direction="row" gap={1} sx={{ mt: 2 }}>
          <Button
            component={RouterLink}
            to="/catalog"
            startIcon={<ArrowBackIosNewRoundedIcon />}
            variant="outlined"
          >
            Ir ao catálogo
          </Button>
          <Button variant="contained">Ver ofertas</Button>
        </Stack>
      </Paper>
    );
  }

  return (
    <Stack gap={2} sx={{ width: "100%", maxWidth: 1000, mx: "auto" }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        gap={1}
      >
        <Typography variant="h5" fontWeight={700}>
          Carrinho ({items.reduce((a, b) => a + b.qty, 0)} itens)
        </Typography>
        <Stack direction="row" gap={1}>
          <Button
            component={RouterLink}
            to="/catalog"
            startIcon={<ArrowBackIosNewRoundedIcon />}
          >
            Continuar comprando
          </Button>
          <Button
            color="error"
            startIcon={<DeleteSweepRoundedIcon />}
            onClick={clear}
          >
            Limpar carrinho
          </Button>
        </Stack>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} gap={2}>
        {/* Lista de itens */}
        <Paper
          variant="outlined"
          sx={{ padding: 2, flex: 1, height: "min-content" }}
        >
          {items.map((it, idx) => (
            <Box key={it.product.id}>
              {idx > 0 && <Divider sx={{ my: 2 }} />}
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  component="img"
                  src={it.product.image}
                  alt={it.product.name}
                  sx={{
                    width: 84,
                    height: 84,
                    borderRadius: 2,
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
                <Box flex={1} minWidth={0}>
                  <Typography fontWeight={700} noWrap>
                    {it.product.name}
                  </Typography>
                  <Typography color="text.secondary" fontSize={14}>
                    Unidade: {formatBRL(it.product.price)}
                  </Typography>
                  <Typography color="text.secondary" fontSize={12}>
                    Em estoque: {it.product.stock}
                  </Typography>
                </Box>

                {/* Quantidade */}
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={1}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    px: 1,
                    py: 0.5,
                    borderRadius: 2,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => dec(it.product.id)}
                    disabled={it.qty <= 1}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography width={28} textAlign="center" fontWeight={700}>
                    {it.qty}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => inc(it.product.id)}
                    disabled={it.qty >= it.product.stock}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>

                {/* Preço total do item */}
                <Box textAlign="right" minWidth={120}>
                  <Typography fontWeight={700}>
                    {formatBRL(it.product.price * it.qty)}
                  </Typography>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => remove(it.product.id)}
                    startIcon={<DeleteIcon />}
                    sx={{ mt: 0.5 }}
                  >
                    Remover
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Paper>

        {/* Resumo (sem cupom) */}
        <Stack
          sx={{
            minWidth: { md: 340 },
            position: { md: "sticky" },
            top: { md: 16 },
          }}
        >
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Resumo
            </Typography>

            <Stack direction="row" justifyContent="space-between" py={0.5}>
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography>{formatBRL(subtotal)}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between" py={0.5}>
              <Stack direction="row" alignItems="center" gap={0.5}>
                <LocalShippingRoundedIcon fontSize="small" />
                <Typography color="text.secondary">Frete (estimado)</Typography>
              </Stack>
              <Typography>
                {shipping === 0 ? "Grátis" : formatBRL(shipping)}
              </Typography>
            </Stack>

            <Divider sx={{ my: 1.5 }} />

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">{formatBRL(total)}</Typography>
            </Stack>

            <Button
              component={RouterLink}
              to="/checkout"
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
              fullWidth
            >
              Finalizar compra
            </Button>

            {subtotal < 400 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Falta {formatBRL(400 - subtotal)} para frete grátis.
              </Alert>
            )}
          </Paper>

          <Button
            component={RouterLink}
            to="/catalog"
            startIcon={<ArrowBackIosNewRoundedIcon />}
            sx={{ mt: 1 }}
          >
            Adicionar mais itens
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}

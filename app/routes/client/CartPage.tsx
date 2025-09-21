// src/routes/CartPage.tsx
import { useMemo, useEffect, useState } from "react";
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
import { Link as RouterLink, useLocation, useNavigate } from "react-router";
import { useCart } from "@common/contexts";
import { formatBRL } from "@common/util";

function calcShipping(subtotal: number) {
  return subtotal >= 400 ? 0 : 29.9;
}

export default function CartPage() {
  const { state, subtotal, setQty, remove, clear, itemsCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [reorderId, setReorderId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("reorder");
    if (id) {
      setReorderId(id);
      params.delete("reorder");
      navigate(
        { pathname: location.pathname, search: params.toString() },
        { replace: true }
      );
    }
  }, [location.pathname, location.search, navigate]);

  const shipping = useMemo(() => calcShipping(subtotal), [subtotal]);
  const total = Math.max(0, subtotal) + shipping;

  if (!state.items.length) {
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        {reorderId && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Recompra do pedido {reorderId} solicitada.
          </Alert>
        )}
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
      {reorderId && (
        <Alert severity="success">
          Itens do pedido <b>{reorderId}</b> foram adicionados ao seu carrinho.
        </Alert>
      )}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        gap={1}
      >
        <Typography variant="h5" fontWeight={700}>
          Carrinho ({itemsCount} itens)
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
            onClick={() => void clear()}
          >
            Limpar carrinho
          </Button>
        </Stack>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} gap={2}>
        <Paper variant="outlined" sx={{ p: 2, flex: 1, height: "min-content" }}>
          {state.items.map((it, idx) => (
            <Box key={`${it.product.id}-${idx}`}>
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
                    Em estoque: {it.product.stock ?? "—"}
                  </Typography>
                </Box>

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
                    onClick={() =>
                      void setQty(
                        it.product.id,
                        Math.max(1, it.qty - 1),
                        it.meta
                      )
                    }
                    disabled={it.qty <= 1}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography width={28} textAlign="center" fontWeight={700}>
                    {it.qty}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() =>
                      void setQty(it.product.id, it.qty + 1, it.meta)
                    }
                    disabled={
                      it.product.stock !== undefined &&
                      it.qty >= it.product.stock!
                    }
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>

                <Box textAlign="right" minWidth={120}>
                  <Typography fontWeight={700}>
                    {formatBRL(it.lineTotal)}
                  </Typography>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => void remove(it.product.id, it.meta)}
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

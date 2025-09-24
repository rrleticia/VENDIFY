// CheckoutSuccessPage.tsx (opcional)
// Rota de sucesso para onde navegamos após confirmar o pedido.
// Use em routes: route("/checkout/success", <CheckoutSuccessPage />)

import { Box, Paper, Stack, Typography, Button } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PixRoundedIcon from "@mui/icons-material/PixRounded";
import { useLocation, useNavigate } from "react-router";

export default function CheckoutSuccessPage() {
  const nav = useNavigate();
  const { estado } = useLocation() as {
    estado?: {
      total: number;
      payment: "pix" | "card";
      shipping: string;
      orderId: string;
    };
  };

  return (
    <Box sx={{ maxWidth: 760, mx: "auto", p: 2 }}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack alignItems="center" gap={1}>
          <CheckCircleRoundedIcon color="success" sx={{ fontSize: 56 }} />
          <Typography variant="h6" fontWeight={800}>
            Pedido confirmado!
          </Typography>
          <Typography color="text.secondary" textAlign="center">
            {estado?.orderId
              ? `Número do pedido: ${estado.orderId}`
              : "Número do pedido gerado."}
          </Typography>
        </Stack>

        {estado?.payment === "pix" ? (
          <Stack alignItems="center" gap={1.5} sx={{ mt: 3 }}>
            <PixRoundedIcon />
            <Typography variant="body2" color="text.secondary">
              Escaneie o QR Code na próxima tela para concluir o pagamento.
            </Typography>
            <Button
              variant="contained"
              onClick={() => nav("/pix/qr", { replace: true })}
            >
              Ver QR Code PIX
            </Button>
          </Stack>
        ) : (
          <Typography
            sx={{ mt: 3 }}
            variant="body2"
            color="text.secondary"
            textAlign="center"
          >
            Pagamento no cartão em processamento.
          </Typography>
        )}

        <Stack direction="row" justifyContent="center" gap={1.5} sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => nav("/orders", { replace: true })}
          >
            Ver meus pedidos
          </Button>
          <Button
            variant="contained"
            onClick={() => nav("/home", { replace: true })}
          >
            Continuar comprando
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

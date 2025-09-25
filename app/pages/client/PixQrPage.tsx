import { Box, Paper, Stack, Typography, Button } from "@mui/material";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import { useLocation, useNavigate } from "react-router";

export default function PixQrPage() {
  const nav = useNavigate();
  const { state } = useLocation() as {
    state?: { orderId?: string; total?: number };
  };

  return (
    <Box sx={{ maxWidth: 760, mx: "auto", p: 2 }}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack alignItems="center" gap={1}>
          <QrCode2RoundedIcon sx={{ fontSize: 56 }} color="primary" />
          <Typography variant="h6" fontWeight={700}>
            Pagamento via PIX
          </Typography>
          <Typography color="text.secondary" textAlign="center">
            {state?.orderId
              ? `Pedido: ${state.orderId} — Total: R$ ${(
                  state.total ?? 0
                ).toFixed(2)}`
              : "Informações do pedido não disponíveis."}
          </Typography>

          <Box
            component="img"
            src="https://cdn.jornalestadodegoias.com.br/wp-content/uploads/2020/04/qr-code.jpg"
            alt="QR Code PIX"
            sx={{
              width: 260,
              height: 260,
              objectFit: "contain",
              borderRadius: 1,
              mt: 2,
            }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Escaneie este QR Code com seu aplicativo bancário para concluir o pagamento.
          </Typography>

          <Stack direction="row" gap={1} sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => nav(-1)}>
              Voltar
            </Button>
            <Button
              variant="contained"
              onClick={() => {
              }}
            >
              Copiar Payload
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}

// CheckoutSuccessPage.tsx (opcional)
// Rota de sucesso para onde navegamos após confirmar o pedido.
// Use em routes: route("/checkout/success", <CheckoutSuccessPage />)

import { Box, Paper, Stack, Typography, Button } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PixRoundedIcon from "@mui/icons-material/PixRounded";
import { useLocation, useNavigate } from "react-router";

export default function CheckoutSuccessPage() {
  const nav = useNavigate();
  const { state } = useLocation() as {
    state?: {
      total: number;
      payment: "pix" | "card";
      shipping: string;
      orderId: string;
      items?: Array<{
        id: string | number;
        name: string;
        downloadUrl?: string;
      }>;
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
            {state?.orderId
              ? `Número do pedido: ${state.orderId}`
              : "Número do pedido gerado."}
          </Typography>
        </Stack>

        {state?.payment === "pix" ? (
          <Stack alignItems="center" gap={1.5} sx={{ mt: 3 }}>
            <PixRoundedIcon />
            <Typography variant="body2" color="text.secondary">
              Escaneie o QR Code abaixo para concluir o pagamento.
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
                mt: 1,
              }}
            />
            <Button
              variant="contained"
              onClick={() =>
                nav("/pix/qr", {
                  replace: true,
                  state: { orderId: state?.orderId, total: state?.total },
                })
              }
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

        {/* Digital items: show download links if present in navigation state */}
        {state?.items?.length ? (
          <Stack sx={{ mt: 3 }} gap={1}>
            <Typography variant="subtitle1" fontWeight={800}>
              Downloads
            </Typography>
            {state.items
              .filter((it: any) => !!it.downloadUrl)
              .map((it: any) => (
                <Button
                  key={it.id}
                  variant="outlined"
                  href={it.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Baixar: {it.name}
                </Button>
              ))}
          </Stack>
        ) : null}

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

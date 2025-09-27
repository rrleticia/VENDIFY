// CheckoutSuccessPage.tsx (opcional)
// Rota de sucesso para onde navegamos após confirmar o pedido.
// Use em routes: route("/checkout/success", <CheckoutSuccessPage />)

import { Box, Paper, Stack, Typography, Button, Chip, Divider } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PixRoundedIcon from "@mui/icons-material/PixRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { useLocation, useNavigate } from "react-router";

export default function CheckoutSuccessPage() {
  const nav = useNavigate();
  const { state } = useLocation() as {
    state?: {
      total: number;
      payment: "pix" | "card";
      shipping: string;
      orderId: string;
      hasDigitalProducts?: boolean;
      digitalItems?: Array<{
        product: {
          id: string;
          name: string;
          downloadUrl?: string;
          fileFormat?: string;
          isDigital?: boolean;
        };
        qty: number;
      }>;
    };
  };

  const estado = state; // Manter compatibilidade

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

        {/* Seção de downloads para ebooks */}
        {estado?.hasDigitalProducts && estado.digitalItems && estado.digitalItems.length > 0 && (
          <Stack gap={2} sx={{ mt: 3 }}>
            <Divider />
            <Typography variant="h6" fontWeight={700} textAlign="center">
              Seus E-books
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Os downloads estão disponíveis imediatamente após a confirmação do pagamento
            </Typography>
            
            <Stack gap={1.5}>
              {estado.digitalItems.map((item) => (
                <Paper
                  key={item.product.id}
                  variant="outlined"
                  sx={{ p: 2, borderRadius: 2 }}
                >
                  <Stack direction="row" alignItems="center" gap={2}>
                    <DownloadRoundedIcon color="primary" />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {item.product.name}
                      </Typography>
                      {item.product.fileFormat && (
                        <Chip
                          label={item.product.fileFormat}
                          size="small"
                          variant="outlined"
                          sx={{ mt: 0.5 }}
                        />
                      )}
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<DownloadRoundedIcon />}
                      onClick={() => {
                        if (item.product.downloadUrl) {
                          window.open(item.product.downloadUrl, '_blank');
                        }
                      }}
                      disabled={!item.product.downloadUrl}
                    >
                      Download
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Stack>
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

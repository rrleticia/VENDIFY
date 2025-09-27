import React from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";


export default function PixQRCodePage() {
  const navigate = useNavigate();
  const { state } = useLocation() as {
  state?: {
    total: number;
    payment: "pix";
    shipping: string;
    orderId: string;
  };
};


  return (
    <Box sx={{ maxWidth: 400, mx: "auto", p: 3 }}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack alignItems="center" gap={3}>
          {/* Header */}
          <Typography variant="h5" fontWeight={700} textAlign="center">
            QR Code PIX
          </Typography>

          {/* QR Code */}
          <Paper
            variant="outlined"
            sx={{
              width: 250,
              height: 250,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "grey.50",
              border: "2px solid",
              borderColor: "grey.300",
            }}
          >
            <Box
              sx={{
                width: 200,
                height: 200,
                bgcolor: "common.black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1,
              }}
            >
              <Typography color="white" variant="h6" textAlign="center">
                QR CODE
                <br />
                PIX
              </Typography>
            </Box>
          </Paper>

          {/* Instructions */}
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Use o aplicativo do seu banco para escanear o código
          </Typography>

          {/* Back Button */}
          <Button
          variant="contained"
          fullWidth
          onClick={() => navigate("/checkout/success", { 
            state: { ...state, fromPixQr: true } 
          })}
          sx={{ mt: 2 }}
        >
          Voltar
        </Button>

        </Stack>
      </Paper>
    </Box>
  );
}
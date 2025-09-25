import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router";

const STEPS = [
  "Pedido recebido",
  "Em separação",
  "Enviado",
  "Em trânsito",
  "Entregue",
];

export default function TrackingPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const step = id ? (id.length % STEPS.length) : 2;

  return (
    <Container sx={{ py: 3 }}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack gap={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={800}>
              Acompanhar envio
            </Typography>
            <Button onClick={() => nav(-1)} variant="text">Voltar</Button>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Código de rastreio: <b>{id ?? "—"}</b>
          </Typography>

          <Box>
            <Stepper activeStep={Math.max(0, step)} orientation="vertical">
              {STEPS.map((s) => (
                <Step key={s}>
                  <StepLabel>{s}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Typography variant="body2" color="text.secondary">
            As informações acima são simuladas. Em um ambiente real, aqui seriam exibidos os eventos reais retornados pelo serviço de rastreamento do transportador.
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
  
}

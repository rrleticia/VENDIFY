import { useParams, useNavigate } from "react-router";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Divider,
} from "@mui/material";
import {
  LocalShipping as ShippingIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";

const TRACKING_STEPS = [
  "Pedido confirmado",
  "Em preparação",
  "Saiu para entrega",
  "Entregue"
];

const TRACKING_STATUS: Record<string, {
  currentStep: number;
  status: string;
  estimatedDelivery: string;
  carrier: string;
  deliveredDate?: string;
  events: { date: string; status: string; location: string; }[];
}> = {
  "BR1234567890": {
    currentStep: 2,
    status: "EM_TRANSITO",
    estimatedDelivery: "28/09/2025",
    carrier: "Correios",
    events: [
      {
        date: "25/09/2025 14:30",
        status: "Pedido confirmado",
        location: "São Paulo - SP"
      },
      {
        date: "26/09/2025 09:15",
        status: "Objeto postado",
        location: "Centro de Distribuição - São Paulo"
      },
      {
        date: "27/09/2025 08:00",
        status: "Objeto saiu para entrega",
        location: "Campina Grande - PB"
      }
    ]
  },
  "BR987654321": {
    currentStep: 3,
    status: "ENTREGUE",
    estimatedDelivery: "26/09/2025",
    deliveredDate: "26/09/2025 16:20",
    carrier: "Correios",
    events: [
      {
        date: "24/09/2025 10:00",
        status: "Pedido confirmado",
        location: "São Paulo - SP"
      },
      {
        date: "25/09/2025 07:30",
        status: "Objeto postado",
        location: "Centro de Distribuição - São Paulo"
      },
      {
        date: "26/09/2025 14:45",
        status: "Objeto saiu para entrega",
        location: "Campina Grande - PB"
      },
      {
        date: "26/09/2025 16:20",
        status: "Objeto entregue",
        location: "Campina Grande - PB"
      }
    ]
  }
};

export default function TrackingPage() {
  const { trackingCode } = useParams<{ trackingCode: string }>();
  const navigate = useNavigate();
  
  const trackingInfo = trackingCode ? TRACKING_STATUS[trackingCode as keyof typeof TRACKING_STATUS] : null;

  if (!trackingCode || !trackingInfo) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
        <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Código de rastreamento não encontrado
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Não foi possível encontrar informações para o código: {trackingCode}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/orders")}
          >
            Voltar aos Pedidos
          </Button>
        </Paper>
      </Box>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ENTREGUE":
        return "success";
      case "EM_TRANSITO":
        return "primary";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ENTREGUE":
        return <CheckCircleIcon />;
      case "EM_TRANSITO":
        return <ShippingIcon />;
      default:
        return <ScheduleIcon />;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/orders")}
              variant="outlined"
              size="small"
            >
              Voltar
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Chip
              icon={getStatusIcon(trackingInfo.status)}
              label={
                trackingInfo.status === "ENTREGUE" 
                  ? "Entregue" 
                  : trackingInfo.status === "EM_TRANSITO"
                  ? "Em trânsito"
                  : "Processando"
              }
              color={getStatusColor(trackingInfo.status) as any}
              variant="outlined"
            />
          </Stack>

          <Stack alignItems="center" spacing={1}>
            <ShippingIcon sx={{ fontSize: 48, color: "primary.main" }} />
            <Typography variant="h5" fontWeight="bold">
              Rastreamento de Envio
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Código: {trackingCode}
            </Typography>
          </Stack>

          <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Transportadora
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {trackingInfo.carrier}
                </Typography>
              </Box>
              {trackingInfo.status === "ENTREGUE" ? (
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Entregue em
                  </Typography>
                  <Typography variant="body1" fontWeight="600" color="success.main">
                    {trackingInfo.deliveredDate}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Previsão de entrega
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {trackingInfo.estimatedDelivery}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom>
              Status do envio
            </Typography>
            <Stepper activeStep={trackingInfo.currentStep} orientation="vertical">
              {TRACKING_STEPS.map((label, index) => (
                <Step key={label} completed={index <= trackingInfo.currentStep}>
                  <StepLabel>
                    <Typography
                      variant="body2"
                      color={index <= trackingInfo.currentStep ? "primary" : "text.secondary"}
                      fontWeight={index === trackingInfo.currentStep ? 600 : 400}
                    >
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom>
              Histórico de movimentação
            </Typography>
            <Stack spacing={2}>
              {trackingInfo.events.map((event, index) => (
                <Box key={index} sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: index === 0 ? "primary.main" : "grey.400",
                      mt: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {event.status}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {event.date} - {event.location}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
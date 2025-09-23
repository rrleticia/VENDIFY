import { DashboardAdminProvider, useDashboardAdmin } from "@common/contexts";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router";

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <Card elevation={1}>
      <CardContent>
        <Typography variant="overline" sx={{ opacity: 0.7 }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ lineHeight: 1.2 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

function Content() {
  const { loading, data } = useDashboardAdmin();
  const fmt = (n: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(n);

  if (!data || loading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Grid key={i} sx={{ xs: 12, md: 6, sm: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Carregando...</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Stack gap={3}>
      <Grid container spacing={2}>
        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Vendas (estimado)"
            value={fmt(data.totalSales)}
            subtitle="Somatório de pedidos pagos/enviados/entregues"
          />
        </Grid>
        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Produtos ativos" value={data.activeProducts} />
        </Grid>
        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Pedidos pendentes" value={data.pending} />
        </Grid>
        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Pedidos totais" value={data.totalOrders} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid sx={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" mb={1}>
                Status de pedidos
              </Typography>
              <Stack direction="row" gap={1} flexWrap="wrap">
                <Typography variant="body2">
                  Pagos: <b>{data.paid}</b>
                </Typography>
                <Typography variant="body2">
                  Separação: <b>{data.picking}</b>
                </Typography>
                <Typography variant="body2">
                  Enviados: <b>{data.shipped}</b>
                </Typography>
                <Typography variant="body2">
                  Entregues: <b>{data.delivered}</b>
                </Typography>
                <Typography variant="body2">
                  Cancelados: <b>{data.cancelled}</b>
                </Typography>
              </Stack>
              <Button
                size="small"
                sx={{ mt: 2 }}
                component={RouterLink}
                to="/admin/orders"
                variant="outlined"
              >
                Ver pedidos
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid sx={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" mb={1}>
                Ações rápidas
              </Typography>
              <Stack direction="row" gap={1} flexWrap="wrap">
                <Button
                  component={RouterLink}
                  to="/admin/catalog"
                  variant="contained"
                >
                  Cadastrar produto
                </Button>
                <Button
                  component={RouterLink}
                  to="/admin/users"
                  variant="outlined"
                >
                  Gerenciar usuários
                </Button>
                <Button
                  component={RouterLink}
                  to="/admin/logs"
                  variant="outlined"
                >
                  Ver logs
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default function DashboardAdminPage() {
  return (
    <DashboardAdminProvider>
      <Box>
        <Typography variant="h5" mb={2}>
          Dashboard
        </Typography>
        <Content />
      </Box>
    </DashboardAdminProvider>
  );
}

// SPA guard: admin por padrão
export async function clientLoader() {
  const mod = await import("./guards");
  return mod.requireRole("admin");
}

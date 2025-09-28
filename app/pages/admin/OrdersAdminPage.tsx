import React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import OrderStatusChip from "@components/OrderStatusChip";
import { OrdersAdminProvider, useOrdersAdmin } from "@common/contexts";

function Orders() {
  const { loading, summary, orders, updateStatus } = useOrdersAdmin();

  // filtros
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<
    | "ALL"
    | "PENDING"
    | "PAID"
    | "PICKING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELED"
  >("ALL");
  const [start, setStart] = React.useState<string>("");
  const [end, setEnd] = React.useState<string>("");
  const [toast, setToast] = React.useState("");

  const filtered = React.useMemo(() => {
    let data = orders;
    if (status !== "ALL") data = data.filter((o) => o.status === status);
    if (q.trim()) {
      const qq = q.toLowerCase();
      data = data.filter((o) => o.id.toLowerCase().includes(qq));
    }
    if (start) {
      const s = new Date(start).getTime();
      data = data.filter((o) => new Date(o.createdAt).getTime() >= s);
    }
    if (end) {
      const e = new Date(end).getTime();
      data = data.filter((o) => new Date(o.createdAt).getTime() <= e);
    }
    return data;
  }, [orders, q, status, start, end]);

  const exportCSV = () => {
    const headers = [
      "id",
      "createdAt",
      "status",
      "itemsCount",
      "estimateTotal",
    ];
    const lines = [headers.join(",")];
    filtered.forEach((o) => {
      const itemsCount = o.items?.reduce((a, b) => a + (b.qty ?? 0), 0) ?? 0;
      const estimateTotal =
        o.items?.reduce(
          (a, b) => a + Number(b.price || 0) * Number(b.qty || 0),
          0
        ) ?? 0;
      const row = [
        JSON.stringify(o.id),
        JSON.stringify(o.createdAt),
        JSON.stringify(o.status),
        String(itemsCount),
        String(estimateTotal.toFixed(2)),
      ];
      lines.push(row.join(","));
    });
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <CircularProgress />;

  return (
    <Stack gap={2}>
      <Stack direction="row" gap={2} flexWrap="wrap" alignItems="center">
        <Chip label={`Total: ${summary?.total ?? 0}`} />
        <Chip label={`Pendentes: ${summary?.pending ?? 0}`} />
        <Chip label={`Pagos: ${summary?.paid ?? 0}`} />
        <Chip label={`Em separação: ${summary?.picking ?? 0}`} />
        <Chip label={`Enviados: ${summary?.shipped ?? 0}`} />
        <Chip label={`Entregues: ${summary?.delivered ?? 0}`} />
        <Chip label={`Cancelados: ${summary?.cancelled ?? 0}`} />
      </Stack>

      {/* filtros */}
      <Card>
        <CardContent>
          <Stack direction="row" gap={2} flexWrap="wrap" alignItems="center">
            <TextField
              size="small"
              label="Buscar por ID"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Select
              size="small"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <MenuItem value="ALL">Todos</MenuItem>
              <MenuItem value="PENDING">Pendente</MenuItem>
              <MenuItem value="PAID">Pago</MenuItem>
              <MenuItem value="PICKING">Separação</MenuItem>
              <MenuItem value="SHIPPED">Enviado</MenuItem>
              <MenuItem value="DELIVERED">Entregue</MenuItem>
              <MenuItem value="CANCELED">Cancelado</MenuItem>
            </Select>
            <TextField
              size="small"
              label="Início"
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              size="small"
              label="Fim"
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                setQ("");
                setStatus("ALL");
                setStart("");
                setEnd("");
              }}
            >
              Limpar
            </Button>
            <Button variant="contained" onClick={exportCSV}>
              Exportar CSV
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* tabela de pedidos */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent>
            <Typography>Nenhum pedido encontrado.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Itens</TableCell>
                  <TableCell>Total estimado</TableCell>
                  <TableCell align="right">Ação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((o) => {
                  const itemsCount =
                    o.items?.reduce((a, b) => a + (b.qty ?? 0), 0) ?? 0;
                  const estimateTotal =
                    o.items?.reduce(
                      (a, b) => a + Number(b.price || 0) * Number(b.qty || 0),
                      0
                    ) ?? 0;
                  return (
                    <TableRow
                      key={o.id}
                      hover
                      sx={{
                        "&:nth-of-type(even)": { backgroundColor: "#f9fafb" },
                      }}
                    >
                      <TableCell>{o.id}</TableCell>
                      <TableCell>
                        {new Date(o.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span style={{ display: "inline-block" }}>
                          <OrderStatusChip value={o.status} />
                        </span>
                      </TableCell>
                      <TableCell>{itemsCount}</TableCell>
                      <TableCell>R$ {estimateTotal.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <Select
                          size="small"
                          value={o.status}
                          onChange={(e) => {
                            updateStatus(o.id, e.target.value as any);
                            setToast("Status atualizado");
                          }}
                        >
                          <MenuItem value="PENDING">Pendente</MenuItem>
                          <MenuItem value="PAID">Pago</MenuItem>
                          <MenuItem value="PICKING">Separação</MenuItem>
                          <MenuItem value="SHIPPED">Enviado</MenuItem>
                          <MenuItem value="DELIVERED">Entregue</MenuItem>
                          <MenuItem value="CANCELED">Cancelado</MenuItem>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Snackbar
        open={!!toast}
        autoHideDuration={2000}
        onClose={() => setToast("")}
      >
        <Alert severity="success" onClose={() => setToast("")}>
          {toast}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

function Inner() {
  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Pedidos (Admin)
      </Typography>
      <Orders />
    </Box>
  );
}

export default function OrdersAdminPage() {
  return (
    <OrdersAdminProvider>
      <Inner />
    </OrdersAdminProvider>
  );
}

// SPA guard
export async function clientLoader() {
  const mod = await import("./guards");
  return mod.requireRole("seller");
}

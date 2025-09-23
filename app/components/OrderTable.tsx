import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useOrders } from "../contexts/OrdersContext";
import { Box, MenuItem, TextField } from "@mui/material";

export default function OrderTable() {
  const { orders, updateStatus } = useOrders();

  const cols: GridColDef[] = [
    { field: "id", headerName: "Pedido", width: 160 },
    { field: "customerId", headerName: "Cliente", width: 140 },
    {
      field: "total",
      headerName: "Total",
      width: 120,
      valueFormatter: ({ value }) => `R$ ${Number(value).toFixed(2)}`,
    },
    {
      field: "status",
      headerName: "Status",
      width: 160,
      renderCell: (p) => (
        <TextField
          select
          size="small"
          defaultValue={p.row.status}
          onChange={(e) => updateStatus(p.row.id, e.target.value as any)}
        >
          <MenuItem value="pending">Pendente</MenuItem>
          <MenuItem value="paid">Pago</MenuItem>
          <MenuItem value="shipped">Enviado</MenuItem>
          <MenuItem value="delivered">Entregue</MenuItem>
          <MenuItem value="canceled">Cancelado</MenuItem>
        </TextField>
      ),
    },
    {
      field: "createdAt",
      headerName: "Criado em",
      width: 200,
      valueFormatter: ({ value }) => new Date(value as string).toLocaleString(),
    },
  ];

  return (
    <Box sx={{ height: 520 }}>
      <DataGrid rows={orders} columns={cols} getRowId={(r) => r.id} />
    </Box>
  );
}

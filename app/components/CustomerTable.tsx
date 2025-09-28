import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useCustomers } from "../contexts/CustomersContext";
import { Box } from "@mui/material";

export default function CustomerTable() {
  const { customers } = useCustomers();
  const cols: GridColDef[] = [
    { field: "name", headerName: "Nome", flex: 1 },
    { field: "email", headerName: "E-mail", flex: 1 },
    { field: "phone", headerName: "Telefone", width: 180 },
    { field: "orderCount", headerName: "Pedidos", width: 120 },
    {
      field: "createdAt",
      headerName: "Desde",
      width: 200,
      valueFormatter: ({ value }) =>
        new Date(value as string).toLocaleDateString(),
    },
  ];
  return (
    <Box sx={{ height: 520 }}>
      <DataGrid rows={customers} columns={cols} getRowId={(r) => r.id} />
    </Box>
  );
}

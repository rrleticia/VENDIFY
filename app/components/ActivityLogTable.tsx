import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useActivityLogs } from "../contexts/ActivityLogsContext";
import { Box } from "@mui/material";

export default function ActivityLogTable() {
  const { logs } = useActivityLogs();
  const cols: GridColDef[] = [
    {
      field: "timestamp",
      headerName: "Quando",
      width: 220,
      valueFormatter: ({ value }) => new Date(value as string).toLocaleString(),
    },
    { field: "action", headerName: "Ação", width: 220 },
    { field: "entityId", headerName: "ID", width: 220 },
    {
      field: "details",
      headerName: "Detalhes",
      flex: 1,
      valueGetter: ({ value }) => JSON.stringify(value ?? {}),
    },
  ];
  return (
    <Box sx={{ height: 400 }}>
      <DataGrid rows={logs} columns={cols} getRowId={(r) => r.id} />
    </Box>
  );
}

import { useState } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Box, Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useCatalog } from "../contexts/CatalogContext";
import { ProductForm } from "./ProductForm";

export default function ProductTable() {
  const { products, deleteProduct, createProduct, updateProduct } =
    useCatalog();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const cols: GridColDef[] = [
    { field: "title", headerName: "Produto", flex: 1 },
    {
      field: "price",
      headerName: "Preço",
      width: 120,
      valueFormatter: ({ value }) => `R$ ${Number(value).toFixed(2)}`,
    },
    { field: "stock", headerName: "Estoque", width: 120 },
    { field: "category", headerName: "Categoria", width: 160 },
    {
      field: "active",
      headerName: "Ativo",
      width: 100,
      valueFormatter: ({ value }) => (value ? "Sim" : "Não"),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          onClick={() => {
            setEditId(null);
            setOpen(true);
          }}
        >
          Novo Produto
        </Button>
        {editId && (
          <Button variant="outlined" onClick={() => setOpen(true)}>
            Editar
          </Button>
        )}
        {editId && (
          <Button color="error" onClick={() => deleteProduct(editId)}>
            Excluir
          </Button>
        )}
      </Box>
      <div style={{ height: 520 }}>
        <DataGrid
          rows={products}
          columns={cols}
          getRowId={(r) => r.id}
          onRowSelectionModelChange={(ids) =>
            setEditId((ids[0] as string) ?? null)
          }
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editId ? "Editar produto" : "Novo produto"}</DialogTitle>
        <DialogContent>
          <ProductForm
            initial={products.find((p) => p.id === editId) ?? undefined}
            onCancel={() => setOpen(false)}
            onSubmit={async (data) => {
              if (editId) await updateProduct(editId, data);
              else await createProduct(data);
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

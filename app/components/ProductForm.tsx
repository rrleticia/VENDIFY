import { useState } from "react";
import { Box, TextField, Button, MenuItem, Stack } from "@mui/material";
import type { AdminProduct } from "../contexts/CatalogContext";
import ImageUploader from "./ImageUploader";

export function ProductForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<AdminProduct>;
  onSubmit: (data: Omit<AdminProduct, "id">) => void;
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [stock, setStock] = useState(initial?.stock ?? 0);
  const [category, setCategory] = useState<AdminProduct["category"]>(
    initial?.category ?? "roupas"
  );
  const [active, setActive] = useState(initial?.active ?? true);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          title,
          description,
          price: Number(price),
          stock: Number(stock),
          category,
          active,
          images,
        });
      }}
      sx={{ display: "grid", gap: 2 }}
    >
      <TextField
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        label="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        minRows={3}
      />
      <Stack direction="row" spacing={2}>
        <TextField
          label="Preço"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />
        <TextField
          label="Estoque"
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          required
        />
      </Stack>
      <TextField
        select
        label="Categoria"
        value={category}
        onChange={(e) => setCategory(e.target.value as any)}
      >
        <MenuItem value="roupas">Roupas</MenuItem>
        <MenuItem value="bolsas">Bolsas</MenuItem>
        <MenuItem value="escritorio">Materiais de escritório</MenuItem>
        <MenuItem value="outros">Outros</MenuItem>
      </TextField>
      <ImageUploader
        onSelect={(urls) => setImages((prev) => [...prev, ...urls])}
      />
      <Stack direction="row" spacing={2}>
        <Button type="submit" variant="contained">
          Salvar
        </Button>
        {onCancel && <Button onClick={onCancel}>Cancelar</Button>}
      </Stack>
    </Box>
  );
}

import React from "react";
import { categories, badges } from "@common/mocks";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Stack,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Grid,
  Snackbar,
  Alert,
  CardMedia,
} from "@mui/material";
import type { ProductType } from "@common/types";
import {
  CatalogAdminProvider,
  useCatalogAdmin,
  SecurityAdminProvider,
} from "@common/contexts";

function Inner() {
  const { loading, products, create, remove, upload } = useCatalogAdmin();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<Partial<ProductType>>({
    name: "",
    price: 0,
    stock: 0,
    image: "",
    categoryId: "",
      badgeIds: [],
    description: "",
  });
  const [tagsInput, setTagsInput] = React.useState<string>("");
  const [toast, setToast] = React.useState("");
  const [confirmId, setConfirmId] = React.useState<string | null>(null);

  const save = async () => {
    const p: ProductType = {
      id: Math.floor(Math.random() * 100000),
      name: form.name || "Novo produto",
      image: form.image || "https://picsum.photos/seed/NEW/800/600",
      price: Number(form.price) || 0,
      description: form.description || "",
      categoryId: form.categoryId || "",
      stock: Number(form.stock) || 0,
      tags: (tagsInput || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      paymentMethods: ["PIX", "Cartão"],
      shippingOptions: [
        { id: "pickup", label: "Retirada no local", icon: "store" },
      ],
    };
    await create(p);
    setOpen(false);
    setForm({
      name: "",
      price: 0,
      stock: 0,
      image: "",
      categoryId: "",
      badgeIds: [],
      description: "",
    });
    setTagsInput("");
    setToast("Produto cadastrado");
  };

  const onFile = async (
    id: ProductType["id"],
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const f = e.target.files?.[0];
    if (!f) return;
    await upload(id, f);
    setToast("Imagem enviada");
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Gestão de Catálogo</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Cadastrar
        </Button>
      </Stack>

      {products.length === 0 ? (
        <Card>
          <CardContent>
            <Typography>Nenhum produto cadastrado.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {products.map((p) => (
            <Grid key={p.id} sx={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card>
                <CardMedia
                  component="img"
                  image={p.image}
                  title={p.name}
                  sx={{
                    width: 220,
                    height: 180,
                    objectFit: "cover",
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                  }}
                ></CardMedia>

                <CardContent>
                  <Typography variant="subtitle1">{p.name}</Typography>
                  {!!(p.tags && p.tags.length) && (
                    <Stack
                      direction="row"
                      gap={1}
                      flexWrap="wrap"
                      sx={{ my: 0.5 }}
                    >
                      {p.tags.map((t, i) => (
                        <Box
                          key={i}
                          sx={{
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            bgcolor: "action.hover",
                            fontSize: 12,
                          }}
                        >
                          {t}
                        </Box>
                      ))}
                    </Stack>
                  )}
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    R$ {Number(p.price).toFixed(2)} · Estoque: {p.stock}
                  </Typography>
                  <Stack direction="row" gap={1} mt={1}>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => setConfirmId(String(p.id))}
                    >
                      Excluir
                    </Button>
                    <Button size="small" component="label">
                      Imagem
                      <input
                        type="file"
                        hidden
                        onChange={(e) => onFile(p.id, e)}
                      />
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Diálogo de novo produto */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Novo Produto</DialogTitle>
        <DialogContent>
          <Stack gap={2} mt={1} direction={{ xs: "column", md: "row" }}>
            <Stack gap={2} sx={{ flex: 1 }}>
              <TextField
                label="Nome"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoFocus
              />
              <TextField
                label="Preço"
                type="number"
                value={String(form.price || 0)}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
              />
              <FormGroup row sx={{ gap: 2 }}>
                {badges.map(b => (
                  <FormControlLabel
                    key={b.id}
                    control={<Checkbox checked={form.badgeIds?.includes(b.id) || false}
                      onChange={(e)=>{
                        const set = new Set(form.badgeIds || []);
                        if(e.target.checked) set.add(b.id); else set.delete(b.id);
                        setForm({ ...form, badgeIds: Array.from(set) });
                      }}
                    />}
                    label={b.label}
                  />
                ))}
              </FormGroup>
              <TextField
                label="Estoque"
                type="number"
                value={String(form.stock || 0)}
                onChange={(e) =>
                  setForm({ ...form, stock: Number(e.target.value) })
                }
              />
              <FormControl>
                <InputLabel id="cat-label">Categoria</InputLabel>
                <Select
                  labelId="cat-label"
                  label="Categoria"
                  value={form.categoryId || ""}
                  onChange={(e)=> setForm({ ...form, categoryId: e.target.value as string })}
                >
                  {categories.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Descrição"
                multiline
                minRows={3}
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <TextField
                label="URL da imagem (opcional)"
                value={form.image || ""}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
              <TextField
                label="Tags (separadas por vírgula)"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                helperText="Ex.: camisa, promoção, verão"
              />
            </Stack>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {form.image ? (
                <Box
                  component="img"
                  src={form.image}
                  alt="preview"
                  sx={{
                    width: "100%",
                    maxWidth: 320,
                    borderRadius: 1,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 320,
                    height: 200,
                    borderRadius: 1,
                    border: (theme) => `1px dashed ${theme.palette.divider}`,
                    display: "grid",
                    placeItems: "center",
                    color: "text.secondary",
                  }}
                >
                  Pré-visualização da imagem
                </Box>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={save} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmação de exclusão */}
      <Dialog open={!!confirmId} onClose={() => setConfirmId(null)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este produto?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmId(null)}>Cancelar</Button>
          <Button
            onClick={async () => {
              if (confirmId) {
                await remove(confirmId as any);
                setConfirmId(null);
                setToast("Produto excluído");
              }
            }}
            color="error"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!toast}
        autoHideDuration={2000}
        onClose={() => setToast("")}
      >
        <Alert severity="success" onClose={() => setToast("")}>
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function CatalogAdminPage() {
  return (
    <SecurityAdminProvider>
      <CatalogAdminProvider>
        <Inner />
      </CatalogAdminProvider>
    </SecurityAdminProvider>
  );
}

// SPA guard
export async function clientLoader() {
  const mod = await import("./guards");
  return mod.requireRole("editor");
}

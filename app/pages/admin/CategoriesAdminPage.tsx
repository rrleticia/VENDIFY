// app/pages/admin/CategoriesAdminPage.tsx
import React, { useMemo, useState } from "react";
import {
  Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Grid, IconButton, Stack, TextField, Typography, Chip, Tooltip, Switch, FormControlLabel
} from "@mui/material";
import { Edit, Delete } from "lucide-react";
import { CategoriesAdminProvider, useCategoriesAdmin } from "@common/contexts/admin/CategoriesAdminContext";
import { SecurityAdminProvider } from "@common/contexts/admin/SecurityAdminContext";
import { products } from "@common/mocks";

type FormState = { name: string; slug: string; description?: string; active?: boolean; };
const emptyForm: FormState = { name: "", slug: "", description: "", active: true };

function Inner() {
  const { categories, loading, create, update, remove } = useCategoriesAdmin();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const editing = useMemo(()=> categories.find(c => c.id === editingId) ?? null, [categories, editingId]);

  const counts = useMemo(()=>{
    const map: Record<string, number> = {};
    for (const p of products) map[p.categoryId] = (map[p.categoryId] ?? 0) + 1;
    return map;
  },[]);

  const handleOpenCreate = () => { setEditingId(null); setForm(emptyForm); setOpen(true); };
  const handleOpenEdit = (id: string) => {
    const c = categories.find(x=>x.id===id); if (!c) return;
    setEditingId(id);
    setForm({ name: c.name, slug: c.slug, description: c.description ?? "", active: c.active ?? true });
    setOpen(true);
  };
  const handleSave = async ()=>{
    if (!form.name.trim() || !form.slug.trim()) return;
    if (editingId) await update(editingId, form);
    else await create(form);
    setOpen(false);
  };
  const handleDelete = async (id: string)=>{
    const hasLinked = (counts[id] ?? 0) > 0;
    if (hasLinked) { alert("Não é possível excluir: há produtos vinculados à categoria."); return; }
    if (!confirm("Excluir categoria?")) return;
    await remove(id);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Gestão de Categorias</Typography>
        <Button variant="contained" onClick={handleOpenCreate}>Nova Categoria</Button>
      </Stack>

      {loading ? (
        <Box display="grid" placeItems="center" minHeight={200}><CircularProgress/></Box>
      ) : categories.length === 0 ? (
        <Card><CardContent><Typography>Nenhuma categoria cadastrada.</Typography></CardContent></Card>
      ) : (
        <Grid container spacing={2}>
          {categories.map((c)=>(
            <Grid key={c.id} sx={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="start" mb={1}>
                    <Typography fontWeight={700}>{c.name}</Typography>
                    <Stack direction="row" gap={1}>
                      <Chip size="small" label={`${counts[c.id] ?? 0} produto(s)`}/>
                      <IconButton size="small" onClick={()=>handleOpenEdit(c.id)}><Edit size={18}/></IconButton>
                      <IconButton size="small" onClick={()=>handleDelete(c.id)}><Delete size={18}/></IconButton>
                    </Stack>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">slug: {c.slug}</Typography>
                  {c.description ? <Typography variant="body2" mt={1}>{c.description}</Typography> : null}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={()=>setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Editar categoria" : "Nova categoria"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Preencha os campos obrigatórios e salve.</DialogContentText>
          <Stack mt={2} gap={2}>
            <TextField label="Nome *" value={form.name} onChange={(e)=> setForm({ ...form, name: e.target.value })}/>
            <TextField label="Slug *" value={form.slug} onChange={(e)=> setForm({ ...form, slug: e.target.value })}/>
            <TextField label="Descrição" multiline minRows={2} value={form.description} onChange={(e)=> setForm({ ...form, description: e.target.value })}/>
            {editing && (
              <Tooltip title={(counts[editingId!] ?? 0) > 0 ? "Desative todos os produtos antes de desativar a categoria." : ""}>
                <span>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!form.active}
                        onChange={(e)=> setForm({ ...form, active: e.target.checked })}
                        disabled={(counts[editingId!] ?? 0) > 0}
                      />
                    }
                    label="Categoria ativa"
                  />
                </span>
              </Tooltip>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>{editing ? "Salvar" : "Cadastrar"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function CategoriesAdminPage() {
  return (
    <SecurityAdminProvider>
      <CategoriesAdminProvider>
        <Inner />
      </CategoriesAdminProvider>
    </SecurityAdminProvider>
  );
}

// SPA guard
export async function clientLoader() {
  const mod = await import("./guards");
  return mod.requireRole("editor");
}

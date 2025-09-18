// CatalogPage.tsx
import {
  Box,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Typography,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { categories, products } from "@common/mocks";
import type { ProductType } from "@common/types/ProductType";
import { useSearchParams } from "react-router";

type SortKey = "relevance" | "price_asc" | "price_desc";

interface IOrderFilterProps {
  showSort: boolean;
  sort: SortKey;
  setSort: (sort: SortKey) => void;
}

// Helpers para busca (ignora acentos e caixa)
function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function matchesQuery(p: ProductType, q: string) {
  if (!q) return true;
  const nq = normalize(q);
  const fields = [p.name, p.category, (p as any).brand].filter(
    Boolean
  ) as string[];
  return fields.some((f) => normalize(f).includes(nq));
}

// Novo helper: resolve a categoria do parâmetro da URL (case/acentos-insensitive)
function resolveCategoryParam(paramValue: string | null): string | null {
  if (!paramValue) return null;
  const wanted = normalize(paramValue.trim());
  const found = categories.find((cat) => normalize(cat) === wanted);
  return found ?? null;
}

function OrderFilter({ showSort, sort, setSort }: IOrderFilterProps) {
  if (showSort)
    return (
      <ToggleButtonGroup
        value={sort}
        exclusive
        onChange={(_, v: SortKey | null) => v && setSort(v)}
        size="small"
      >
        <ToggleButton value="relevance">Relevância</ToggleButton>
        <ToggleButton value="price_asc">
          <ArrowUpwardIcon fontSize="small" sx={{ mr: 0.5 }} />
          Menor preço
        </ToggleButton>
        <ToggleButton value="price_desc">
          <ArrowDownwardIcon fontSize="small" sx={{ mr: 0.5 }} />
          Maior preço
        </ToggleButton>
      </ToggleButtonGroup>
    );
}

export default function CatalogPage() {
  const [showSort, setShowSort] = useState<boolean>(true);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [active, setActive] = useState<string | null>(null);

  const [params, setParams] = useSearchParams();
  const q = (params.get("name") ?? "").trim();
  const cParam = params.get("category"); // <- nome claro pro param cru

  // --- (1) URL -> estado: ao mudar ?category=, refletir no "active"
  useEffect(() => {
    const resolved = resolveCategoryParam(cParam);
    setActive(resolved); // se não casar, vira null (sem categoria ativa)
  }, [cParam]);

  // 1) Primeiro: filtra pelo termo de busca (sem aplicar categoria)
  const filteredByQuery = useMemo(
    () => products.filter((p) => matchesQuery(p, q)),
    [q]
  );

  // 3) Troque os handlers dos chips para atualizar a URL diretamente:
  const setCategoryParam = (cat: string | null) => {
    const next = new URLSearchParams(params);
    if (!cat) next.delete("category");
    else next.set("category", cat);
    setParams(next, { replace: true });
  };

  // 2) Contadores de categorias baseados no resultado DA BUSCA
  const countsByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of filteredByQuery) {
      map.set(p.category, (map.get(p.category) ?? 0) + 1);
    }
    return map;
  }, [filteredByQuery]);

  // 3) Depois aplica categoria ativa + ordenação
  const filtered = useMemo(() => {
    let arr = filteredByQuery.filter((p) => !active || p.category === active);
    if (sort === "price_asc") arr = [...arr].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") arr = [...arr].sort((a, b) => b.price - a.price);
    return arr;
  }, [filteredByQuery, active, sort]);

  const totalUnderQuery = filteredByQuery.length; // “Todos” sob a busca
  const showing = filtered.length;

  const clearOnlyQuery = () => {
    const next = new URLSearchParams(params);
    next.delete("name");
    setParams(next, { replace: true });
  };

  return (
    <Box>
      {/* Toolbar fixa para filtros/ordenação */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          py: 1.5,
          mb: 2,
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "background.paper"
              : "background.default",
          backdropFilter: "saturate(1.2) blur(6px)",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <FilterAltIcon fontSize="small" />
            <Typography variant="subtitle2">Categorias</Typography>
          </Stack>

          {/* Badge de contexto da busca com X para limpar só o ?name */}
          {q && (
            <Chip
              label={`Buscando por “${q}”`}
              onDelete={clearOnlyQuery}
              deleteIcon={<CloseIcon />}
              variant="outlined"
              size="small"
              sx={{ mr: 0.5 }}
            />
          )}

          {/* “Todos” reflete SOMENTE os itens que batem com a busca */}
          <Chip
            label={`Todos (${totalUnderQuery})`}
            color={!active ? "primary" : "default"}
            onClick={() => setCategoryParam(null)}
            variant={!active ? "filled" : "outlined"}
            clickable
            size="small"
          />

          {/* Chips com contagem baseada no conjunto filtrado pela busca */}
          {categories.map((c) => (
            <Chip
              key={c}
              label={`${c} (${countsByCategory.get(c) ?? 0})`}
              color={active === c ? "primary" : "default"}
              variant={active === c ? "filled" : "outlined"}
              onClick={() => setCategoryParam(c)}
              onDelete={active === c ? () => setActive(null) : undefined}
              deleteIcon={active === c ? <CloseIcon /> : undefined}
              clickable
              size="small"
              sx={{ mr: 0.5 }}
            />
          ))}

          <Box sx={{ flex: 1 }} />

          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
              {q ? (
                <>
                  Buscando por <b>“{q}”</b> ·{" "}
                </>
              ) : null}
              Exibindo <b>{showing}</b> {showing === 1 ? "item" : "itens"}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton onClick={() => setShowSort((v) => !v)}>
                <SortIcon fontSize="small" />
              </IconButton>
              <OrderFilter showSort={showSort} sort={sort} setSort={setSort} />
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/* Grid responsivo usando Grid v2 */}
      {filtered.length === 0 ? (
        <Box sx={{ py: 8, textAlign: "center", color: "text.secondary" }}>
          <Typography variant="h6" gutterBottom>
            Nada encontrado
          </Typography>
          <Typography variant="body2">
            Tente limpar os filtros ou ajustar a ordenação.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((product: ProductType) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
